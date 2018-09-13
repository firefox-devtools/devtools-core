### DevTools Core

|Package|README|
|:----:|:---:|
| [![devtools-launchpad-version]][devtools-launchpad-pkg] | [devtools-launchpad] |
| [![devtools-config-version]][devtools-config-pkg] | [devtools-config] |
| [![devtools-environment-version]][devtools-environment-pkg] | [devtools-environment] |
| [![devtools-connection-version]][devtools-connection-pkg] | [devtools-connection] |
| [![devtools-contextmenu-version]][devtools-contextmenu-pkg] | [devtools-contextmenu] |
| [![devtools-modules-version]][devtools-modules-pkg] | [devtools-modules] |
| [![devtools-services-version]][devtools-services-pkg] | [devtools-services] |
| [![devtools-splitter-version]][devtools-splitter-pkg] | [devtools-splitter] |

### Docs

- [Versioning](./docs/versioning.md)
  - [Update a Package](./docs/versioning.md#update-a-package)
  - [Updating a Launchpad Dependency](./docs/versioning.md#updating-a-launchpad-dependency)

### Testing

From the root folder:

```js
yarn test
```

#### Local Packaging

Local packaging lets you publish a package locally and try it out. One common use case is making changes to the launchpad, packaging them, and trying the out in the debugger.

```bash
cd devtools-core/packages/devtools-modules
vim package.json # bump the version and add `-rc1` e.g `0.0.6-rc1`
npm pack # note, every time you make a change you'll bump rc
cd ../../../debugger.html
yarn add file:../devtools-core/packages/devtools-modules/devtools-modules-v0.0.6-rc1.tgz
```

You'll often repeat this process locally a bunch, going from `rc1` to `rc23`. It is an effective way to test out changes.


#### Syncing Assets

We sync devtools assets like themes and widgets with [devtools-mc-assets][dma].
Updating the assets, involves publishing a new version of the package and updating
the dependency in the launchpad.

[devtools-launchpad-version]:https://img.shields.io/npm/v/devtools-launchpad.svg
[devtools-launchpad-pkg]:https://npmjs.org/package/devtools-launchpad
[devtools-launchpad]:./packages/devtools-launchpad/#readme

[devtools-environment-version]:https://img.shields.io/npm/v/devtools-environment.svg
[devtools-environment-pkg]:https://npmjs.org/package/devtools-environment
[devtools-environment]:./packages/devtools-environment/#readme

[devtools-modules-version]:https://img.shields.io/npm/v/devtools-modules.svg
[devtools-modules-pkg]:https://npmjs.org/package/devtools-modules
[devtools-modules]:./packages/devtools-modules/#readme

[devtools-contextmenu-version]:https://img.shields.io/npm/v/devtools-contextmenu.svg
[devtools-contextmenu-pkg]:https://npmjs.org/package/devtools-contextmenu
[devtools-contextmenu]:./packages/devtools-contextmenu/#readme

[devtools-connection-version]:https://img.shields.io/npm/v/devtools-connection.svg
[devtools-connection-pkg]:https://npmjs.org/package/devtools-connection
[devtools-connection]:./packages/devtools-connection/#readme

[devtools-services-version]:https://img.shields.io/npm/v/devtools-services.svg
[devtools-services-pkg]:https://npmjs.org/package/devtools-services
[devtools-services]:./packages/devtools-services/#readme

[devtools-splitter-version]:https://img.shields.io/npm/v/devtools-splitter.svg
[devtools-splitter-pkg]:https://npmjs.org/package/devtools-splitter
[devtools-splitter]:./packages/devtools-splitter/#readme

[dma]: https://github.com/jasonLaster/devtools-mc-assets
