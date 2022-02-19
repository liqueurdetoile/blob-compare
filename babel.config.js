module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": "auto",
        "useBuiltIns": "usage",
        "corejs": 3,
      },
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread",
  ],
  "env": {
    "test": {
      "plugins": [
        [
          "istanbul",
          { "exclude": ["tests/**/*.js"] }
        ]
      ]
    }
  }
}