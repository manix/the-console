exports.description = "Remove a module from require's cache.";

exports.arguments = [{
  name: "name",
  description: "Package name to purge",
  validate: function (value) {
    return value ? null : "@ is required";
  }
}];

exports.options = {}

exports.execute = function (args, options) {
  let [name] = args; 
  delete require.cache[require.resolve(name)];
}