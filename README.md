# controltower
a generic control center web app aka "web admin", "dashboard", "panel"…

[![built with choo v4](https://img.shields.io/badge/built%20with%20choo-v4-ffc3e4.svg?style=flat-square)](https://github.com/yoshuawuyts/choo/tree/4)
[![npm version](https://badge.fury.io/js/controltower.svg)](https://badge.fury.io/js/controltower)
[![Build Status](https://travis-ci.org/fczuardi/controltower.svg?branch=master)](https://travis-ci.org/fczuardi/controltower)
[![dependencies Status](https://david-dm.org/fczuardi/controltower/status.svg)](https://david-dm.org/fczuardi/controltower)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)][license]
[see all badges…][badges]

<a href="https://openclipart.org/detail/216736/airport-control-tower"><img src="https://openclipart.org/download/216736/airport-control-tower.svg" /></a>

[badges]: https://github.com/fczuardi/controltower/blob/master/badges.md
[license]: https://github.com/fczuardi/controltower/blob/master/LICENSE

## Bootstrap theme

This branch uses the [gentelella][gentelella] Bootstrap theme by [Colorlib][colorlib].

## Contributing

If you plan to contribute with code patches, below are some instructions on
how to setup a dev environment in your machine.

### Dependencies install
Controltower is a javascript software and use npm as package manager, you
will need to have node.js installed. To get the dependencies use:

```
npm install
```

### Controltower backend

Controltower expect some services to be up and use them as the backend, so you
will have to:

1. configure a facebook app for the customer authentication / login to work,
write down your **App Id** to use on your **config.js** file
2. configure and launch a [controltower-api][controltower-api] server to be
used as the backend
3. if you plan to use [sage][sage] features, configure and launch a sage server
to be used as the sage api backend

### Generate the config.js file

There is a small shell script that can generate simple controltower config files
by replacing the placeholders on the config-sample.js file with their respective
env vars of your machine, if you want to use it you can run:

```
npm run create:config
```
to create, or:
```
npm run create:config -- replace
```
to replace.

### Launch the webserver

```
npm start
```

And access it on ```http://localhost:9966```


[gentelella]: https://github.com/puikinsh/gentelella
[colorlib]: https://colorlib.com/
[controltower-api]: https://github.com/calamar-io/controltower-api
[sage]: https://github.com/calamar-io/wiki/wiki/Sage
