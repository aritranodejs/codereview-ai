# 🚀 How to Approve Pull Requests (Workaround)

Since GitHub **blocks you from approving your own PRs**, here is how to test the approval functionality:

## Method 1: The "Two Browser" Method (Easiest)

1.  **Open Incognito/Private Window**
2.  Log in to GitHub with a **different account** (create a dummy one if needed)
3.  Go to your repository
4.  Fork it or ask to be added as a collaborator
5.  Create a Pull Request from that second account
6.  **Go back to CodeReview AI** (logged in as your main account)
7.  You will see the PR from the other account
8.  **Now you can click "Approve PR"** and it will work! ✅

## Method 2: The "Collaborator" Method

1.  Ask a friend or colleague to fork your repo
2.  Have them create a simple PR (e.g., update README)
3.  Refresh CodeReview AI
4.  Review and Approve their PR

## Method 3: Test on a Public Repo

1.  Find a public repository where you are a maintainer (but not the PR author)
2.  Connect it to CodeReview AI
3.  Review PRs from other contributors

## Why is this necessary?

**CodeReview AI uses the real GitHub API.**
It enforces the same rules as GitHub.com:
> "Pull request authors cannot approve their own pull requests."

This ensures that the "Approve" button in our app does exactly what it would do on GitHub!
