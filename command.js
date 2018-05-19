exports.description = "The root command definition";

exports.arguments = [
  {
    name: "Argument 1 name",
    description: "Argument 1 description",
    validate: function (value) {
      return value ? null : "Value is required";
    }
  }
];

exports.options = {
  option: {
    description: "Option description",
    validate: function (value) {
      return null; // always valid
    }
  }
}

exports.execute = function (args, options) {
  return "You just executed the genesis command with arguments: " + args.join(", ") + " and options " + JSON.stringify(options);
}