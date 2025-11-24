# CodeReview AI - GitHub-Integrated Automated Code Review

A production-ready SaaS platform that automatically reviews GitHub pull requests with AI-powered analysis, inline comments, and code quality insights.

## 🚀 Quick Start

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: CodeReview AI (Dev)
   - **Homepage URL**: http://localhost:5173
   - **Callback URL**: http://localhost:5173/auth/callback
4. Save the **Client ID**

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Client ID:
```
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 📖 How It Works

1. **Connect GitHub** - OAuth authentication
2. **View Repositories** - All your repos with health scores
3. **Select a PR** - See open pull requests
4. **Automatic Analysis** - Detects bugs, security issues, performance problems
5. **Inline Issues** - Issues shown on specific code lines
6. **Approve/Request Changes** - Take action on PRs

## ⚠️ Production Notes

**Current OAuth Flow**: Simplified for demo. For production:
- Need a backend to securely exchange OAuth code for token
- Never expose client secret in frontend
- Implement token refresh logic

**Recommended**: Add Node.js/Express backend with `/auth/callback` endpoint

## 🔧 Tech Stack

- React + Vite
- GitHub REST API
- Pattern-based code analysis
- Modern CSS with glassmorphism

## 📄 License

MIT
# codereview-ai
