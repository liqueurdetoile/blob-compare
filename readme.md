[![Build Status](https://travis-ci.org/liqueurdetoile/blob-compare.svg?branch=master)](https://travis-ci.org/liqueurdetoile/blob-compare)
[![Coverage Status](https://coveralls.io/repos/github/liqueurdetoile/blob-compare/badge.svg?branch=master)](https://coveralls.io/github/liqueurdetoile/blob-compare?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Documentation](https://liqueurdetoile.github.io/blob-compare/badge.svg)](https://liqueurdetoile.github.io/blob-compare/)
[![Greenkeeper badge](https://badges.greenkeeper.io/liqueurdetoile/blob-compare.svg)](https://greenkeeper.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<p align="center"><a href="https://liqueurdetoile.com" target="\_blank"><img src="https://hosting.liqueurdetoile.com/logo_lqdt.png" alt="Liqueur de Toile"></a></p>

# Blob comparison utility
`blob-compare` is a small tool with no dependencies designed to provide some useful methods to compare two blobs with various goals :

- Comparison on size of two blobs
- Comparison on types of two blobs
- Comparison on data types based on magic numbers of two blobs
- Comparison byte to byte on full data or sliced subsets
- A configurable combination of any of above to evaluate blobs equality

Tool rely on native browsers buffer implementations and will likely work on any modern browser.

## Usage examples
```javascript
// assuming img1 and img2 are two blobs vars

/** Fully compare two blobs */
blobCompare.isEqual(img1, img2)

/** Compare file types */
blobCompare.isEqual(img1, img2, {methods: ['magic']})
// or
blobCompare.magicNumbersEqual(img1, img2)

/** Compare file types AND the last 100 bytes of blobs */
blobCompare.isEqual(img1, img2, {
  methods: ['bytes'],
  sizes: [-100]
})
// or
(blobCompare.magicNumbersEqual(img1, img2) &&
blobCompare.bytesEqualWithArrayBuffer(img1, img2, -100))

/** Compare file types OR the last 100 bytes of blobs */
blobCompare.isEqual(img1, img2, {
  methods: ['bytes'],
  sizes: [-100],
  partial: true
})
// or
(blobCompare.magicNumbersEqual(img1, img2) ||
blobCompare.bytesEqualWithArrayBuffer(img1, img2, -100))
```
To speed up things, `isEqual` with its defaults, checks first of sizes are the same, then types and finally performs a byte to byte comparison to ensure blobs equality.

## Installation
You can install it from `npm` or `yarn` :
```bash
npm install blob-compare

yarn add blob-compare
```
`blob-compare` can also be required as a script from any CDN mirroring NPM or Github, like :
- [jsDelivr](https://www.jsdelivr.com/?query=blob-compare)
- [unpkg](https://unpkg.com/)

The global `blobCompare` will be automatically set after script was downloaded.

## Documentation
Methods are fully documented and docs are available on [github pages](https://liqueurdetoile.github.io/blob-compare/).

## Issues and PRs
Any bugs and issues can be filed on the [github repository](https://github.com/liqueurdetoile/blob-compare/issues).

You are free and very welcome to fork the project and submit any PR to fix or improve `blob-compare`.
