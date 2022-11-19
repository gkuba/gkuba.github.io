---
title: "Debian Post Install"
date: 2022-11-17T16:29:06-07:00
draft: false
author: "GKuba"
cover: "debian_logo.webp"
tags: ["Debian", "Linux"]
keywords: ["Debian", "Linux"]
description: "This post goes over my post install setup for Debian."
---

This is my customization for fresh Debian installs.

## Download Debian non-free netinstall

Use the following Debian ISO as the base:

- [Debian 11.5 Stable non-free][Debian ISO]

[Debian ISO]: https://cdimage.debian.org/cdimage/unofficial/non-free/cd-including-firmware/11.5.0+nonfree/amd64/iso-cd/

__NOTE:__ _do NOT grab the EDU download. This image includes non-free and firmware_

### To Install
This must be run as the `root` user.

```bash
bash <(wget -qO- https://raw.githubusercontent.com/gkuba/Debian-Gkuba/main/install.sh)
```

#### Install script information

The `install.sh` script has been completely rewritten and now allows you to run parts of it instead of the full thing.
This allows you to do things like change to the Testing repository or Install Java on a system already set up.
Full list of these functions below just append the one you want at the end of the command listed.

This example will add the Adoptium Java repo:

```bash
bash <(wget -qO- https://raw.githubusercontent.com/gkuba/Debian-Gkuba/main/install.sh) addJavaRepo
```

##### Functions

- Change repository from __"Stable"__ to __"Testing"__ (Currently named Bookworm)

```text
promptRepoChange writeSourcesList
```

You then need to run `apt update && apt upgrade` for the changes to take effect.

- Install Java

```text
promptInstallJava addJavaRepo installJava
```

This will install the Adoptium java JDK 8, 17 and 18.
You can also just add the repository if you want to install a specific version or at a later time.

###### Misc Info

My bash prompt and settings can be found here [gkuba/dotfiles][gkuba/dotfiles]

[gkuba/dotfiles]: https://github.com/gkuba/dotfiles
