# Trace Webpack Plugin

Find out why a given file is part of your webpack bundle

## Description

This plugin will print out the path from the webpack entry point to the module that match a file of interest!

## Usage

```js
// inside webpack config file
const { Trace } = require('trace-webpack-plugin');

module.exports {
    // ...

    plugins: [
        new Trace({ fileName: '<fileName>' }),

        // ...
    ],
    
    // ...
}
```