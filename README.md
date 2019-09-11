# webpack-webgl-boilerplate

This is some boilerplate I wrote to easily start new WebGL projects without having to set up a build
tool chain. It makes use of [Babel](https://github.com/babel/babel-loader) and
[webgl-glsl-loader](https://github.com/grieve/webpack-glsl-loader) to compile JavaScript and GLSL
together into a final JavaScript module.

## Requirements

* npm

## Install

Run `npm install` to install dependencies.

## Usage

The following commands are defined in `package.json`:

#### `npm run build`

Build a production version of `bundle.js` into `dist/`.

#### `npm run dev`

Run a server in port 8080, refresh when source files are modified.
