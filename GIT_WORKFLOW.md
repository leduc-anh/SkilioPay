# Git Workflow Guide - SkilioPay PayLater MVP

## Initial Setup

### 1. Initialize Repository

```powershell
cd c:\Users\Tonny\Documents\worksapce\techspire
git init
git add .
git commit -m "chore: Initial project setup with Vite + React + TypeScript"
```

### 2. Create .gitignore (already created)

The `.gitignore` file excludes:

- node_modules/
- dist/
- .env files
- IDE configs

---

## Feature Branch Workflow

### Branch Strategy

```
main (production-ready)
├── feat/paylater-ui
├── feat/eligibility-logic
├── feat/payment-processing
├── feat/retry-flow
└── feat/activity-logging
```

### Creating Feature Branches

```powershell
# Create and switch to feature branch
git checkout -b feat/paylater-ui

# Make changes to components...
git add src/components/
git commit -m "feat: Add checkout and plan details screens"

# Push to remote (if using GitHub/GitLab)
git push -u origin feat/paylater-ui
```

---

## Commit Message Conventions

Follow **Conventional Commits** specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting, missing semicolons, etc.
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests
- **chore**: Build process or auxiliary tool changes

### Examples

```powershell
# Feature commits
git commit -m "feat(checkout): Add PayLater payment option selection"
git commit -m "feat(eligibility): Implement user verification checks"
git commit -m "feat(dashboard): Add installment status tracking"

# Fix commits
git commit -m "fix(service): Correct installment amount calculation"
git commit -m "fix(ui): Resolve mobile responsiveness issue"

# Documentation commits
git commit -m "docs(readme): Add test scenario instructions"
git commit -m "docs(setup): Update installation steps"

# Refactor commits
git commit -m "refactor(service): Extract eligibility logic to separate method"
git commit -m "refactor(components): Split PhoneFrame into separate file"
```

---

## Suggested Commit History

### Phase 1: Project Setup

```powershell
git commit -m "chore: Initialize Vite + React + TypeScript project"
git commit -m "chore: Add Tailwind CSS configuration"
git commit -m "chore: Configure ESLint and TypeScript strict mode"
```

### Phase 2: Data & Types

```powershell
git commit -m "feat(data): Add mock user and cart data from CSV fixtures"
git commit -m "feat(types): Define TypeScript interfaces for Agreement, Installment"
```

### Phase 3: Business Logic

```powershell
git commit -m "feat(service): Implement eligibility checking rules"
git commit -m "feat(service): Add PayLater agreement creation logic"
git commit -m "feat(service): Implement payment processing with status updates"
git commit -m "feat(service): Add retry mechanism for failed payments"
git commit -m "feat(service): Implement activity logging"
```

### Phase 4: UI Components

```powershell
git commit -m "feat(ui): Create PhoneFrame component with mobile mockup"
git commit -m "feat(checkout): Build checkout screen with cart display"
git commit -m "feat(checkout): Add PayLater option with eligibility tooltip"
git commit -m "feat(plan-details): Create payment schedule breakdown view"
git commit -m "feat(success): Add confirmation screen with animation"
git commit -m "feat(dashboard): Build agreement tracking dashboard"
git commit -m "feat(dashboard): Add activity log developer view"
```

### Phase 5: Testing & Polish

```powershell
git commit -m "feat(controls): Add test user/cart selection controls"
git commit -m "feat(testing): Implement failure simulation toggle"
git commit -m "style(ui): Polish colors and animations"
git commit -m "fix(dashboard): Correct status badge color logic"
```

### Phase 6: Documentation

```powershell
git commit -m "docs: Add comprehensive README with features and setup"
git commit -m "docs: Create SETUP.md with test scenarios"
git commit -m "docs: Add Git workflow guide"
```

---

## Merging Feature Branches

### 1. Update Main Branch

```powershell
git checkout main
git pull origin main  # If using remote
```

### 2. Merge Feature Branch

```powershell
# Merge with commit message
git merge feat/paylater-ui -m "Merge feat/paylater-ui: Complete UI components"

# Or rebase for cleaner history
git rebase feat/paylater-ui
```

### 3. Delete Merged Branch

```powershell
git branch -d feat/paylater-ui
```

---

## Pull Request (PR) Template

### When creating a PR, include

