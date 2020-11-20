# Design Token for the Figma plugin 

<img src="../_screenshots/webpack.png" width="400" />

Provide design token system to improve the deveopement processes

## Installation

- pulling the source code into the plugin folder
- bundling plugin code using Webpack
- using React with TSX and TypeScript

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded TypeScript is in `src/ui.tsx`.

These are compiled to files in `dist/`, which are what Figma will use to run plugin.

To build:

    $ npm install
    $ npx webpack

## Features
- Group function for token management.
- Basic token for a single property type
- Advance token for multiple property types
- Property of a token could link an existing token
- Theme provider
- Apply token to figma node

## Milestone
- Export data to a JSON file
- Commit data to a GitHub repostory
- Version control
