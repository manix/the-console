(function () {
  var c, i;

  function greet() {
    function pre(text) {
      return {
        node: "pre",
        html: text,
        class: "text-center"
      }
    }

    log(pre("\n\n"));
    log(pre("!==========================!"));
    log(pre("!                          !"));
    log(pre("!        GREETINGS         !"));
    log(pre("!            -             !"));
    log(pre("!       THE CONSOLE        !"));
    log(pre("!                          !"));
    log(pre("!==========================!"));
    log(pre(new Date().toLocaleString()));
    log(pre("\n\n"));

  }

  function log(message) {
    var div = luri.construct({
      class: "message",
      html: message
    });

    c.appendChild(div);
    div.scrollIntoView();

    if (c.children.length > 500) {
      c.removeChild(c.firstChild);
    }

    return div;
  };

  var history = [];
  var hindex = 0;

  function send(input) {
    log([
      "> ",
      {
        node: "span",
        class: "input",
        html: input
      }
    ]);

    if (!input) {
      return Promise.resolve();
    }

    history.unshift(input);
    history = history.slice(0, 20);

    return new Promise(function (resolve, reject) {
      var command = null;
      var args = [];
      var opts = {};

      input = input.replace(/".*?"/g, function (match) {
        var replaced = match.replace(/\s/g, "%20");
        return replaced.substring(1, replaced.length - 1);
      }).split(" ").forEach(function (input) {

        if (!input) {
          return;
        }

        if (!command) {
          command = input;
          return;
        }

        if (input[0] === "-") {
          var option = input.split("=");
          opts[option[0].substring(option[0][1] === "-" ? 2 : 1)] = option[1] || true;
        } else {
          args.push(input);
        }
      });


      var xhr = new XMLHttpRequest();

      xhr.open("GET", [
        "?route=command&command=" + command,
        args.map(function (arg) {
          return "args[]=" + encodeURIComponent(arg);
        }).join("&"),
        Object.keys(opts).map(function (key) {
          return "opts[" + encodeURIComponent(key) + "]=" + encodeURIComponent(opts[key]);
        }).join("&")
      ].filter(function (string) {
        return !!string;
      }).join("&"), true);

      function response(outcome) {
        var definition;

        try {
          definition = JSON.parse(xhr.responseText);
        } catch (e) {
          definition = xhr.responseText;
        }

        log(definition);
        outcome();
      }

      xhr.onload = function () {
        response(resolve);
      };

      xhr.onerror = function () {
        response(reject)
      };

      xhr.send();
    })
  }

  function hide() {
    i.parentNode.classList.add("d-none");
  }

  function show() {
    i.parentNode.classList.remove("d-none");
    i.focus();
    i.scrollIntoView();
  }

  document.body.onclick = function () {
    i.focus();
  };

  document.body.appendChild(luri.construct({
    id: "the-console",
    class: "flex-1",
    html: [{
      id: "console",
      class: "flex-1",
      ref: function (e) {
        c = e;
        greet();
      }
    }, {
      id: "input",
      class: "d-flex",
      html: {
        node: "textarea",
        class: "flex-1",
        ref: function (e) {
          i = e;
        },
        onkeydown: function (e) {
          if (e.which === 13) {
            e.preventDefault();
          }
        },
        onkeyup: function (e) {
          switch (e.which) {
            case 13:
              send(this.value.trim()).then(show).catch(show);
              this.value = "";
              this.innerHTML = "";
              hide();
              hindex = 0;
              break;
            case 38:
              if (hindex > 20 || !history[hindex]) {
                hindex = history.length - 1;
              }
              this.value = history[hindex++] || "";
              break;
            case 40:
              this.value = history[hindex--] || "";
              if (hindex < 0) {
                hindex = 0;
              }
              break;
          }
        }
      }
    }]
  }));

  /**
   * CALIBRATE
   */
  (function (word) {
    var msg = log(word);
    msg.style.display = "inline";
    var char_width = msg.offsetWidth / word.length;
    i.style.textIndent = (char_width * 2) + "px";
    msg.remove();
  })("sample");

})();