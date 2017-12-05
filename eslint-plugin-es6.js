'use strict';
// System dependencies
var _ = require('underscore');

function isBBjsFile(context){
  var fileNamePattern;
  var options = context.options;
  if (options.length > 0) {
    options = options[0];
    if (_.isRegExp(options.fileNamePattern)) {
      fileNamePattern = options.fileNamePattern;
    }
  }
  if (fileNamePattern == null) {
    fileNamePattern = /\.js$/i;
  }
  return fileNamePattern.test(context.getFilename());
}

module.exports = {
  'rules': {
    'require-yield': function(context){
      var stack = [];
      /**
       * If the node is a generator function, start counting `yield` keywords.
       * @param {Node} node - A function node to check.
       * @returns {void}
       */
      function beginChecking(node){
        if (node.generator || node.async) {
          stack.push(0);
        }
      }
      /**
       * If the node is a generator function, end counting `yield` keywords, then
       * reports result.
       * @param {Node} node - A function node to check.
       * @returns {void}
       */
      function endChecking(node){
        if (!node.generator && !node.async) {
          return;
        }
        var countYield = stack.pop();
        if (countYield === 0 && node.body.body.length > 0) {
          if (node.generator) {
            context.report(node, "This generator function does not have 'yield'.");
          }
          else if (node.async) {
            context.report(node, "This async function does not have 'await'.");
          }
          else {
            throw new Error('The function is neither generator nor async for the rule "require-yield".');
          }
        }
      }

      return {
        'ArrowFunctionExpression': beginChecking,
        'ArrowFunctionExpression:exit': endChecking,
        'FunctionDeclaration': beginChecking,
        'FunctionDeclaration:exit': endChecking,
        'FunctionExpression': beginChecking,
        'FunctionExpression:exit': endChecking,
        // Increases the count of `yield` keyword.
        'YieldExpression': function(){
          /* istanbul ignore else */
          if (stack.length > 0) {
            stack[stack.length - 1] += 1;
          }
        }
      };
    },
    'generator-star-spacing': function(context){
      var mode = (function(option){
        if (!option || typeof option === 'string') {
          return {
            'before': {'before': true, 'after': false},
            'after': {'before': false, 'after': true},
            'both': {'before': true, 'after': true},
            'neither': {'before': false, 'after': false}
          }[option || 'before'];
        }
        return option;
      })(context.options[0]);
      /**
       * Checks the spacing between two tokens before or after the star token.
       * @param {string} side Either 'before' or 'after'.
       * @param {Token} leftToken `function` keyword token if side is 'before', or
       *     star token if side is 'after'.
       * @param {Token} rightToken Star token if side is 'before', or identifier
       *     token if side is 'after'.
       * @returns {void}
       */
      function checkSpacing(side, leftToken, rightToken){
        if (leftToken.value !== '*' && rightToken.value !== '*') {
          return;
        }
        if (!!(rightToken.range[0] - leftToken.range[1]) !== mode[side]) {
          var after = leftToken.value === '*';
          var spaceRequired = mode[side];
          var node = after ? leftToken : rightToken;
          var type = spaceRequired ? 'Missing' : 'Unexpected';
          var message = type + ' space ' + side + ' *.';
          context.report({
            'node': node,
            'message': message,
            'fix': function(fixer){
              if (spaceRequired) {
                if (after) {
                  return fixer.insertTextAfter(node, ' ');
                }
                return fixer.insertTextBefore(node, ' ');
              }
              return fixer.removeRange([leftToken.range[1], rightToken.range[0]]);
            }
          });
        }
      }
      /**
       * Enforces the spacing around the star if node is a generator function.
       * @param {ASTNode} node A function expression or declaration node.
       * @returns {void}
       */
      function checkFunction(node){
        var nextToken, prevToken, starToken;
        if (!node.generator) {
          return;
        }
        if (node.parent.method || node.parent.type === 'MethodDefinition') {
          starToken = context.getTokenBefore(node, 1);
        }
        else {
          starToken = context.getFirstToken(node, 1);
        }
        // Only check before when preceded by `function` keyword
        prevToken = context.getTokenBefore(starToken);
        if (prevToken.value === 'function' || prevToken.value === 'static') {
          checkSpacing('before', prevToken, starToken);
        }
        nextToken = context.getTokenAfter(starToken);
        checkSpacing('after', starToken, nextToken);
      }

      return {
        'FunctionDeclaration': checkFunction,
        'FunctionExpression': checkFunction
      };
    },
    'arrow-parens': function(context){
      var message = 'Expected parentheses around arrow function argument.';
      var asNeededMessage = 'Unexpected parentheses around single function argument.';
      var asNeeded = context.options[0] === 'as-needed';
      return {
        /**
         * Determines whether a arrow function argument end with `)`
         * @param {ASTNode} node The arrow function node.
         * @returns {void}
         */
        'ArrowFunctionExpression': function parens(node){
          var sourceCode = context.getSourceCode();
          var token = context.getFirstToken(node);
          // Custom section start
          if (token.type === 'Identifier' && token.value === 'async') {
            var asyncToken = token;
            token = context.getTokenAfter(asyncToken);
            if (!sourceCode.isSpaceBetweenTokens(asyncToken, token)) {
              context.report(node, 'Expected a space between async and arrow-function parentheses.');
            }
          }
          // Custom section end
          // as-needed: x => x
          if (asNeeded && node.params.length === 1 && node.params[0].type === 'Identifier') {
            if (token.type === 'Punctuator' && token.value === '(') {
              context.report(node, asNeededMessage);
            }
            return;
          }
          if (token.type === 'Identifier') {
            var after = context.getTokenAfter(token);
            // (x) => x
            if (after.value !== ')') {
              context.report(node, message);
            }
          }
        }
      };
    },
    'no-util-format': function(context){
      var isbbjsFile = isBBjsFile(context);
      return {
        'MemberExpression': function(node){
          if (!isbbjsFile) {
            return;
          }
          if (node.object.name === 'util' &&
              node.property.name === 'format') {
            context.report(node, 'ES6 String Template is expected to replace util.format().');
          }
        }
      };
    },
    'no-string-charcode': function(context){
      var isbbjsFile = isBBjsFile(context);
      var calleePattern = /(?:to|get)String$/;
      return {
        'MemberExpression': function(node){
          if (!isbbjsFile) {
            return;
          }
          if (node.object.name === 'String' &&
              node.property.name === 'fromCharCode') {
            context.report(node, 'String.fromCodePoint(<code point>) displaces String.fromCharCode(<char code>) for 32bit UTF-16 characters.');
          }
          else if (node.property.name === 'charAt') {
            var isError = false;
            if (node.object.type === 'Literal' && _.isString(node.object.value)) {
              isError = true;
            }
            else if (node.object.type === 'Identifier') {
              isError = true;
            }
            else if (node.object.type === 'CallExpression' &&
              node.object.callee.type === 'MemberExpression' &&
              calleePattern.test(node.object.callee.property.name)) {
              isError = true;
            }
            if (isError) {
              context.report(node, 'String.prototype.at(<index>) displaces String.prototype.charAt(<index>) for 32bit UTF-16 characters.');
            }
            else {
              context.report.bind(_.extend({}, context, {
                'severity': 1
              }))(node, 'String.prototype.at(<index>) is desirable for 32bit UTF-16 characters.');
            }
          }
        }
      };
    },
    'no-array-concat': function(context){
      var isbbjsFile = isBBjsFile(context);
      var calleePattern = /(?:to|get)Array$/;
      return {
        'MemberExpression': function(node){
          if (!isbbjsFile) {
            return;
          }
          if (node.property.name === 'concat') {
            var isError = false;
            if (node.object.type === 'ArrayExpression') {
              isError = true;
            }
            else if (node.object.type === 'CallExpression' &&
              node.object.callee.type === 'MemberExpression' &&
              calleePattern.test(node.object.callee.property.name)) {
              isError = true;
            }
            if (isError) {
              context.report(node, 'Spread operator(...) is to concatenate arrays.');
            }
            else {
              context.report.bind(_.extend({}, context, {
                'severity': 1
              }))(node, 'Spread operator(...) is desirable to concatenate arrays.');
            }
          }
        }
      };
    }
  }
};

module.exports.rules['require-yield'].schema = [];
module.exports.rules['generator-star-spacing'].schema = [{
  'oneOf': [{
    'enum': ['before', 'after', 'both', 'neither']
  }, {
    'type': 'object',
    'properties': {
      'before': {'type': 'boolean'},
      'after': {'type': 'boolean'}
    },
    'additionalProperties': false
  }]
}];
module.exports.rules['arrow-parens'].schema = [{
  'enum': ['always', 'as-needed']
}];
module.exports.rules['no-util-format'].schema =
module.exports.rules['no-string-charcode'].schema =
module.exports.rules['no-array-concat'].schema = [{
  'type': 'object',
  'properties': {
    'fileNamePattern': {
      'type': 'object'
    }
  }
}];
