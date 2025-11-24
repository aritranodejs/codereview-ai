import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { githubService } from '../services/github';

const Dashboard = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRepos = async () => {
            try {
                const data = await githubService.getRepositories();
                setRepos(data);
            } catch (error) {
                console.error('Error loading repos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRepos();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--bg-card)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            </div>
        );
    }

    const totalIssues = repos.reduce((sum, repo) => sum + repo.open_issues, 0);
    const avgHealthScore = Math.round(repos.reduce((sum, repo) => sum + repo.health_score, 0) / repos.length);

    // Calculate estimated time saved (15 mins per issue found)
    const timeSavedHours = Math.round((totalIssues * 15) / 60 * 10) / 10;

    return (
        <div className="dashboard py-16">
            <div className="container">
                <div className="mb-8">
                    <h1 className="mb-3">Dashboard</h1>
                    <p className="text-secondary" style={{ fontSize: '1.1rem' }}>Manage your connected repositories and review pull requests</p>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-5 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    <div className="card" style={{ padding: '1.75rem' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Connected Repositories</div>
                        <div className="text-gradient font-bold" style={{ fontSize: '2.75rem', lineHeight: '1' }}>{repos.length}</div>
                    </div>
                    <div className="card" style={{ padding: '1.75rem' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Open Pull Requests</div>
                        <div className="text-gradient font-bold" style={{ fontSize: '2.75rem', lineHeight: '1' }}>{totalIssues}</div>
                    </div>
                    <div className="card" style={{ padding: '1.75rem' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Avg. Code Health</div>
                        <div className="text-gradient font-bold" style={{ fontSize: '2.75rem', lineHeight: '1' }}>{avgHealthScore}%</div>
                    </div>
                    <div className="card" style={{ padding: '1.75rem' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Time Saved This Week</div>
                        <div className="text-gradient font-bold" style={{ fontSize: '2.75rem', lineHeight: '1' }}>{timeSavedHours || 0}h</div>
                    </div>
                </div>

                {/* Repositories */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 style={{ marginBottom: '0.25rem' }}>Your Repositories</h2>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>{repos.length} repositories</p>
                    </div>
                    <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        + Create New
                    </a>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {repos.map((repo) => (
                        <Link key={repo.id} to={`/repos/${encodeURIComponent(repo.full_name)}`}>
                            <div className="card card-hover" style={{ padding: '1.5rem' }}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1" style={{ minWidth: 0 }}>
                                        <h3 className="mb-2" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{repo.name}</h3>
                                        <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
                                            {repo.description || 'No description provided'}
                                        </p>
                                    </div>
                                    {repo.health_score && (
                                        <div
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '0.9rem',
                                                fontWeight: '700',
                                                marginLeft: '1rem',
                                                flexShrink: 0,
                                                background: repo.health_score >= 90 ? 'var(--success)' :
                                                    repo.health_score >= 80 ? 'var(--info)' :
                                                        repo.health_score >= 70 ? 'var(--warning)' : 'var(--error)',
                                                color: 'white'
                                            }}
                                        >
                                            {repo.health_score}%
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 text-secondary mb-6" style={{ fontSize: '0.875rem' }}>
                                    {repo.language && (
                                        <div className="flex items-center gap-2">
                                            <span style={{ color: 'var(--primary)' }}>●</span>
                                            <span style={{ fontWeight: '500' }}>{repo.language}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span>⭐</span>
                                        <span style={{ fontWeight: '500' }}>{repo.stars}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>🔀</span>
                                        <span style={{ fontWeight: '500' }}>{repo.forks}</span>
                                    </div>
                                </div>

                                <div className="pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <div className="flex items-center justify-between" style={{ fontSize: '0.85rem' }}>
                                        <span className="text-secondary" style={{ fontWeight: '500' }}>
                                            {repo.open_issues} open {repo.open_issues === 1 ? 'issue' : 'issues'}
                                        </span>
                                        <span className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{repo.full_name}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {repos.length === 0 && (
                    <div className="card text-center py-12">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                        <h3 className="mb-3">No Repositories Found</h3>
                        <p className="text-secondary mb-6">Create a repository on GitHub or grant access to existing ones</p>
                        <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            Create Repository on GitHub
                        </a>
                    </div>
                )}            </div>
        </div>
    );
};

export default Dashboard;
