var s = require("steal-tools").streams;
var almond = require("steal-almond").createStream;
var recycle = require("steal-tools/lib/graph/recycle");
var rename = require("./rename");
var watch = require("steal-tools/lib/stream/watch");
var defaults = require("lodash.defaultsdeep");

module.exports = function(options){
	var moment = require("moment");

  options = options || {system:{}};

	defaults(options, {
		sourceMaps: true,
		minify: false,
		quiet: true,
    useNormalizedDependencies: true,
    system: {
      config: process.cwd() + "/package.json!npm",
      bundlesPath: process.cwd()
    }
	});

  if(options.entry) {
    options.system.main = options.entry;
  }

  var config = options.system;

	var moduleName;

	// A function that is called whenever a module is found by the watch stream.
	// Called with the name of the module and used to rebuild.
	function rebuild(node){
		moduleName = node ? node.load.name : "";
		graphStream.write(moduleName);
	}

	function log(){
    if(!moduleName) return;
		var rebuiltPart = moduleName ? moduleName : "";
		var time = "[" + moment().format("LTS") + "]";
		console.error(time.red + (moduleName ? ":" : ""), rebuiltPart.green);
	}

	// Create an initial dependency graph for this config.
	var initialGraphStream = s.graph(config, options);

	// Create a build stream that does everything; creates a graph, bundles,
	// and writes the bundles to the filesystem.
	var buildStream = initialGraphStream, graphStream;

  // Create a stream that is used to regenerate a new graph on file changes.
  if(options.watch) {
    graphStream = recycle(config);
    buildStream = buildStream.pipe(graphStream);
  }

  buildStream = buildStream
		.pipe(s.transpileAndBundle(config, options))
    .pipe(rename(options))
    .pipe(almond())
		.pipe(s.concat());

  if(options.out) {
    buildStream = buildStream.pipe(s.write());
  } else {
    // Write to stdout
    buildStream.on("data", function(data){
      var bundle = data.bundles[0];
      var source = bundle.source.code;
      console.log("got bundle", source);
    });
  }

  buildStream.on("data", log);

	// Watch the build stream and call rebuild whenever it changes.
  if(options.watch) {
	  var watchStream = watch(graphStream);
	  watchStream.on("data", rebuild);

    graphStream.on("error", function(error){
      // If this is a missing file add it to our watch.
      if(error.code === "ENOENT" && error.path) {
        console.error("File not found:", error.path);

        if(options.watch){
          watchStream.write(error.path);
        }
      }
    });
  }

	return buildStream;
};
