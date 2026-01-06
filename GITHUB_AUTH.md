# GitHub Authentication Setup

## Option 1: Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "headfreezer-repo"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Use the token to push:**
   ```bash
   git push https://YOUR_TOKEN@github.com/ElizaBackrooms/headfreezer.git main
   ```
   Replace `YOUR_TOKEN` with your actual token.

3. **Or update remote URL:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/ElizaBackrooms/headfreezer.git
   git push origin main
   ```

## Option 2: Install GitHub CLI

1. **Install GitHub CLI:**
   - Download from: https://cli.github.com/
   - Or use winget: `winget install GitHub.cli`

2. **Login:**
   ```bash
   gh auth login
   ```
   Follow the prompts to authenticate.

3. **Then push:**
   ```bash
   git push origin main
   ```

## Option 3: Clear Cached Credentials

If you want to use your GitHub account directly:

```bash
# Clear Windows credential manager
cmdkey /delete:git:https://github.com

# Then try pushing - it will prompt for credentials
git push origin main
```

## Current Issue

The system is using cached credentials for "buttpooper1234" which doesn't have access to the repository. You need to authenticate as the account that owns the repository.

