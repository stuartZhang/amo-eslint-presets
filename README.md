# eslint-plugin-stzhang
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

Next, install `eslint-plugin-stzhang`:

```
$ npm install eslint-plugin-stzhang --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-stzhang` globally.

## Usage

Add `stzhang` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "stzhang"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "stzhang/arrow-parens": ["error", "as-needed"],
    "stzhang/generator-star-spacing": ["error", "before"],
    "stzhang/no-array-concat": ["error"],
    "stzhang/no-string-charcode": ["error"],
    "stzhang/no-util-format": ["error"],
    "stzhang/require-yield": 2,
    "stzhang/no-console": 2
  }
}
```

## Supported Rules

* Fill in provided rules here