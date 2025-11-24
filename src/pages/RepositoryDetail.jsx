import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { githubService } from '../services/github';

const RepositoryDetail = () => {
    const { repoId } = useParams();
    const [repo, setRepo] = useState(null);
    const [pullRequests, setPullRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const reposData = await githubService.getRepositories();
                // repoId is actually the full_name (owner/repo)
                const currentRepo = reposData.find(r => r.full_name === decodeURIComponent(repoId));
                setRepo(currentRepo);

                if (currentRepo) {
                    const prs = await githubService.getPullRequests(currentRepo.full_name);
                    setPullRequests(prs);
                }
            } catch (error) {
                console.error('Error loading repo:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [repoId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--bg-card)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            </div>
        );
    }

    if (!repo) {
        return <div className="container py-12">Repository not found</div>;
    }

    return (
        <div className="py-12">
            <div className="container">
                <Link to="/dashboard" className="text-secondary mb-6 inline-block">
                    ← Back to Dashboard
                </Link>

                {/* Repository Header */}
                <div className="card mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="mb-3">{repo.name}</h1>
                            <p className="text-secondary mb-4">{repo.description}</p>

                            <div className="flex items-center gap-6 text-secondary">
                                <div className="flex items-center gap-2">
                                    <span>●</span>
                                    <span>{repo.language}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>⭐</span>
                                    <span>{repo.stars} stars</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔀</span>
                                    <span>{repo.forks} forks</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>Code Health</div>
                            <div
                                className="badge badge-lg"
                                style={{
                                    background: repo.health_score >= 90 ? 'var(--success)' :
                                        repo.health_score >= 80 ? 'var(--info)' :
                                            repo.health_score >= 70 ? 'var(--warning)' : 'var(--error)',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    padding: '12px 24px'
                                }}
                            >
                                {repo.health_score}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pull Requests */}
                <div className="mb-6">
                    <h2>Open Pull Requests</h2>
                    <p className="text-secondary">{pullRequests.length} pull requests waiting for review</p>
                </div>

                {pullRequests.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {pullRequests.map((pr) => (
                            <Link key={pr.id} to={`/repos/${encodeURIComponent(repo.full_name)}/pulls/${pr.number}`}>
                                <div className="card card-hover">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3>#{pr.number} {pr.title}</h3>
                                                {pr.issues_found > 0 && (
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            background: pr.critical > 0 ? 'var(--severity-critical)' :
                                                                pr.high > 0 ? 'var(--severity-high)' :
                                                                    pr.medium > 0 ? 'var(--severity-medium)' : 'var(--severity-low)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {pr.issues_found} issues
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={pr.user.avatar_url}
                                                        alt={pr.user.login}
                                                        className="rounded-full"
                                                        style={{ width: '24px', height: '24px' }}
                                                    />
                                                    <span>{pr.user.login}</span>
                                                </div>
                                                <span>wants to merge {pr.head.ref} → {pr.base.ref}</span>
                                                <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                                            </div>

                                            {pr.issues_found > 0 && (
                                                <div className="flex items-center gap-4" style={{ fontSize: '0.85rem' }}>
                                                    {pr.critical > 0 && (
                                                        <span className="badge badge-critical">{pr.critical} Critical</span>
                                                    )}
                                                    {pr.high > 0 && (
                                                        <span className="badge badge-high">{pr.high} High</span>
                                                    )}
                                                    {pr.medium > 0 && (
                                                        <span className="badge badge-medium">{pr.medium} Medium</span>
                                                    )}
                                                    {pr.low > 0 && (
                                                        <span className="badge badge-low">{pr.low} Low</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <button className="btn btn-primary btn-sm">
                                            Review →
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 className="mb-3">No Open Pull Requests</h3>
                        <p className="text-secondary">All caught up! No PRs need review at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepositoryDetail;
