module.exports = function(context){
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
};
module.exports.schema = [];
