const fs = require("fs");
const path = require("path");

module.exports = function TheConsole(req, res) {
  switch (req.query.route) {
    case "style":
      res.set('Content-Type', 'text/css');
      // intentionally omit break, send file below
    case "file":
      sendFile(req.query.file, res);
      break;

    case "command":
      res.send(executeCommand(req, res));
      break;

    default:
      sendFile("index.html", res);
      break;
  }
}

function sendFile(file, res) {
  res.send(fs.readFileSync(__dirname + "/client/" + file.replace("/", "")).toString());
}

module.exports.run = function (port = 9000) {
  var express = require("express");
  var app = express();

  app.get('/', module.exports);

  app.listen(port, () => console.log(`The console is available at port ${port}`))
}

module.exports.packages = {

};

module.exports.cwd = path.resolve(".");

module.exports.path = function (p) {
  return path.join(module.exports.cwd, p);
}

module.exports.addPackage = function (id, path) {
  module.exports.packages[id] = typeof path === "string" ? {
    path: path,
    commands: {}
  } : {
    path: null,
    commands: path
  }
}

module.exports.removePackage = function (id) {
  delete(module.exports.packages[id]);
}

module.exports.addPackage("root", __dirname + "/commands");

function executeCommand(req, res) {
  let [packageName, command] = req.query.command.split(":");

  if (packageName && !command) {
    command = packageName;
    packageName = null;
  }

  if (command) {
    for (let id in module.exports.packages) {
      if (packageName && id !== packageName) {
        continue;
      }

      var package = module.exports.packages[id];

      if (package.path === null && packages[id].commands[command]) {
        var cmd = package.commands[command];
      } else if (package.path) {
        try {
          var cmd = require(package.path + "/" + command);
          package.commands[command] = cmd;
        } catch (e) {

        }
      }
    }
  }

  if (cmd && typeof cmd.execute === "function") {
    try {
      if (req.query.opts && (req.query.opts.h || req.query.opts.help)) {
        return getHelp(command, cmd);
      }

      let args = (cmd.arguments || []).map((arg, index) => {
        argv = decodeURIComponent((req.query.args || [])[index] || "") || arg.default;

        if (typeof arg.validate === "function") {
          let invalid = arg.validate(argv);

          if (invalid) {
            throw invalid.replace("@", cmd.arguments[index].name);
          }
        }

        return argv;
      })

      return JSON.stringify(cmd.execute.call(module.exports, args, Object.keys(req.query.opts || {}).reduce((options, name) => {
        options[decodeURIComponent(name)] = decodeURIComponent(req.query.opts[name]);
        return options;
      }, {})) || "");
    } catch (e) {
      return {
        class: "error",
        html: e.toString()
      }
    }
  } else {
    return "Invalid command, see 'help'";
  }
}

function getHelp(name, cmd) {
  let response = name,
    args = "",
    opts = "";

  if (cmd.arguments.length) {
    response += " <arguments>";
    args = "Arguments\n" + cmd.arguments.map(function (arg) {
      return "\t" + arg.name + "\t\t" + arg.description;
    }).join("\n") + "\n\n";
  }

  if (Object.keys(cmd.options).length) {
    response += " [options]";
    opts = "Options\n" + Object.keys(cmd.options).map(function (key) {
      let opt = cmd.options[key];
      return "\t" + key + "\t\t" + opt.description;
    }).join("\n") + "\n\n";
  }

  return {
    node: "pre",
    html: response += "\n\n" + cmd.description + "\n\n" + args + opts
  };
}