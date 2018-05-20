exports.description = "List files in directory";

exports.arguments = [{
  name: "path",
  default: ".",
  description: "Path to directory"
}];

exports.options = {}

exports.execute = function (args, options) {
  let fs = require("fs");
  let [dir] = args;
  
  dir = this.path(dir);

  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
    return {
      class: "error",
      html: "Directory not found"
    };
  }

  return {
    node: "pre",
    html: fs.readdirSync(dir).map(function (name) {
      let stat = fs.lstatSync(dir + "/" + name);
      return (stat.isDirectory() ? "d" : " ") + " " + stat.size + "\t\t" + name
    }).join("\n")
  }
}