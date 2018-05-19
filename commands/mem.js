exports.description = "Get memory information from process";

exports.arguments = [];

exports.options = {
  m: {
    description: "Show values in MB",
    validate: function (value) {
      return null; // always valid
    }
  }
};

exports.execute = function (args, options) {
  let usage = process.memoryUsage();

  if (options.m) {
    for (let i in usage) {
      usage[i] = usage[i] / 1024 / 1024;
    }
  }

  return [{
    node: "pre",
    html: JSON.stringify(usage, null, 2)
  }]
}