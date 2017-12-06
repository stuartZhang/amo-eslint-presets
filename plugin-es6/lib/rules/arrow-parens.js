module.exports = function(context){
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
};
module.exports.schema = [{
  'enum': ['always', 'as-needed']
}];
