# Design Token for the Figma plugin 

<img src="../_screenshots/webpack.png" width="400" />

Provide design token system to improve the deveopement processes

This demonstrates:

- pull the source code into your plugin folder
- bundling plugin code using Webpack, and
- using React with TSX and TypeScript

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded JavaScript is in `src/ui.tsx`.

These are compiled to files in `dist/`, which are what Figma will use to run
your plugin.

To build:

    $ npm install
    $ npx webpack

