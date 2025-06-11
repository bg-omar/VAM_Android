### Install dependencies using Yarn from NPM
| `npm i -g @angular/cli @ionic/cli @capacitor/cli` | Install globally the angular cli (used nvm version)                                     |
|--------------------------------------------------:|:----------------------------------------------------------------------------------------|
|                                 `corepack enable` | Install yarn                                                                            |
|         `yarn config set nodeLinker node-modules` | setup yarn to use node_modules folder                                                   |
|                         `yarn set version stable` | To upgrade yarn to latest version                                                       |
|                                            `yarn` | Install dependencies using yarn, does NOT MAKE `package-lock`, ONLY creates `JARN.lock` |
|         (not needed optional) -->  `yarn install` | Install dependencies and CREATE / EDIT `package-lock.json` & `JARN.lock`                |
|                                     `npm install` | before you push to github to update your package.lock.json                              |
|                  `yarn explain peer-requirements` | shows the peer dependencies errors                                                      |


# ConstantsCalculator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


find . -type f -print0 | xargs -0 sed -i 's/vlc/vam/g'
find . -type f -print0 | xargs -0 sed -i 's/Vlc/Vam/g'
find . -type f -print0 | xargs -0 sed -i 's/VLC/VAM/g'
