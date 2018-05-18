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
| [![devtools-source-editor-version]][devtools-source-editor-pkg] | [devtools-source-editor] |
| [![devtools-splitter-version]][devtools-splitter-pkg] | [devtools-splitter] |

### Docs

- [Installing Locally](./docs/local-development.md#installing-locally)
  - [Linking](./docs/local-development.md#linking)
  - [Local install](./docs/local-development.md#local-install)
- [Versioning](./docs/versioning.md)
  - [Update a Package](./docs/versioning.md#update-a-package)
  - [Updating a Launchpad Dependency](./docs/versioning.md#updating-a-launchpad-dependency)

### Testing

From the root folder:

```js
yarn test
```

#### Syncing Assets

We sync devtools assets like themes and widgets with [devtools-mc-assets][dma].
Updating the assets, involves publishing a new version of the package and updating
the dependency in the launchpad.

[devtools-launchpad-version]:https://img.shields.io/npm/v/devtools-launchpad.svg
[devtools-launchpad-pkg]:https://npmjs.org/package/devtools-launchpad
[devtools-launchpad]:./packages/devtools-launchpad/#readme

[devtools-config-version]:https://img.shields.io/npm/v/devtools-config.svg
[devtools-config-pkg]:https://npmjs.org/package/devtools-config
[devtools-config]:./packages/devtools-config/#readme

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

[devtools-source-editor-version]:https://img.shields.io/npm/v/devtools-source-editor.svg
[devtools-source-editor-pkg]:https://npmjs.org/package/devtools-source-editor
[devtools-source-editor]:./packages/devtools-source-editor/#readme

[devtools-splitter-version]:https://img.shields.io/npm/v/devtools-splitter.svg
[devtools-splitter-pkg]:https://npmjs.org/package/devtools-splitter
[devtools-splitter]:./packages/devtools-splitter/#readme

[dma]: https://github.com/jasonLaster/devtools-mc-assets
