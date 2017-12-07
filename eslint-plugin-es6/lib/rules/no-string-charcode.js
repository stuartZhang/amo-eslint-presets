const _ = require('underscore');
module.exports = function(context){
  var calleePattern = /(?:to|get)String$/;
  return {
    'MemberExpression': function(node){
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
};
module.exports.schema = [];
