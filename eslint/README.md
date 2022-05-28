# @bufferapp/eslint-config

This is the standard ESLint config files for the projects within the @bufferapp
 GitHub organization.

## Usage

```console
npm install --save-dev @bufferapp/eslint-config eslint
# or
yarn add -D @bufferapp/eslint-config eslint
```

NOTE: We will need to define custom installation instructions for front-end
 and backend-based configs, depending on those we will have different
  `peerDependencies` for the ESLint configs.

And then, on your `.eslintrc` use

```
"extends": "@bufferapp/eslint-config-backend"
#or
"extends": "@bufferapp/eslint-config-frontend"
```
