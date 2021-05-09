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
@nationskollen:registry=https://npm.pkg.github.com/
```

Install the library:
```
npm install --save @nationskollen/sdk
```

## Usage
Import the API client using:

```
import { Provider } from '@nationskollen/sdk'
```

## Development
### Setup
Install dependencies (`npm install`) in both root and `example/`.

### Commands
* `npm run setup` - Installs all dependencies
* `npm run dev` - Watches for changes to source files and starts react example
* `npm run build` - Build source files
* `npm run watch` - Watch source files and rebuild on changes
* `npm run lint` - Lint source code using ESLint
* `npm run format` - Format source code using prettier
* `npm publish` - Published the package to Github Packages

## Documentation
Documentation is available using `typedoc` and can be generated using one of the
commands below. Open `docs/index.html` in your browser to see the documentation.

* `npm run docs` - Generate documentation
* `npm run docs:watch` - Generate documentation and regenerate automatically on changes

