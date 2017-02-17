### How to create a new Reps release for mozilla-central.

Before you get started, you will need clones of devtools-reps and mozilla-central, as well as
a Bugzilla account.

```
1. Go to your clone of devtools-reps
  a. create a release branch on github
  b. update minor version in package.json, reset build version: 
    v0.N.X -> v0.N+1.0
  c. commit `release: bump version to v0.N+1.0`
  d. create a PR on Github for this release
  e. create configs/local.json, add 'firefox.mcPath' pointing to your mozilla-central clone

2. Go to your clone of mozilla-central
  a. update mozilla-central to the latest
  b. run 'node bin/copy-assets.js' 
  c. create a new bug in Developer Tools: Shared Components [1] (P3 enhancement)
  d. commit 'Bug XXXXXXX - reps v0.N+1.0: update devtools reps bundle from GitHub;r=reviewer'
  
3. Bugzilla, mozreview, try
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
