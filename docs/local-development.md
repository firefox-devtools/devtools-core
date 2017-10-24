## Local Development

- [Installing Locally](#installing-locally)
  - [Linking](#linking)
  - [Local install](#local-install)

### Installing Locally

It's very common to work on a package and test it on a tool like the Debugger.
There are a couple strategies for this: link, local install, and package install.

#### Linking

Linking is the most common approach.
Here, yarn creates a symlink from the tools's `node_modules/devtools-modules` directory to the
devtools-core `devtools-modules` package directory.

* Once the tool is linked then any change in the code will be reflected in the tool.
* Making changes does not require re-starting the dev-server.
* Ignores any pre-publish steps that might be important.
* Could create a bundling issue because `devtools-modules` has its own set of node_modules, which are not shared with the debugger or other tools.

Steps for linking `devtools-modules` and `debugger.html`:

```bash
cd devtools-core/packages/devtools-modules
yarn link
cd ../../../debugger.html
yarn link devtools-modules
```

#### Local install

Local install lets you install a package locally. It's similar to publishing a new version and installing it remotely.

```bash
cd devtools-core/packages/devtools-modules
vim package.json # set version to `0.0.6-rc1`
yarn pack
cd ../../../debugger.html
yarn add ../devtools-core/packages/devtools-modules/devtools-modules-v0.0.6-rc1.tgz
```

You'll often repeat this process locally a bunch, going from `rc1` to `rc23` but it is an effective way to test out changes.
