exports.description = "Display the contents of a file";

exports.arguments = [{
  name: "path",
  description: "Path to file",
  validate: function (value) {
    return value ? null : "@ is required";
  }
}];

exports.options = {}

exports.execute = function (args, options) {
  let fs = require("fs");
  let [file] = args;
  file = this.path(file);

  if (!fs.existsSync(file)) {
    return {
      class: "error",
      html: "File not found"
    };
  }

  return {
    node: "pre",
    html: fs.readFileSync(file).toString()
  }
}