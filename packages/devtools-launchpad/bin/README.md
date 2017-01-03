
### Launchpad Scripts

* [Development Server](#development-server)
* [Chrome Driver](#chrome-driver)
* [Firefox Driver](#firefox-driver)
* [Firefox Proxy](#firefox-proxy)

#### Development Server

Starts a local server for running the launchpad and another tool.

#### Chrome Driver

Launches Chrome with debugger flags.

* uses a development profile

#### Firefox Driver

Launches Firefox with debugger flags.

* creates a new profile every time


#### Firefox Proxy

The proxy holds a websocket connection with the debugger and exchanges TCP messages with Firefox.

* it's now possible to have a websocket connection with firefox as well.
