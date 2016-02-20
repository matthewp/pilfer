var path = require("path");
var through = require("through2");

module.exports = function(options){
  var out = options.out;

  return through.obj(function(data, enc, next){
    if(!out) return next(null, data);

    // Change the path
    var bundle = data.bundles[0];
    var newPath = path.join(path.dirname(bundle.bundlePath), out);
    bundle.bundlePath = newPath;

    // Change the name
    var newName = path.join(path.dirname(bundle.name),
                            path.basename(out, path.extname(out)));
    bundle.name = newName;

    next(null, data);
  });
};
