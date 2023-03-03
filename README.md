###

Just couple of pages converted to TS as POC

### Setup

- Steps to create new project

* `npm init -y` to start new project
* `npm i cypress typescript`
* `npx tcs --init` in cypress folder or copy tsconfig.json
* `npm cypress open` to initialize the project

* Add eslint and initialize `npx eslint --init`
  add as last one "extends": ["plugin:cypress/recommended"], ?
* Add .prettierrc.json for line length and quotes

* Add other if needed and run `npm install` to install all required dependencies
* `npm install typescript -g` when you have admin rights, otherwise run commands with `npx`

### Running compilation

Run `npx tsc --noEmit` or add "noEmit": true in compilerOptions in tsconfig.
