# Determiners of Each Platform

Determining exactly how a program installed doesn't seem to be the easiest thing, but lets attempt to do our best here, and see what we can find.

## Windows

On Windows there are two installer files for Pulsar:
  * Pulsar Setup
  * Pulsar ZIP Portable

Additionally, Pulsar has a few official supported methods:
  * chocolatey: Uses Pulsar Setup

Although, during the regular Pulsar Setup installation steps, users are able to choose between installing Pulsar as the User, or Machine wide.

Meaning there are the following installation methods for Pulsar on Windows:
  * Pulsar Setup User Installation
  * Pulsar Setup Machine Installation
  * Pulsar Portable
  * Chocolatey (Using Pulsar Setup)

Since the chocolatey install will leave identical installation traces as Pulsar setup, we **must** check if the program was installed via chocolatey first. Which luckily we can determine with ease after running the following in the terminal.

```bash
choco list --local-only
```

Then we check if that returns a string `pulsar`.

As for determining if it's been installed via User or Machine, is slightly more complex.
But luckily we can simple check if the same Keypath exists in the registry, checking either the User registry, or Machine registry.

If all the above methods fail, then we assume the user has installed the portable version.

## Linux

On Linux there are a few supported installation methods:
  * x86_64:
    - `deb`
    - `rpm`
    - `Appimage`
    - `tar.gz`
  * ARM_64
    - `deb`
    - `rpm`
    - `Appimage`
    - `tar.gz`

Additionally, there are a few community maintained methods of installation:
  * Flatpak:
    - x86_64: `deb`
    - ARM_64: `deb`
  * AUR:
    - x86_64: `deb`
  * Nix:
    - x86_64: `tar.gz`
    - ARM_64: `tar.gz`
  * deb-get:
    - x86_64: `deb`
    - ARM_64: `deb`

Now here is some super messy data about determining installation on Linux:

Via flatpak is easy, use the flatpak CLI to determine if it was installed this way.
We can likely do the same for AUR, NIX, and deb-get.
Additionally, on each platform we know what they support, or at least what file type they are using, and we can use `process.arch` to determine the platform.

But the hard part will be figuring out how something is installed otherwise, such as a user just installing one of the above.

Taking a look at installation method, using the x86_64 `deb` installed via `dpkg`, while we could use `sudo dpkg-query -f '${binary:Package}\n' -W | grep pulsar` to determine if Pulsar is installed via this method, obviously we can't use `sudo` as a child process within a package for Pulsar. Meaning we would either have to attempt to elevate, or otherwise, we may only be able to report if an installation was done via one of the above package managers, or if it was done via manual user intervention, and open to the website for the newest version. Which is much more in line with the original thoughts of this package, but is a little disappointing.
