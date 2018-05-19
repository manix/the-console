const fs = require("fs");

module.exports = function TheConsole(req, res) {
  switch (req.query.route) {
    case "style":
      res.set('Content-Type', 'text/css');
      // intentionally omit break, send file below
    case "file":
      sendFile(req.query.file, res);
      break;

    case "command":
      res.send({
        html: [
          "You just executed ", {
            node: "span",
            style: "color: red; font-weight: bold",
            html: req.query.command
          }, JSON.stringify(req.query)
        ]
      });
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

  app.get('/', TheConsole);

  app.listen(port, () => console.log(`The console is available at port ${port}`))
}