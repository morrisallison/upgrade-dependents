# Upgrade Dependents

> A utility to upgrade package dependents.

[![npm Version][badge-npm]][npm]
[![MIT License][badge-license]][license]
[![Travis CI Build Status][badge-travis]][travis]

[badge-license]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-npm]: https://img.shields.io/npm/v/upgrade-dependents.svg?style=flat-square
[badge-travis]: https://img.shields.io/travis/morrisallison/upgrade-dependents.svg?style=flat-square
[license]: https://github.com/morrisallison/upgrade-dependents/raw/master/LICENSE
[npm]: https://www.npmjs.com/package/upgrade-dependents
[travis]: https://travis-ci.org/morrisallison/upgrade-dependents

## Usage

### CLI

The utility can be used without any configuration or installation with [`npx`][npx], which is available with [`npm@5.2.0`][npm@5.2.0] or later.

```bash
cd /workspace/packages/my-package
npx upgrade-dependents --help
```

[npx]: https://github.com/zkat/npx
[npm@5.2.0]: https://github.com/npm/npm/releases/tag/v5.2.0

### Programmatically

Upgrade Dependents can be used programmatically via import.

```javascript
import upgradeDependents from 'upgrade-dependents';

upgradeDependents("/workspace/packages/my-package");
```

### Semantic Release

Upgrade Dependents can also be used as a plugin for [Semantic Release][]. This is particularly useful when used with [Semantic Release Monorepo][].

[Semantic Release]: https://github.com/semantic-release/semantic-release
[Semantic Release Monorepo]: https://github.com/Updater/semantic-release-monorepo

_Example configuration:_

> `/workspace/packages/my-package/package.json`

```json
{
  "release": {
    "prepare": [
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "upgrade-dependents/semantic-release"
      "@semantic-release/git"
    ]
  }
}
```

## Installation

Node.js via [Yarn](https://yarnpkg.com/)

```bash
yarn add upgrade-dependents -D
```

Node.js via [npm](https://www.npmjs.com/)

```bash
npm i upgrade-dependents -D
```

## License

Copyright &copy; 2018 [Morris Allison III](http://morris.xyz).
<br>Released under the [MIT license][license].
