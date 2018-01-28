module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "airbnb-base",
    "prettier"
  ],
  "plugins": ["prettier", "filenames"],
  "rules": {
    "no-param-reassign": ["error", { "props": false }],
    "no-unused-vars": ["error", {
      "args": "none"
    }],
    "filenames/match-regex": [2, "^[a-zA-Z0-9.]+$", true],
    "prettier/prettier": ["error", {
      "singleQuote": true
    }]
  }
}
