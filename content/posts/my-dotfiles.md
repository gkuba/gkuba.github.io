---
title: "My dotfiles"
date: 2022-11-17T16:29:14-07:00
lastmod: 2026-10-31
description: "My shell, prompt and editor config, kept in a Git bare repo and installed by a full-screen setup wizard."
tags: ["Linux", "Dotfiles", "Zsh"]
aliases: ["/posts/mydotfiles/"]
---

My [dotfiles](https://github.com/gkuba/dotfiles) keep the shell, prompt and editor the same on every machine. The setup script installs the tools, deploys the config from a Git bare repo, syncs Zsh plugins, installs a Starship prompt chosen by hostname and applies my Fastfetch settings.

Other Starship themes are in [gkuba/Starship-Configs](https://github.com/gkuba/Starship-Configs).

## Quick setup

Paste this into a Bash-compatible terminal:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/gkuba/dotfiles/master/setup-dotfiles.sh)
```

On fish or another shell without process substitution, start `bash` first. Run it as your normal user in a terminal of at least 80×24. It asks for your sudo password only after you confirm the plan.

To see everything it would do without changing anything, add `--dry-run`:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/gkuba/dotfiles/master/setup-dotfiles.sh) --dry-run
```

## The wizard

1. **Packages:** Zsh, Starship, fzf, eza, Fastfetch and Neovim, plus Git, curl, 7zip, unzip, iproute2 and the Fira Code font.
2. **Dotfiles:** the bare repo, Zsh plugins, the Starship prompt, backups of conflicting files and standalone app configs.
3. **System and Fastfetch:** a full system update, Zsh as the login shell, the hosts block and the Fastfetch image.
4. **Review selections**, where single items can be switched on or off.
5. **Review the plan.** Anything that would make the run fail is shown as a blocker.
6. **Authenticate**, then each step runs with its output on screen.

Keys: ↑↓ move, Space toggles, Enter goes on, B goes back, Esc quits.

## Command-line options

Selection options open the wizard at the review screen. Nothing runs until you confirm.

```text
-p, --packages     Shell tools, utilities, and the Fira Code font
-d, --dotfiles     Bare dotfiles repo (~/dotfiles), Zsh plugins, Starship prompt
-s, --system       Zsh as the login shell and the managed /etc/hosts block
-u, --update       Full system update before packages are installed
-A, --all          -p, -d and -s (add -u for a system update)
-n, --dry-run      Show every command that would change the system, change nothing
-h, --help         Show the help
```

Short options combine, so `setup-dotfiles.sh -dn` previews a dotfiles update.

## The bare repo

The repo lives at `~/dotfiles` and uses your home directory as its work tree. Manage it with the `dotgit` function from `.shell_functions`:

```bash
dotgit() { /usr/bin/git --git-dir="$HOME/dotfiles/" --work-tree="$HOME" "$@"; }
```

```bash
dotgit status
dotgit add ~/.zshrc
dotgit commit -m "Update zshrc"
dotgit push
```

On a new machine the script clones over HTTPS, so you don't need an SSH key yet. Before the first checkout it finds files the checkout would overwrite and moves them to `~/.dotfiles-backup`. On an existing repo it only fast-forwards, and stops with nothing changed if you have local edits or unpushed commits.

To use this for your own dotfiles, fork the repo and point the script at your fork.
