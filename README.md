# 2023-gcrg_debt

**Live demo** https://unctad-infovis.github.io/2023-gcrg_debt/

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Webpack + React project.

- `npm install`
- `npm start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`



All these projects are build with [Webpack](https://webpack.js.org/) and usually they make use of [React](https://reactjs.org/).

Webpack is a tool that allows to build modern Javascript projects and React is a Javascript library that allows more structured way to build interfaces.

Other Javascript libraries like [D3.js](https://d3js.org/) or [Highcharts](https://www.highcharts.com/) might be also used as needed.

## Prerequisites

* [Git](https://git-scm.com/)
* [NPM](https://www.npmjs.com/)
* [azcopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-ref-azcopy) or [Microsoft Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/)
* [Any text editor](https://www.sublimetext.com/) and basic knowledge of Javascript, CSS and HTML 

## How to install and run

Each project is defined by a `package.json` file. Clone a project and install the required packages.

For example:
`$ git clone git@ssh.dev.azure.com:v3/UNCTAD-DevOps/Data%20visualizations%20code/2022-tdr_report`
`$ cd 2022-tdr_report`
`$ npm install`

Once the installation has finished you can run `npm run start` to start the the development server and a browser window with url `http://localhost:8080` should open.

## How to develop

All the source code is located in the folder `src` where you will find subfolders for Javascript (`jsx`) and for CSS (`styles`). These are usually your main concern. The `html` folder and `index.html` usually only keep a single DOM-container.

The `fonts` folder holds the Google Font `Roboto:400,700` that is available on unctad.org. If you want to add more fonts these would go to `styles`.

Once you make a change to the source code you can see the changes automatically in your browser upon saving the file.

The Javascript is usually written with React and Less is used to write the CSS.

### Code style rulebook

* Use spaces instead of tabs.
* Use two spaces for single inline
* Follow the linting rules.
* Make attributes alphabetical where approriate
* Make CSS rules alphabetical
* Encapsulate your selectors and the CSS to avoid collision

## How to push to production

Run:
`$ npm run build`

to build a production version of the project. You will find the production version from `public` folder. Make sure all resources are present and if not edit `webpack.common.js` file.

Run:
`$ npm run sync-prod`

to sync the production build to Azure storage. The command assumes a predefined global variable `AZURE_STORAGE_NAME`. 

!!!Don't store the global variable in Git!!!

Your command line client needs to be authenticated with the Azure Storage. You can login with

`$ npm run login` 

if you have set global variables for `AZURE_USER`, `AZURE_PW` and `AZURE_TENT` or you can run

`$ az login --service-principal -u $AZURE_USER -p $AZURE_PW --tenant $AZURE_TENANT`

You can also use the GUI tool to upload the files if you don't want to install `azcopy`. In this case upload the contents of `public` folder to corresponding folder (i.e `2022-tdr_report`) in Azure storage.


