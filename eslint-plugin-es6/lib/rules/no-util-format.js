module.exports = function(context){
  return {
    'MemberExpression': function(node){
      if (node.object.name === 'util' &&
          node.property.name === 'format') {
        context.report(node, 'ES6 String Template is expected to replace util.format().');
      }
    }
  };
}
module.exports.schema = [];
