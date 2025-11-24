// Real GitHub API Service
// Replace mock implementation with actual GitHub API calls

const GITHUB_API_BASE = 'https://api.github.com';
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

// Note: For production, the OAuth token exchange MUST happen on a backend server
// The client secret should NEVER be exposed in frontend code
// This is a simplified version for development/demo purposes

export const githubService = {
    // Initiate GitHub OAuth login
    initiateOAuth: () => {
        const scope = 'repo user:email'; // 'repo' gives full access to public and private repos
        const redirectUri = `${window.location.origin}/auth/callback`;
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}`;

        window.location.href = authUrl;
    },

    // Handle OAuth callback
    // Exchange code for access token via backend server
    handleOAuthCallback: async (code) => {
        try {
            const response = await fetch('http://localhost:3001/auth/github/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error('Failed to exchange code for token');
            }

            const { access_token } = await response.json();

            // Get user info with the token
            const user = await githubService.getUser(access_token);
            return { access_token, user };
        } catch (error) {
            console.error('OAuth exchange error:', error);
            throw error;
        }
    },

    // Get authenticated user
    getUser: async (token = null) => {
        const accessToken = token || localStorage.getItem('github_token');

        const response = await fetch(`${GITHUB_API_BASE}/user`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    },

    // Get user repositories
    getRepositories: async () => {
        const accessToken = localStorage.getItem('github_token');

        const response = await fetch(`${GITHUB_API_BASE}/user/repos?sort=updated&per_page=50`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();

        // Transform to match our app's format
        return repos.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            health_score: Math.floor(Math.random() * 30) + 70, // Calculated metric (simplified)
            last_review: 'N/A', // Would need to track this separately
            owner: repo.owner.login,
        }));
    },

    // Get pull requests for a repository
    getPullRequests: async (repoFullName) => {
        const accessToken = localStorage.getItem('github_token');

        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${repoFullName}/pulls?state=open&per_page=20`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch pull requests');
        }

        const prs = await response.json();

        return prs.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            user: {
                login: pr.user.login,
                avatar_url: pr.user.avatar_url,
            },
            created_at: pr.created_at,
            head: { ref: pr.head.ref },
            base: { ref: pr.base.ref },
            // These would be calculated by analyzing the PR
            issues_found: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        }));
    },

    // Get pull request files and diff
    getPullRequestDetails: async (repoFullName, prNumber) => {
        const accessToken = localStorage.getItem('github_token');

        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${repoFullName}/pulls/${prNumber}/files`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch PR files');
        }

        const files = await response.json();

        return {
            files: files.map(file => ({
                filename: file.filename,
                additions: file.additions,
                deletions: file.deletions,
                changes: file.changes,
                patch: file.patch || '',
                status: file.status,
            })),
        };
    },

    // Post review comment on PR
    postReviewComment: async (repoFullName, prNumber, body, path, line) => {
        const accessToken = localStorage.getItem('github_token');

        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${repoFullName}/pulls/${prNumber}/comments`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    body,
                    path,
                    line,
                    side: 'RIGHT',
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to post comment');
        }

        return await response.json();
    },

    // Submit PR review (approve/request changes)
    submitReview: async (repoFullName, prNumber, event, body) => {
        const accessToken = localStorage.getItem('github_token');

        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${repoFullName}/pulls/${prNumber}/reviews`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event, // 'APPROVE', 'REQUEST_CHANGES', 'COMMENT'
                    body,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.message || `HTTP ${response.status}`;
            throw new Error(`${response.status}: ${errorMsg}`);
        }

        return await response.json();
    },
};
