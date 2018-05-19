exports.description = "Add packages to the console";

exports.arguments = [{
  name: "id",
  description: "package ID",
  validate: function (value) {
    return value ? null : "@ is required";
  }
}, {
  name: "path",
  description: "package path",
  validate: function (value) {
    return value ? null : "@ is required";
  }
}];

exports.options = {}

exports.execute = function (args, options) {
  let [id, path] = args;
  
  require("../").addPackage(id, path);
}