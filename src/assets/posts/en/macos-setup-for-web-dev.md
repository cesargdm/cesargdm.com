---
title: macOS Setup for Web Development
date: 2023
extract: How I set up a fresh Mac for web development — package manager, shell, runtimes and the handful of settings worth changing before writing any code.
technical: true
translationKey: macos-setup
---

# macOS Setup for Web Development

Every couple of years I end up in front of a brand new Mac with nothing on it, and every time I rebuild roughly the same environment from memory. This is that list, written down — the order matters more than the individual choices, because each step depends on the one before it.

## Homebrew first

Almost everything else installs through it, so it goes first.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

On Apple Silicon it installs to `/opt/homebrew` rather than `/usr/local`, and the installer prints two lines to add to your shell profile. Do not skip them — without those, `brew` works in the window you installed it from and nowhere else.

Then the tools I want on every machine:

```bash
brew install git gh
brew install --cask visual-studio-code
```

`gh` is worth the install on its own: `gh auth login` sets up both the CLI and your git credentials in one pass, which saves dealing with tokens later.

## The shell

macOS ships zsh, which is fine as-is. The only thing I change immediately is the git branch in the prompt — knowing which branch you are on without running `git status` prevents a specific and annoying class of mistake.

```bash
# ~/.zshrc
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' (%b)'
setopt PROMPT_SUBST
PROMPT='%1~${vcs_info_msg_0_} %# '
```

That is built into zsh, so it needs no framework. Frameworks like Oh My Zsh are perfectly good, but they add startup time and a lot of behaviour you did not choose, and a slow shell is felt every single time you open a terminal.

## Runtimes

Install Node through a version manager, never through Homebrew directly. Projects pin different versions and you will eventually need two at once.

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
```

With `--use-on-cd`, entering a directory with a `.nvmrc` or an `engines` field switches Node automatically. The version a project needs stops being something you have to remember.

I also install Bun, which I now reach for first on personal projects:

```bash
curl -fsSL https://bun.sh/install | bash
```

It handles installs fast enough that `node_modules` stops being something you think about, and it runs TypeScript directly. For work with an established toolchain I still use whatever the repository already standardised on — matching the lockfile matters more than any preference here.

## Editor

The extensions are covered in [6 VS Code essential extensions](/en/blog/6-vscode-essential-extensions). The settings worth changing on a new install are fewer than you would expect:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
	"files.trimTrailingWhitespace": true,
	"files.insertFinalNewline": true
}
```

Format on save is the one that changes how a team works rather than how one machine behaves. Once formatting is automatic and identical for everyone, it disappears from code review entirely.

## System settings

Three that are worth the two minutes:

**Key repeat.** Settings → Keyboard: key repeat rate to the fastest, delay to the shortest. Holding a key to move across a line is something you do hundreds of times a day.

**Press-and-hold.** Off by default in favour of accent menus, which makes holding a key do nothing useful in an editor:

```bash
defaults write -g ApplePressAndHoldEnabled -bool false
```

**Screenshots somewhere other than the Desktop**, unless you enjoy a Desktop made entirely of screenshots:

```bash
mkdir -p ~/Pictures/Screenshots
defaults write com.apple.screencapture location ~/Pictures/Screenshots
killall SystemUIServer
```

## Git

Set the identity and a couple of defaults before the first commit, not after:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
```

`pull.rebase true` is the opinionated one. It keeps a linear history instead of scattering merge commits every time you pull, which makes the log readable later.

If you sign commits, set that up now too — it is far more annoying to backfill.

## That's it

The whole thing takes about twenty minutes, most of which is waiting on downloads. Everything else — the project-specific tooling, the dotfiles you have been carrying around for years — layers on top of this without much thought.
