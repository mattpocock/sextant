# API Reference

## CLI

### sextant

`sextant ./target-dir`

Opens the Sextant GUI. Any changes made in the GUI will be saved in the target directory.

| Option        | Effect                           | Default |
| ------------- | -------------------------------- | ------- |
| `--port` `-p` | Changes the port the GUI runs on | `3000`  |

### sextant codegen

`sextant codegen ./target-dir`

Runs codegen operations from Sextant plugins without opening the Sextant GUI.

## Config File

### sextant.config.js

```js
module.exports = {
  plugins: [
    // Declare a plugin without configuration
    'plugin-name',

    // Define a plugin with configuration
    ['plugin-name-with-config', { someConfigVariable: true }],
  ],
};
```
