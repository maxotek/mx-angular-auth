module.exports = {
    "globals": {
        "angular": false,
        "jwt_decode": false
    },
    "env": {
        "es6": true,
        "node": true
    },
    "plugins": [
        "angular"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:angular/johnpapa"
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 0,
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "angular/function-type": [
            "error",
            "named"
        ]
    }
};