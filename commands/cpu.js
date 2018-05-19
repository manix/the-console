exports.description = "Get processor information from process";

exports.arguments = [];

exports.options = {};

exports.execute = function (args, options) {
  return [
    {
      node: "pre",
      html: JSON.stringify(process.cpuUsage(), null, 2)
    }
  ]
}