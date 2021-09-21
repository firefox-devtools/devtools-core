This repository is now archived. It was used to develop shared modules used in various Firefox DevTools panels. Firefox DevTools are now fully maintained in Mozilla's central repository, so there is no reason to keep this repository. 

Thanks to everyone who contributed over the years!

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
