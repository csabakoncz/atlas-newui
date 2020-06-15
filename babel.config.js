
const path = require('path');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          'pnotify.buttons': 'pnotify',
          'pnotify.confirm': 'pnotify',
        }
      }
    ],
  ],
};

