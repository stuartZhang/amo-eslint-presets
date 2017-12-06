'use strict';
// System dependencies
var sjsMacroPattern = /^\s*MACRO_(?:(?:TIME(?:_END)?|LOG_(?:DEBUG|INFO|WARN|ERROR))|MAKE_ARRAY|UTILS +var)\s+/;
var consoelName = 'nativeConsole' + parseInt(Math.random() * 10000);
var globals = {};
globals[consoelName] = false;
module.exports = {
  'environments': {
    'browser': {
      'globals': globals
    }
  },
  'rules': {
    'no-console': function(context){
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
    }
  },
  'processors': {
    '.mjs': {
      'preprocess': function(rawText, filename){
        var textSegments = rawText.split('\n');
        module.exports.devLog('eslint-plugin-sweetjs ignore the below macro directives:');
        var mappedSegments = textSegments.map(function(text, index){
          var replacement;
          if (sjsMacroPattern.test(text)) {
            module.exports.devLog(text + ' - (' + filename + ':' + (index + 1) + ')');
            var groups = /^(\s*)MACRO_(?:TIME(?:_END)?|LOG_(?:DEBUG|INFO|WARN|ERROR))(?:\s+\[[^\[\]]+\])?\s+(.+)/g.exec(text);
            if (groups) {
              replacement = groups[1] + consoelName + '.log(' + groups[2] + ');';
              module.exports.devLog(replacement + ' <- ' + text);
              return replacement;
            }
            groups = /^(\s*)MACRO_UTILS\s+var\s+(\S+)\s*=/.exec(text);
            if (groups) {
              replacement = groups[1] + 'var ' + groups[2] + ' = null;';
              module.exports.devLog(replacement + ' <- ' + text);
              return replacement;
            }
            return '// sweetjs marco: ' + text;
          }
          return text;
        });
        return [mappedSegments.join('\n')];
      },
      'postprocess': function(messages, filename){
        var merged = [].concat.apply([], messages);
        module.exports.devLog(merged + ' - (' + filename + ')');
        return merged;
      }
    }
  }
};

module.exports.rules['no-console'].schema = [{
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
