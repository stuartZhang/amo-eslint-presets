# eslint-plugin-es6

es6 rules

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-es6`:

```
$ npm install eslint-plugin-es6 --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-es6` globally.

## Usage

Add `es6` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "es6"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "es6/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





