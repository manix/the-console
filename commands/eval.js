exports.description = "Run any arbitrary code";

exports.arguments = [{
  name: "code",
  description: "The javascript code you would like to run",
  validate: function (value) {
    return value ? null : "code is required";
  }
}];

exports.options = {}

exports.execute = function (args, options) {
  let [code] = args;
  try {
    return eval("(function() { return " + code + " }())");
  } catch (e) {
    return {
      class: "error",
      html: e.toString()
    };
  }
}