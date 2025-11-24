# Quick Setup Guide

## Step 1: Create GitHub OAuth App

1. Visit: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Name: CodeReview AI
   - Homepage: http://localhost:5173
   - Callback: http://localhost:5173/auth/callback
4. Copy your Client ID

## Step 2: Configure App

Create `.env` file:
```bash
VITE_GITHUB_CLIENT_ID=paste_your_client_id_here
```

## Step 3: Run

```bash
npm install
npm run dev
```

## Testing with Real Repos

1. Click "Connect GitHub" on landing page
2. Authorize the app
3. You'll see YOUR real repositories!
4. Click any repo to see open PRs
5. Click a PR to see automated code analysis

The app will analyze actual code from your PRs using pattern matching for:
- SQL injection vulnerabilities
- Security issues (hardcoded secrets, XSS, eval usage)
- Common bugs (var usage, console logs, type issues)
- Performance problems

## Important Notes

- The current OAuth flow is simplified (no backend)
- For production, you need a backend server to handle token exchange securely
- The client secret should NEVER be in frontend code
- Code analysis runs client-side using pattern matching
- PR reviews/comments use GitHub API (requires proper token)

Enjoy! 🚀
