# API SDK
Implements helper functions for making calls to the Nationskollen API.

## Initial setup
Package is published using Github Packages and requires authentication to both
read and write.

First, create a new Personal token in your Github settings:
```
Settings > Developer Settings > Personal access tokens
```

Select the `write:packages` and `read:packages` scopes and click "Generate
token".

Create a new file in your home directory `~/.npmrc` containing the following:
```
//npm.pkg.github.com/:_authToken=<personal access token>
```

[Github Docs](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

## Installation
Create `.npmrc` in your project root (same directory as `package.json`)
containing the following:
```
@dsp-krabby:registry=https://npm.pkg.github.com/
```

Install the library:
```
npm install --save @dsp-krabby/sdk
```

## Usage
Import the API client using:
```
import { Client } from '@dsp-krabby/sdk'

// or if you are using commonjs
const SDK = require('@dsk-krabby/sdk')
const client = new SDK.client(...)
```

## Development
* `npm run build` - Build source files
* `npm run watch` - Watch source files and rebuild on changes
* `npm publish` - Published the package to Github Packages

## Documentation
TODO
