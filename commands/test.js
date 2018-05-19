exports.description = "The test command";

exports.arguments = [];

exports.options = {}

var date = new Date();
exports.execute = function (args, options) {
  return date.toString();
}