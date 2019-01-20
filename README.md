# Soundcube
### A Raspberry Pi-hosted audio server
###### This is the React frontend repository, see [Soundcube](https://github.com/DefaultSimon/Soundcube) for the backend portion of this project.
![Status: Alpha](https://img.shields.io/badge/status-alpha-orange.svg)  

This is a work-in-progress project, no stability is guaranteed.

## Installation
First, clone or download this repository: `git clone https://github.com/DefaultSimon/Soundcube-frontend.git`.  
Then, install the required dependencies with `npm install`. After that, you're set!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

Afterwards, serve the react app with a static server:<br>
```bash
npm install -g serve
serve -s build
```