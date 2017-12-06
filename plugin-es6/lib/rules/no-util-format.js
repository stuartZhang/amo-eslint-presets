const {isMjsFile} = require('./_utils');
module.exports = function(context){
  var isbbjsFile = isMjsFile(context);
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
}
module.exports.schema = [{
  'type': 'object',
  'properties': {
    'fileNamePattern': {
      'type': 'object'
    }
  }
}];
