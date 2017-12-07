module.exports = function(context){
    var isSjsFile = /\.mjs$/i.test(context.getFilename());
    return {
      'MemberExpression': function(node){
        if (!isSjsFile) {
          return;
        }
        if (node.object.name === 'console') {
          var blockConsole = true;
          if (context.options.length > 0) {
            var allowedProperties = context.options[0].allow;
            var passedProperty = node.property.name;
            var propertyIsAllowed = allowedProperties.indexOf(passedProperty) > -1;
            if (propertyIsAllowed) {
              blockConsole = false;
            }
          }
          if (blockConsole) {
            context.report(node, 'Unexpected console statement.');
          }
        }
      }
    };
  };
  module.exports.schema = [{
    'type': 'object',
    'properties': {
      'allow': {
        'type': 'array',
        'items': {
          'type': 'string'
        },
        'minItems': 1,
        'uniqueItems': true
      }
    },
    'additionalProperties': false
  }];
  