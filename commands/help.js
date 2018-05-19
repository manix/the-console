exports.description = "List all available commands";

exports.arguments = [];
exports.options = {}

exports.execute = function (args, options) {
  let packages = require("../index").packages;
  let response = "";

  for (var name in packages) {
    let package = packages[name];

    // if package is directory then load all commands first
    if (package.path) {
      require("fs").readdirSync(package.path).forEach(function (name) {
        name = name.replace(/.js$/, "");
        package.commands[name] = require(package.path + "/" + name);
      });
    }

    response += name + "\n";

    for (var command in package.commands) {
      response += "\t" + command + "\t\t" + package.commands[command].description + "\n";
    }

    response += "\n";
  }

  return {
    node: "pre",
    html: response
  };
}