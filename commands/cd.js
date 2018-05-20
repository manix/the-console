exports.description = "Change current working directory";

exports.arguments = [{
  name: "path",
  description: "Path to directory",
  validate: function (value) {
    return value ? null : "@ is required";
  }
}];

exports.options = {}

exports.execute = function (args, options) {
  let [path] = args;
  let cwd = this.path(path);

  if (!require("fs").existsSync(cwd)) {
    return {
      class: "error",
      html: "Can't go there"
    }
  }

  this.cwd = cwd;

  return {
    style: "display: none",
    html: this.cwd
  };
}