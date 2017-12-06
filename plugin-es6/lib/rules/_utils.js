const _ = require('underscore');
_.extendOwn(exports, {
  isMjsFile(context){
    var fileNamePattern;
    var options = context.options;
    if (options.length > 0) {
      options = options[0];
      if (_.isRegExp(options.fileNamePattern)) {
        fileNamePattern = options.fileNamePattern;
      }
    }
    if (fileNamePattern == null) {
      fileNamePattern = /\.js$/i;
    }
    return fileNamePattern.test(context.getFilename());
  }
});
