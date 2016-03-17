var path = require("path"),
    jarFile = path.join(__dirname, "FMRender-0.7.jar"),
    iconv = require("iconv-lite"),
    spawn = require('child_process').spawn
    q = require('q');

var freemarker = freemarker || {};
freemarker.process = function(args, appendData) {
    var deferred = q.defer();
    var dataModel = JSON.stringify(args.data);
    var settingsString = JSON.stringify(args.settings);
    var deps = JSON.stringify(args.deps);
    var nodes = JSON.stringify(args.nodes);
    var settings = args.settings;
    var resultData = "";

    var hasErrors = false;

    var cmd = spawn('java', ["-jar", jarFile,
        settingsString,
        args.ftlFile,
        dataModel,
        deps,
        nodes
    ]);

        cmd.stdout.on("data", function(data) {
            resultData += iconv.decode(data, settings.encoding);
        });
        cmd.stderr.on("data", function(data) {
            // Print error message
            hasErrors = true;
            var result = '<div align="left" style="background-color:#FFFF00; color:#FF0000; display:block; border-top:double; padding:2pt; font-size:medium; font-family:Arial,sans-serif; font-style: normal; font-variant: normal; font-weight: normal; text-decoration: none; text-transform: none">'
            result += iconv.decode(data, settings.encoding).replace(/[\n\r]/g, "<br/>");
            result += '</div>'
            resultData += result;
        });
        cmd.stdout.on("end", function() {
            if (args.callback) {
                if(appendData) {
                    appendData += resultData;
                    args.callback(null, appendData);
                } else {
                    args.callback(null, resultData);
                }
            } else {
                if(appendData) {
                    appendData += resultData;
                    deferred.resolve(appendData);
                } else {
                    deferred.resolve(resultData);
                }
            }
        });

        return deferred.promise;
}

module.exports = freemarker;