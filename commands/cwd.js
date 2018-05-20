exports.description = "Display the current working directory";

exports.arguments = [];

exports.options = {}

exports.execute = function (args, options) {
  return {
    html: this.cwd
  };
}