# eslint-plugin-sweetjs

a new rule for no-console

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-sweetjs`:

```
$ npm install eslint-plugin-sweetjs --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-sweetjs` globally.

## Usage

Add `sweetjs` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "sweetjs"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "sweetjs/no-console": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