```markdown
## Summary
Brief description of changes

## Changes Made
- Added checkout screen with PayLater option
- Implemented eligibility checking
- Created mobile-responsive UI

## Screenshots
[Attach screenshots or GIF of the flow]

## Test Scenarios
- ✅ Eligible user can select PayLater
- ✅ Ineligible user sees tooltip explanation
- ✅ First payment processes immediately
- ✅ Failed payments can be retried

## Known Issues
- In-memory storage resets on refresh
- No timezone calculation for installment dates

## Checklist
- [x] Code follows TypeScript best practices
- [x] All components are typed
- [x] UI is responsive
- [x] Test data is comprehensive
- [x] README is updated
```

---

## Release Tagging

### Version 1.0 - MVP

```powershell
# Tag the MVP release
git tag -a v1.0-mvp -m "MVP Release: PayLater 3-installment flow

Features:
- Eligibility checking
- Payment plan selection
- First payment processing
- Status tracking dashboard
- Failure simulation & retry
- Activity logging

Test coverage: 10 scenarios (eligible, ineligible, edge cases)"

# Push tags to remote
git push origin v1.0-mvp
```

### Semantic Versioning

```
v1.0-mvp    # Initial MVP
v1.1.0      # Minor update (new features)
v1.1.1      # Patch (bug fixes)
v2.0.0      # Major version (breaking changes)
```

---

## Git Commands Cheat Sheet

```powershell
# Status & Info
git status                    # Check working directory status
git log --oneline --graph     # View commit history
git diff                      # Show unstaged changes

# Branching
git branch                    # List branches
git checkout -b <branch>      # Create and switch to new branch
git branch -d <branch>        # Delete branch
git switch <branch>           # Switch to existing branch

# Staging & Committing
git add <file>                # Stage specific file
git add .                     # Stage all changes
git commit -m "message"       # Commit with message
git commit --amend            # Modify last commit

# Remote Operations
git remote add origin <url>   # Add remote repository
git push -u origin main       # Push to remote
git pull origin main          # Pull from remote
git clone <url>               # Clone repository

# Undoing Changes
git reset HEAD~1              # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (discard changes)
git checkout -- <file>        # Discard changes in file
git clean -fd                 # Remove untracked files

# Tagging
git tag                       # List tags
git tag -a <tag> -m "msg"     # Create annotated tag
git push origin <tag>         # Push specific tag
git push origin --tags        # Push all tags
```

---

## Recommended Workflow for Demo

### For Demo Presentation

```powershell
# 1. Ensure clean state
git status
git add .
git commit -m "feat: Complete MVP implementation"

# 2. Create final tag
git tag -a v1.0-mvp -m "MVP Release for internal demo"

# 3. Push to remote (GitHub/GitLab)
git remote add origin <repository-url>
git push -u origin main
git push origin --tags

# 4. Generate changelog
git log --oneline > CHANGELOG.txt
```

---

## GitHub/GitLab Setup (Optional)

### Create Remote Repository

1. Go to GitHub/GitLab
2. Create new repository: `skiliopay-paylater-mvp`
3. Don't initialize with README (already have local)

### Connect Local to Remote

```powershell
git remote add origin https://github.com/<username>/skiliopay-paylater-mvp.git
git branch -M main
git push -u origin main
git push origin --tags
```

### Enable GitHub Pages (for demo)

1. Go to repository Settings → Pages
2. Source: Deploy from branch `main`
3. Build: Use `dist/` folder after running `npm run build`

---

## Best Practices

### ✅ DO

- Commit frequently with clear messages
- Use feature branches for new work
- Keep commits focused and atomic
- Write descriptive commit messages
- Tag releases for version tracking
- Document changes in README

### ❌ DON'T

- Commit directly to `main` (use branches)
- Use vague messages like "fix stuff" or "update"
- Commit generated files (dist/, node_modules/)
- Mix multiple unrelated changes in one commit
- Force push to shared branches
- Ignore merge conflicts

---

## Troubleshooting

### Merge Conflicts

```powershell
# During merge, if conflicts occur:
git status              # See conflicted files
# Edit files to resolve conflicts (remove markers: <<<<, ====, >>>>)
git add <resolved-files>
git commit -m "merge: Resolve conflicts from feat/branch"
```

### Undo Mistakes

```powershell
# Unstage file
git reset HEAD <file>

# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert <commit-hash>
```

---

## Next Steps for Production

### Version 2.0 Planning

```powershell
git checkout -b feat/backend-api
# Implement real backend integration

git checkout -b feat/authentication
# Add user auth with JWT

git checkout -b feat/payment-gateway
# Integrate Stripe/PayPal

git checkout -b feat/notifications
# Email/SMS for payment reminders
```

---

**Last updated**: November 22, 2025  
**Repository**: c:\Users\Tonny\Documents\worksapce\techspire  
**Version**: 1.0-mvp
