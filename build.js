'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vm = require('vm2');

var vm = new _vm.VM();

exports.default = {
  run: function run(code) {
    try {
      return {
        status: 'success',
        result: vm.run(code)
      };
    } catch (error) {
      return {
        status: 'error',
        result: error.message
      };
    }
  }
};
'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _slack = require('./ports/slack');

var _slack2 = _interopRequireDefault(_slack);

var _sandbox = require('./domain/sandbox');

var _sandbox2 = _interopRequireDefault(_sandbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();

var answerChallenge = function answerChallenge(req, res, next) {
  if (req.body.challenge) {
    return res.send(req.body.challenge);
  }

  next();
};

var handler = function handler(req, res) {
  var _req$body$event = req.body.event,
      text = _req$body$event.text,
      type = _req$body$event.type,
      channel = _req$body$event.channel,
      username = _req$body$event.username;

  res.sendStatus(200);

  if (username === 'ShellBot' || type !== 'message') {
    return false;
  }

  var _sandbox$run = _sandbox2.default.run(text),
      result = _sandbox$run.result,
      status = _sandbox$run.status;

  _slack2.default.postMessage(channel, result, status);
};

server.post('/integration/slack', _bodyParser2.default.json(), answerChallenge, handler);

server.listen(3000, function () {
  console.log('Server up!');
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _client = require('@slack/client');

var token = 'xoxb-474520692288-476316951847-676doKoPP7buEsyLEpbPI3rU';
var client = new _client.WebClient(token);

var formatterCharacters = {
  success: '`',
  error: '_'
};

exports.default = {
  postMessage: function postMessage(channel, text) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "success";

    var formatterCharacter = formatterCharacters[type];
    var result = text;

    if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
      result = JSON.stringify(result, null, 2);
    }

    if (typeof result === 'string') {
      result = result.split('\n').map(function (line) {
        return '' + formatterCharacter + line + formatterCharacter;
      }).join('\n');
    } else {
      result = '' + formatterCharacter + result + formatterCharacter;
    }

    return client.chat.postMessage({
      channel: channel,
      text: result
    });
  }
};
