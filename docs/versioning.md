## Versioning

- [Update a Package](#update-a-package)
- [Updating a Launchpad Dependency](#updating-a-launchpad-dependency)

### Update a Package

Updating a package version should not be a big deal. There are three basic steps:

1. change the package version in its `package.json`
2. run `npm publish`
3. commit the change and push to origin master.

### Updating a Launchpad Dependency

When you update a dependency of launchpad like the client adapters there are a couple more steps.

1. update the dependency version and publish it to NPM
2. update Launchpad's version and the version of the dependency
3. run `yarn` to update the lockfile
4. publish the new launchpad version to npm
5. commit the changes and push to master
