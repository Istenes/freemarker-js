var jarFile = "./FMRender-0.7.jar",
    iconv = require("iconv-lite"),
    path = require("path"),
    spawn = require('child_process').spawn;

var freemarker = fremarker || {};
freemarker.process = function(args) {
    var dataModel = JSON.stringify(args.data);
    var settingsString = JSON.stringify(args.settings);
    var deps = JSON.stringify(args.deps);
    var nodes = JSON.stringify(args.nodes);
    var settings = args.settings;
    var resultData = "";

    var cmd = spawn('java', ["-jar", jarFile,
        settingsString,
        args.ftlFile,
        dataModel,
        deps,
        nodes
    ]);

    if (args.callback) {
        cmd.stdout.on("data", function(data) {
            // args.callback(null, iconv.decode(data, settings.encoding));
            resultData += iconv.decode(data, settings.encoding);
        });
        cmd.stderr.on("data", function(data) {
            // Print error message
            var result = '<div align="left" style="background-color:#FFFF00; color:#FF0000; display:block; border-top:double; padding:2pt; font-size:medium; font-family:Arial,sans-serif; font-style: normal; font-variant: normal; font-weight: normal; text-decoration: none; text-transform: none">'
            result += iconv.decode(data, settings.encoding).replace(/[\n\r]/g, "<br/>");
            result += '</div>'
            resultData += result;
            console.log(iconv.decode(data, settings.encoding));
        });
        cmd.stdout.on("end", function() {
            args.callback(null, resultData);
        });
    }
}

module.exports = freemarker;