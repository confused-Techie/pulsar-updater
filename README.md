# Pulsar Updater

This package, is going to be asked for consideration of inclusion into the core editor.

This package taking over the responsibilities of all current auto update methods.

While this package doesn't actually preform an auto update, it gets as close as possible without the use of any API's managed by us, nor the use of squirrel or complex Electron features.

---

## What this Package Does

Once this package is updated, in short it will do the following:

* Attempt to determine how Pulsar is installed on a users machine. It does this by checking for a host of artifacts that would be left behind by various installation methods.
* Queries the GitHub API to find the latest regular release
* If it's found that an update is available, it will notify the user of this, customizing the notification based on the installation method.
  - If the installation method is via some type of external package manager, it will show the command to run to install the latest version.
  - If the installation method is determined to have been directly from the website, a link will be provided to the GitHub releases page.

## Supported/Checked/Recognized for Installation Methods

Since a major part of the functionality of this package is attempting to determine the installation method, it's important to list them all here:

* Windows: Chocolatey Installation
* Windows: winget Installation
* Windows: User Installation
* Windows: Machine Installation
* Windows: Portable Installation
* Linux: Flatpak Installation
* Linux: Deb-Get Installation
* Linux: Nix Installation
* Linux: Home Brew Installation
* Linux: Manual Installation 
* macOS: Home Brew Installation
* macOS: Manual Installation
