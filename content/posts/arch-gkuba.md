---
title: "Arch-GKuba: my post-install wizard"
date: 2026-10-31
description: "One script that takes a fresh Arch or CachyOS install to my full desktop, with a review step before anything changes."
tags: ["Arch", "CachyOS", "Linux"]
---

Arch-based [CachyOS](https://cachyos.org/) is my desktop daily driver for gaming and coding, while my servers run Debian. [Arch-GKuba](https://github.com/gkuba/Arch-GKuba) is my desktop setup script. It's an interactive wizard that installs the package groups I want, copies my desktop assets, sets up KDE Plasma or Dank Shell on Hyprland, and runs a full system update.

## Run it

Run it as your normal user, not root. It uses `sudo` only for system changes, and you enter your password once.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/gkuba/Arch-GKuba/main/post-install.sh)
```

To see what it would do without changing anything:

```bash
./post-install.sh --dry-run
```

It fits a standard 80×24 terminal and uses up to 100 columns when it has them.

## How it works

1. **Packages and updates.** Choose the optional package groups and the full system update.
2. **Desktop assets.** Wallpapers and cursor themes from [DESetupLinux](https://github.com/gkuba/DESetupLinux).
3. **Desktop theme.** The KDE Plasma configuration *or* Dank Shell. Only one desktop is set up per machine.
4. **Review selections.** Fine-tune single items. Each one shows whether it's already installed.
5. **Review the plan.** Everything the run will do. Problems that would make it fail, like missing `paru`, block the run until they're fixed.
6. **Authenticate**, then each step runs with live output in a frame.

A few things I cared about:

- If the update or the pacman step fails, the run stops there. If a later step fails, you choose whether to continue.
- **Ctrl+C** finishes the current step safely before stopping, so it never interrupts pacman mid-transaction.
- Commands run without keyboard input, so anything that would prompt fails visibly instead of hanging.
- The last screen lists every step's result and tells you when a reboot is needed for a new kernel or DKMS module.

The script is built on my [InstallScriptTemplate](https://github.com/gkuba/InstallScriptTemplate), and so is the [dotfiles setup](/posts/my-dotfiles/).
