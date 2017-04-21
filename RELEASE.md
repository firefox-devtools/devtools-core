### How to create a new Reps release for mozilla-central.

Before you get started, you will need clones of devtools-reps and mozilla-central, as well as
a Bugzilla account.

```
1. Prepare reps release
  a. create a release branch on github
  b. update minor version in package.json, reset build version: 
    v0.N.X -> v0.N+1.0
  c. commit `release: bump version to v0.N+1.0`
  d. create a PR on Github for this release
  e. make sure you have a configs/local.json file, with `firefox.mcPath` pointing to your mozilla-central clone

2. Copy to mozilla central
  a. update your mozilla-central clone to the latest
  b. in reps, run node bin/copy-assets.js`
  c. create a new bug in Developer Tools: Shared Components [1]
  d. commit 'Bug XXXXXXX - reps v0.N+1.0: update reps bundle from GitHub;r=reviewer'
  
3. Validate & cleanup
  a. push to try, test locally, submit for review etc ...
  b. while try fails or some problem is detected, go back to devtools-reps, fix the issue, 
     create a new bundle and go back to 2.a
  c. when everything is fine and the patch is r+, land on autoland/inbound
  d. merge the PR on github
  e. create a tag for v0.N+1.0 on github
```

After that any issue with the bundle should be addressed with a new build version. 
Ideally, if the bundle has to be updated in mozilla-central for a bugfix, a corresponding
tag should be created on GitHub.

[1] https://bugzilla.mozilla.org/enter_bug.cgi?product=Firefox&component=Developer%20Tools%3A%20Shared%20Components


### How to publish a new Reps release to npm.

Steps to publish to npm :
```
1. Checkout the latest release tag
  a. git fetch --tags # get new tags from remote
  b. git checkout tags/v0.N+1.0 # checkout the tag created for the release
2. npm login # Might ask your npm username and password
3. npm publish
```

To publish a new version of the package on npm, you need to :

1. have an npm account and 
2. be a collaborator on the package. 

If you want to become a collaborator on the Reps package, please ask the other collaborators, either through IRC or Slack, or by filing an issue in this repo.
