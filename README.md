# pilfer

[![Build Status](https://travis-ci.org/matthewp/pilfer.svg?branch=master)](https://travis-ci.org/matthewp/pilfer)
[![npm version](https://badge.fury.io/js/pilfer.svg)](http://badge.fury.io/js/pilfer)

**pilfer** is a simple module bundler with an easy to use API with ES6 (and [Babel](https://babeljs.io/)) support. With the built-in watch mode rebuilds are ultra fast.

## Install

```shell
npm install -g pilfer
```

## Usage

For most projects you can simply run:

```shell
pilfer
```

In your project's folder. This will pipe results to stdout which you can then pipe into [Uglify](https://github.com/mishoo/UglifyJS2) or do whatever else you need. If you'd like to have pilfer write to a file do:

```js
pilfer -o out.js
```

Instead.

When developing use the `--watch` flag to enable watch mode:

```js
pilfer -w
```

This will automatically write to `out.js` (you can still provide a different file with `-o` of course) whenever a file in your project changes.

## License

[BSD 2-Clause](https://opensource.org/licenses/BSD-2-Clause)
