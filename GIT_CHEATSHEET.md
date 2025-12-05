# Git Cheat Sheet for PatientScribe

Quick reference for common Git operations. You work **locally first**, GitHub is your backup.

---

## Daily Workflow (Solo Developer)

```bash
# See what's changed
git status

# Save your changes
git add .
git commit -m "Description of what you changed"

# Backup to GitHub
git push
```

That's it for 90% of your work.

---

## Starting a Big Feature (Branching)

```bash
# 1. Make sure main is clean
git status                              # Should show "nothing to commit"

# 2. Create branch (LOCAL ONLY at this point)
git checkout -b feature/your-feature-name

# 3. Work normally - commit as you go
git add .
git commit -m "Add new component"

# 4. Push branch to GitHub (first time)
git push -u origin feature/your-feature-name

# 5. Continue working
git add .
git commit -m "More changes"
git push                                # No -u needed after first push
```

### When Feature is Done

```bash
# Switch to main
git checkout main

# Merge your feature into main
git merge feature/your-feature-name

# Push updated main to GitHub
git push

# Clean up: delete the feature branch
git branch -d feature/your-feature-name              # Local
git push origin --delete feature/your-feature-name   # Remote
```

### Abandon a Feature (Something Went Wrong)

```bash
git checkout main                       # Go back to main
git branch -D feature/your-feature-name # Force delete local branch
```

---

## Viewing Information

```bash
# What branch am I on?
git branch

# What branches exist (local + remote)?
git branch -a

# What changed in this file?
git diff path/to/file.ts

# Commit history (compact)
git log --oneline

# Commit history (detailed)
git log

# Who changed what line? (blame)
git blame path/to/file.ts
```

---

## Fixing Mistakes

```bash
# Undo changes to a file (before staging)
git checkout -- path/to/file.ts

# Unstage a file (after git add, before commit)
git reset HEAD path/to/file.ts

# Undo last commit but KEEP changes
git reset --soft HEAD~1

# Undo last commit and DISCARD changes (dangerous!)
git reset --hard HEAD~1

# Change last commit message
git commit --amend -m "New message"
```

---

## Working with GitHub

```bash
# Download changes from GitHub (only needed if you edit on multiple machines)
git pull origin main

# See what remote you're connected to
git remote -v

# Push a new branch to GitHub for the first time
git push -u origin branch-name

# Push after first time
git push
```

---

## Key Concepts

| Term | Meaning |
|------|---------|
| **Working Directory** | Your actual files |
| **Staging Area** | Files marked for next commit (`git add`) |
| **Local Repository** | Your `.git` folder with all history |
| **Remote (origin)** | GitHub's copy of your repo |
| **Branch** | Parallel version of your code |
| **main** | The primary branch (formerly called "master") |
| **HEAD** | Pointer to your current commit |

---

## Commit Message Best Practices

```bash
# Good - describes WHAT changed
git commit -m "Fix provider name Dr. prefix bug in Healthcare Metadata Classifier"
git commit -m "Add Header component with back button and logo"
git commit -m "Implement local storage for recordings (max 5)"

# Bad - vague or meaningless
git commit -m "updates"
git commit -m "fix"
git commit -m "WIP"
git commit -m "asdfasdf"
```

---

## Branch Naming Conventions

```bash
feature/local-storage      # New feature
fix/provider-name-bug      # Bug fix
refactor/cleanup-stores    # Code improvement (no behavior change)
docs/update-readme         # Documentation only
```

---

## Emergency Commands

```bash
# I need to switch branches but have uncommitted work
git stash                   # Temporarily save work
git checkout other-branch   # Switch
git checkout original-branch
git stash pop               # Restore work

# I pushed something I shouldn't have (secrets, etc.)
# Contact GitHub support - git history is permanent

# Everything is broken, start fresh from GitHub
cd ..
rm -rf PatientScribe
git clone https://github.com/yourusername/PatientScribe.git
```

---

## PatientScribe-Specific Notes

**Repository:** https://github.com/dbachner/PatientScribe

**Main directories to commit:**
- `app/` - Expo mobile app
- `*.json` - n8n workflow files
- `*.md` - Documentation

**Never commit (already in .gitignore):**
- `node_modules/`
- `.env` files with secrets
- `app/.expo/`

---

*Last updated: December 5, 2025*
