### How to create a new devtools-source-map release for mozilla-central.

Before you get started, you will need clones of devtools-source-map and
mozilla-central, as well as a Bugzilla account.

```
1. Prepare devtools-source-map release
  a. create a release branch on github
  b. update minor version in package.json, reset build version:
    v0.N.X -> v0.N+1.0
  c. commit `Release: Bump devtools-source-map to v0.N+1.0`
  d. create a PR on Github for this release
  e. make sure you have a configs/local.json file, with `firefox.mcPath` pointing to your mozilla-central clone

2. Copy to mozilla central
  a. update your mozilla-central clone to the latest
  b. in devtools-source-map, run node bin/copy-assets.js`
  c. create a new bug in Developer Tools [1]
  d. commit 'Bug XXXXXXX - devtools-source-map v0.N+1.0: Update bundle from GitHub. r=reviewer'

3. Validate & cleanup
  a. push to try, test locally, submit for review etc ...
  b. while try fails or some problem is detected, go back to devtools-source-map, fix the issue,
     create a new bundle and go back to 2.a
  c. when everything is fine and the patch is r+, land on autoland/inbound
  d. merge the PR on github
  e. create a tag for `devtools-source-map-v0.N+1.0` on github
  f. push the tag (`git push --tags <remote>`)
  g. publish package to NPM (`npm publish`)
```

After that any issue with the bundle should be addressed with a new build version.
Ideally, if the bundle has to be updated in mozilla-central for a bugfix, a corresponding
tag should be created on GitHub.

[1] https://bugzilla.mozilla.org/enter_bug.cgi?product=Firefox&component=Developer%20Tools
