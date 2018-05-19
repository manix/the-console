exports.description = "Remove packages from the console";

exports.arguments = [{
  name: "id",
  description: "package ID",
  validate: function (value) {
    return value ? null : "@ is required";
  }
}];

exports.options = {}

exports.execute = function (args, options) {
  let [id, path] = args;
  
  require("../index").removePackage(id);
}