import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { githubService } from '../services/github';
import { analyzePatch } from '../services/analysis';

const PullRequestReview = () => {
    const { repoId, prId } = useParams();
    const navigate = useNavigate();
    const [pr, setPr] = useState(null);
    const [prDetails, setPrDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [repo, setRepo] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // repoId is full_name, prId is PR number
                const repoFullName = decodeURIComponent(repoId);
                const prNumber = parseInt(prId);

                // Get repository info
                const repos = await githubService.getRepositories();
                const currentRepo = repos.find(r => r.full_name === repoFullName);
                setRepo(currentRepo);

                // Get all PRs to find the current one
                const prs = await githubService.getPullRequests(repoFullName);
                const currentPr = prs.find(p => p.number === prNumber);
                setPr(currentPr);

                // Get PR file details
                const details = await githubService.getPullRequestDetails(repoFullName, prNumber);
                setPrDetails(details);
            } catch (error) {
                console.error('Error loading PR:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [repoId, prId]);

    const handleApprove = async () => {
        try {
            const repoFullName = decodeURIComponent(repoId);
            await githubService.submitReview(repoFullName, parseInt(prId), 'APPROVE', 'Looks good! ✅');
            alert('✅ PR approved successfully! Review posted to GitHub.');
        } catch (error) {
            console.error('Approval error:', error);
            if (error.message.includes('422')) {
                alert('❌ Cannot approve this PR.\n\nYou cannot approve your own pull request. GitHub requires a different reviewer.');
            } else {
                alert('❌ Error approving PR: ' + error.message + '\n\nMake sure you have the necessary permissions.');
            }
        }
    };

    const handleRequestChanges = async () => {
        try {
            const repoFullName = decodeURIComponent(repoId);
            await githubService.submitReview(repoFullName, parseInt(prId), 'REQUEST_CHANGES', 'Please address the issues found by CodeReview AI');
            alert('✅ Changes requested successfully! Review posted to GitHub.');
        } catch (error) {
            console.error('Request changes error:', error);
            if (error.message.includes('422')) {
                alert('❌ Cannot request changes on this PR.\n\nYou cannot review your own pull request.');
            } else {
                alert('❌ Error requesting changes: ' + error.message + '\n\nMake sure you have the necessary permissions.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--bg-card)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            </div>
        );
    }

    if (!pr || !prDetails) {
        return <div className="container py-12">Pull request not found</div>;
    }

    // Analyze files
    const storedSettings = localStorage.getItem('codereview_settings');
    const settings = storedSettings ? JSON.parse(storedSettings) : {};

    const filesWithIssues = prDetails.files.map(file => ({
        ...file,
        analyzedIssues: file.issues || analyzePatch(file.patch, 'javascript', settings),
    }));

    const allIssues = filesWithIssues.flatMap(f => f.analyzedIssues);
    const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
    const highCount = allIssues.filter(i => i.severity === 'high').length;
    const mediumCount = allIssues.filter(i => i.severity === 'medium').length;
    const lowCount = allIssues.filter(i => i.severity === 'low').length;

    return (
        <div className="py-12">
            <div className="container-wide">
                <Link to={`/repos/${repoId}`} className="text-secondary mb-6 inline-block">
                    ← Back to Repository
                </Link>

                {/* PR Header */}
                <div className="card mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="mb-3">#{pr.number} {pr.title}</h1>
                            <div className="flex items-center gap-4 text-secondary">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={pr.user.avatar_url}
                                        alt={pr.user.login}
                                        className="rounded-full"
                                        style={{ width: '28px', height: '28px' }}
                                    />
                                    <span>{pr.user.login}</span>
                                </div>
                                <span>wants to merge <code>{pr.head.ref}</code> into <code>{pr.base.ref}</code></span>
                                <span>•</span>
                                <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Issue Summary */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-muted">Issues Found:</div>
                        {criticalCount > 0 && <span className="badge badge-critical">{criticalCount} Critical</span>}
                        {highCount > 0 && <span className="badge badge-high">{highCount} High</span>}
                        {mediumCount > 0 && <span className="badge badge-medium">{mediumCount} Medium</span>}
                        {lowCount > 0 && <span className="badge badge-low">{lowCount} Low</span>}
                        {allIssues.length === 0 && <span className="badge badge-success">No issues!</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleApprove}
                            className="btn btn-primary"
                            disabled={criticalCount > 0 || highCount > 0}
                        >
                            ✅ Approve PR
                        </button>
                        <button
                            onClick={handleRequestChanges}
                            className="btn btn-secondary"
                            disabled={allIssues.length === 0}
                        >
                            🔄 Request Changes
                        </button>
                    </div>
                </div>

                {/* Files Changed */}
                <h2 className="mb-6">Files Changed ({filesWithIssues.length})</h2>

                {filesWithIssues.map((file, idx) => (
                    <div key={idx} className="card mb-6">
                        <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>
                                    <code>{file.filename}</code>
                                </h3>
                                <div className="text-secondary" style={{ fontSize: '0.9rem' }}>
                                    <span className="text-success">+{file.additions}</span>
                                    {' '}
                                    <span className="text-error">-{file.deletions}</span>
                                </div>
                            </div>
                            {file.analyzedIssues.length > 0 && (
                                <span className="badge badge-high">
                                    {file.analyzedIssues.length} issues
                                </span>
                            )}
                        </div>

                        {/* Code Diff */}
                        <pre className="bg-tertiary p-4 rounded mb-4" style={{ overflow: 'x-auto', fontSize: '0.85rem' }}>
                            <code>{file.patch}</code>
                        </pre>

                        {/* Issues in this file */}
                        {file.analyzedIssues.length > 0 && (
                            <div>
                                <h4 className="mb-4">Issues Detected:</h4>
                                <div className="flex flex-col gap-3">
                                    {file.analyzedIssues.map((issue, issueIdx) => (
                                        <div
                                            key={issueIdx}
                                            className="p-4 rounded"
                                            style={{
                                                background: 'var(--bg-tertiary)',
                                                borderLeft: `4px solid ${issue.severity === 'critical' ? 'var(--severity-critical)' :
                                                    issue.severity === 'high' ? 'var(--severity-high)' :
                                                        issue.severity === 'medium' ? 'var(--severity-medium)' : 'var(--severity-low)'
                                                    }`
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h5 style={{ fontSize: '1rem' }}>{issue.title}</h5>
                                                <div className="flex gap-2">
                                                    <span className={`badge badge-${issue.severity}`}>
                                                        {issue.severity}
                                                    </span>
                                                    <span className="badge" style={{ background: 'var(--bg-card)' }}>
                                                        {issue.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
                                                {issue.description}
                                            </p>

                                            {issue.line && (
                                                <div className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Line {issue.line}: <code>{issue.code}</code>
                                                </div>
                                            )}

                                            <div className="mt-3 p-3 rounded" style={{ background: 'rgba(67, 233, 123, 0.1)' }}>
                                                <div className="font-semibold mb-1" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                                                    💡 Suggestion:
                                                </div>
                                                <div className="text-secondary" style={{ fontSize: '0.9rem' }}>
                                                    {issue.suggestion}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filesWithIssues.length === 0 && (
                    <div className="card text-center py-12">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                        <h3 className="mb-3">No Files Changed</h3>
                        <p className="text-secondary">This PR doesn't have any file changes yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PullRequestReview;
