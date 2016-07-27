import abc from '../../src/abc-web.js'

function createIFrame(path) {
  var frame = document.createElement('iframe');
  var body = document.getElementsByTagName("BODY")[0];
  body.appendChild(frame, body);
  frame.setAttribute('src', path);
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allowtransparency', 'true');
  frame.setAttribute('style', 'border: 0px none transparent; overflow: hidden; visibility: visible; margin: 0px; padding: 0px; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; display: block; background: transparent;');
  return frame;
}

function removeIFrame(frame) {
  frame.parentNode.removeChild(frame);
}

function AbcUi(args) {
  return new InnerAbcUi(args);
}

function InnerAbcUi(args) {
  window.AIRBITZ_API_KEY = args['key'];
  window.context = this.context = abc.Context(window.AIRBITZ_API_KEY);
  if (args['bundle-path']) {
    this.bundlePath = args['bundle-path'];
  } else {
    this.bundlePath = '/ui/bundle';
  }
}

InnerAbcUi.prototype.login = function(callback) {
  var frame = createIFrame(this.bundlePath + '/index.html#/login');
  window.loginCallback = function(result, account) {
    if (account) {
      removeIFrame(frame);
      callback(result, account);
    }
  };
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

InnerAbcUi.prototype.context = function() {
  return this.context;
}

InnerAbcUi.prototype.recovery = function(callback) {
  var frame = createIFrame(this.bundlePath + '/index.html#/recovery');
};

InnerAbcUi.prototype.register = function(callback) {
  var frame = createIFrame(this.bundlePath + '/index.html#/register');
  window.registrationCallback = function(result, account) {
    if (account) {
      removeIFrame(frame);
      callback(result, account);
    }
  };
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

InnerAbcUi.prototype.manageAccount = function(account, callback) {
  window.account = account;
  var frame = createIFrame(this.bundlePath + '/index.html#/account/');
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

var abcui = {};
abcui.AbcUi = AbcUi;
module.exports = abcui;
