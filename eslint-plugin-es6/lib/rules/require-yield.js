const _ = require('underscore');
module.exports = function(context){
  const aStack = [], yStack = [];
  /**
   * If the node is a generator function, start counting `yield` keywords.
   * @param {Node} node - A function node to check.
   * @returns {void}
   */
  function beginChecking(node){
    node.async && aStack.push(0);
    node.generator && yStack.push(0);
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
    if (node.body.body.length > 0) {
      if (node.async && aStack.pop() <= 0) {
        context.report(node, "This async function does not have 'await'.");
      }
      if (node.generator && yStack.pop() <= 0) {
        context.report(node, "This generator function does not have 'yield'.");
      }
    }
  }

  function expression(stack){
    if (stack.length > 0) {
      stack[stack.length - 1] += 1;
    } /* istanbul ignore else */
  }

  return {
    'ArrowFunctionExpression': beginChecking,
    'ArrowFunctionExpression:exit': endChecking,
    'AwaitExpression': _.partial(expression, aStack), // Increases the count of `await` keyword.
    'FunctionDeclaration': beginChecking,
    'FunctionDeclaration:exit': endChecking,
    'FunctionExpression': beginChecking,
    'FunctionExpression:exit': endChecking,
    'YieldExpression': _.partial(expression, yStack) // Increases the count of `yield` keyword.
  };
};
module.exports.schema = [];
