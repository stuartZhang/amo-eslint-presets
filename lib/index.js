const requireIndex = require("requireindex");
const _ = require('underscore');

const sjsMacroPattern = /^\s*MACRO_(?:(?:TIME(?:_END)?|LOG_(?:DEBUG|INFO|WARN|ERROR))|MAKE_ARRAY|UTILS +var)\s+/;
const consoelName = 'nativeConsole' + parseInt(Math.random() * 10000);
const globals = {};
globals[consoelName] = false;
_.extendOwn(exports, {
  environments: {
    'browser': {
      'globals': globals
    }
  },
  // import processors
  processors: {
    '.mjs': {
      preprocess(rawText, filename){
        var textSegments = rawText.split('\n');
        // module.exports.devLog('eslint-plugin-sweetjs ignore the below macro directives:');
        const mappedSegments = textSegments.map(function(text, index){
        let replacement;
        if (sjsMacroPattern.test(text)) {
          // module.exports.devLog(text + ' - (' + filename + ':' + (index + 1) + ')');
          const groups = /^(\s*)MACRO_(?:TIME(?:_END)?|LOG_(?:DEBUG|INFO|WARN|ERROR))(?:\s+\[[^\[\]]+\])?\s+(.+)/g.exec(text);
          if (groups) {
          replacement = groups[1] + consoelName + '.log(' + groups[2] + ');';
          // module.exports.devLog(replacement + ' <- ' + text);
          return replacement;
          }
          groups = /^(\s*)MACRO_UTILS\s+var\s+(\S+)\s*=/.exec(text);
          if (groups) {
          replacement = groups[1] + 'var ' + groups[2] + ' = null;';
          // module.exports.devLog(replacement + ' <- ' + text);
          return replacement;
          }
          return '// sweetjs marco: ' + text;
        }
        return text;
        });
        return [mappedSegments.join('\n')];
      },
      postprocess(messages, filename){
        const merged = [].concat.apply([], messages);
        // module.exports.devLog(merged + ' - (' + filename + ')');
        return merged;
      }
    }
  },
  // import all rules in lib/rules
  rules: requireIndex(__dirname + "/rules")
});
