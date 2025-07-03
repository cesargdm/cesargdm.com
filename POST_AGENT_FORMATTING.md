# Post-Agent Session Formatting Guide

This document outlines the automated formatting solutions implemented to ensure code quality after each agent session.

## 🔧 Available Solutions

### 1. Git Post-Commit Hook (Automatic)
**Location**: `.git/hooks/post-commit`
**Status**: ✅ Active
**Behavior**: Automatically runs `bun run format` after every commit

The hook will:
- Format code automatically after commits
- Notify you if formatting changes were made
- Suggest amending the commit to include formatting changes

### 2. Package Script (Manual)
**Command**: `bun run post-agent`
**Purpose**: Run formatting + type checking + linting in one command

```bash
bun run post-agent
```

This runs:
- `bun run format` - Format code with Prettier
- `bun run typecheck` - TypeScript type checking  
- `bun run lint` - ESLint with zero warnings policy

### 3. Convenience Script (Manual)
**Location**: `scripts/format-after-session.sh`
**Command**: `./scripts/format-after-session.sh`

Comprehensive quality check including:
- Code formatting
- Type checking
- Linting
- Build verification

### 4. GitHub Action (Optional)
**Location**: `.github/workflows/auto-format.yml`
**Status**: ⚠️ Optional - requires enabling
**Behavior**: Auto-formats and commits changes on push

To enable this workflow:
1. Ensure you have appropriate repository permissions
2. The workflow will run on pushes to `main` and `develop` branches
3. Automatically commits formatting changes with message "🎨 Auto-format code [skip ci]"

## 🚀 Recommended Workflow

### After Each Agent Session:

1. **Automatic** (if using Git): Simply commit your changes
   ```bash
   git add .
   git commit -m "feat: your changes"
   # Formatting happens automatically via post-commit hook
   ```

2. **Manual** (quick check): Run the post-agent script
   ```bash
   bun run post-agent
   ```

3. **Manual** (full verification): Run the comprehensive script
   ```bash
   ./scripts/format-after-session.sh
   ```

## 🎯 Quality Standards Maintained

All solutions enforce the project's quality standards:
- ✅ **Prettier formatting** with `prettier-config-cretia`
- ✅ **TypeScript type checking** with strict configuration
- ✅ **ESLint with zero warnings** policy
- ✅ **Build verification** to ensure deployability
- ✅ **Perfect Lighthouse score** preservation

## 🔍 Troubleshooting

### If formatting fails:
1. Check if dependencies are installed: `bun install`
2. Verify Prettier config: `bun run format:check`
3. Check for syntax errors: `bun run typecheck`

### If Git hook isn't working:
1. Verify hook is executable: `ls -la .git/hooks/post-commit`
2. If not executable: `chmod +x .git/hooks/post-commit`

### To disable auto-formatting:
- Remove or rename `.git/hooks/post-commit`
- Comment out the GitHub Action workflow

## 📝 Notes

- All scripts use **Bun** (not npm) as per project standards
- The `[skip ci]` flag in auto-commit messages prevents infinite CI loops
- GitHub Action only runs on main repository, not forks
- Post-commit hook works locally only, not on remote pushes