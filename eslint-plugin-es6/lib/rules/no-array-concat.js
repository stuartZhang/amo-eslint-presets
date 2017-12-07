const _ = require('underscore');
module.exports = function(context){
  var calleePattern = /(?:to|get)Array$/;
  return {
    'MemberExpression': function(node){
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
};
module.exports.schema = [];
