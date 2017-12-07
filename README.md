# eslint-plugin-amo
A group of ESLint plugin and presets for the AMO company.
# Setup
1. Global tools
    1. `npm install -g yo`
    1. `npm install -g generator-eslint`
1. Generate the eslint-plugin skeleton
    1. `yo eslint:plugin`
1. Generate the eslint-rules skeleton
    1. `yo eslint:rule`
# References
1. https://medium.com/@btegelund/creating-an-eslint-plugin-87f1cb42767f
1. https://www.kenneth-truyers.net/2016/05/27/writing-custom-eslint-rules/

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-amo`:

```
$ npm install eslint-plugin-amo --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-amo` globally.

## Usage

Add `amo` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "amo"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "amo/arrow-parens": ["error", "as-needed"],
    "amo/generator-star-spacing": ["error", "before"],
    "amo/no-array-concat": ["error"],
    "amo/no-string-charcode": ["error"],
    "amo/no-util-format": ["error"],
    "amo/require-yield": 2,
    "amo/no-console": 2
  }
}
```

## Supported Rules

* Fill in provided rules here