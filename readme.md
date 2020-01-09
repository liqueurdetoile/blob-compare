[![NPM](https://nodei.co/npm/blob-compare.png)](https://nodei.co/npm/blob-compare/)

[![GitHub license](https://img.shields.io/github/license/liqueurdetoile/blob-compare)](https://github.com/liqueurdetoile/blob-compare/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/liqueurdetoile/blob-compare.svg?branch=master)](https://travis-ci.org/liqueurdetoile/blob-compare)
[![Coverage Status](https://coveralls.io/repos/github/liqueurdetoile/blob-compare/badge.svg?branch=master)](https://coveralls.io/github/liqueurdetoile/blob-compare?branch=master)
[![Gzip size](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/blob-compare@latest?compression=gzip&style=flat-square)](https://cdn.jsdelivr.net/npm/blob-compare@latest)
[![Known Vulnerabilities](https://snyk.io/test/github/liqueurdetoile/blob-compare/badge.svg)](https://snyk.io/test/github/liqueurdetoile/blob-compare)

![npm](https://img.shields.io/npm/dm/blob-compare)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Documentation](https://liqueurdetoile.github.io/blob-compare/badge.svg)](https://liqueurdetoile.github.io/blob-compare/)
[![Greenkeeper badge](https://badges.greenkeeper.io/liqueurdetoile/blob-compare.svg)](https://greenkeeper.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<p align="center"><a href="https://liqueurdetoile.com" target="\_blank"><img src="https://hosting.liqueurdetoile.com/logo_lqdt.png" alt="Liqueur de Toile"></a></p>

# Blob comparison utility
`blob-compare` is a small library designed to provide some useful methods to compare two blobs in browser with various methods :

- Comparison on size of two blobs
- Comparison on types of two blobs
- Comparison on data types based on [magic numbers](https://en.wikipedia.org/wiki/List_of_file_signatures) of two blobs
- Comparison byte to byte on full data or sliced subsets
- A configurable combination of any of above to evaluate blobs or parts of blobs equality

Tool rely on native browsers buffer implementations and will likely work on any modern browser. It have been tested and benchmarked on Chrome, Firefox and Edge.

To provide better performance, `blob-compare` automatically relies on web workers if available when performing operations on blobs.

## Installation
You can install it from `npm` or `yarn` :
```bash
npm install blob-compare

yarn add blob-compare
```
Then, simply require/import it to use it :

```javascript
const blobCompare = require('blob-compare').default;
// or
import blobCompare from 'blob-compare';
```
For browser direct usage, `blob-compare` can be required as a script from any CDN mirroring NPM or Github, for instance :
```html
<script src="https://cdn.jsdelivr.net/npm/blob-compare@latest"></script>

<script src="https://unpkg.com/blob-compare@latest"></script>

<script src="https://cdn.jsdelivr.net/gh/liqueurdetoile/blob-compare@latest/dist/index.min.js"></script>
```

A global `blobCompare` will be automatically set after script was downloaded.

## Quick reference
See [documentation](https://liqueurdetoile.github.io/blob-compare/) for a full reference.

### Conversion tools ###
All conversions are run asynchronously.

Method  |  Description
--|--
`blobCompare::toArrayBuffer` |  Converts a blob to an ArrayBuffer. it can be optionnally chunked and assigned to a web worker. Conversion is run asynchronously.
`blobCompare::toBinaryString`  |  Converts a blob to a BinaryString. it can be optionnally chunked and assigned to a web worker. Conversion is run asynchronously.

### Comparison tools ###
Method  |  Description | Sync/Async
--|--|:--:
`blobCompare::sizeEqual` | Compares size of two blobs | sync
`blobCompare::typeEqual`  | Compares types of two blobs. Types are not really reliable as they can be tricked when creating a blob |  sync
`blobCompare::magicNumbersEqual`  | Compares [magic numbers](https://en.wikipedia.org/wiki/List_of_file_signatures) of two blobs. A quick comparison is done, therefore weird data types may not be compared with 100% accuracy. In that case, simply clone repo and override this function to fit your needs | async
`blobCompare::bytesEqualWithArrayBuffer` | Converts blobs or chunk blobs to ArrayBuffers and performs a byte to byte comparison | async
`blobCompare::bytesEqualWithBinaryString`  | Converts blobs or chunk blobs to BinaryString and performs a byte to byte comparison | async
`blobCompare::isEqual`  | The swiss army knife to bundle multiple comparison methods above in one single call | async

## Usage examples
```javascript
// assuming img1 and img2 are two blobs vars

/**
 * Fully compare two blobs with default methods configuration
*/
blobCompare.isEqual(img1, img2).then(res...)

/**
 * Comparing only file types
 */
blobCompare.isEqual(img1, img2, {methods: ['magic']}).then(res...)
// or
blobCompare.magicNumbersEqual(img1, img2).then(res => ...)

/**
 *  Compare file types AND the last 100 bytes of blobs
 *  Never find a use case ^^
*/
blobCompare.isEqual(img1, img2, {
  methods: ['bytes'],
  sizes: [-100]
}).then(res => ...)

/**
 * Compare file types OR the last 100 bytes of blobs
*/
blobCompare.isEqual(img1, img2, {
  methods: ['bytes'],
  sizes: [-100],
  partial: true
}).then(res => ...)
```
To speed up things, `isEqual` with its default configuration checks first if sizes are equal, then types, then magic numbers and finally performs a byte to byte comparison to ensure blobs equality.

All methods working on bytes comparison are asynchronous, use web workers by default if available and works very well with `async/await` syntax.

## About performance
Trying to compare blobs can be tricky though the only real pitfall is most likely to run out of memory on the VM. There's not much to do with it except working only on smaller data chunks and use device storage like IndexedDb to buffer the unprocessed chunks.

### Web workers
Another caveat is likely to consume device CPU to perform operations on blobs. Web workers can be very helpful in this case. `blob-compare` is enabling web workers by default for two major reasons :
1. A worker is constructed each time a blob needs to be converted to raw binary data or array buffer. On a multi-threaded system, it allows efficient concurrency
2. Huge blobs operations won't freeze the main thread

The cons is that processing will be slower due to the copy operation. A workaround could be to use directly `ArrayBuffers` and the `blobCompare.compareBuffers` method that take advantage of the [transferable interface](https://developer.mozilla.org/en-US/docs/Web/API/Transferable) of an ArrayBuffer.

Disabling web workers can also help prevent memory issues in some cases.

### Benchmarking
**Repo is quite heavy due to fixtures.** I've tried to implement some automated bechnmarks around karma and benchmark.js but I'm quickly hitting some troubles with larger blobs, event with small blobs on Edge.

I'm not sure that I'm doing right with my benchmarks _Oo_

If I find some time, I may try on jsPerf.

Anyway, after cloning and installing this repository, you can play with fixtures and benchmarks (they are removed from npm version).

Just bash `npm run bench:all` to run them into Chrome, Firefox and Edge. You can also make ChromeHeadless accessible and use `npm run bench`

Latest results for Chrome, Firefox and Edge are stored in `results.json`

## Documentation
Methods are fully documented and docs are available on [github pages](https://liqueurdetoile.github.io/blob-compare/).

## Issues and PRs
Any bugs and issues can be filed on the [github repository](https://github.com/liqueurdetoile/blob-compare/issues).

**You are free and very welcome to fork the project and submit any PR to fix or improve `blob-compare`.**

## Changelog ##
  - **1.1.0** : Add magic numbers in default comparison methods as type value can be falsy. `blobCompare.isEqual` now returns immediately when a falsy value is encountered or at first successful comparison if partial option is set to `true`
  - **1.0.1** : Fix package content
