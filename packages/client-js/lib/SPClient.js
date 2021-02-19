"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = require("events");

var _reconnectingWebsocket = _interopRequireDefault(require("reconnecting-websocket"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SPClient = /*#__PURE__*/function (_EventEmitter) {
  _inherits(SPClient, _EventEmitter);

  var _super = _createSuper(SPClient);

  function SPClient(_ref) {
    var _this;

    var apiAddr = _ref.apiAddr,
        rpcAddr = _ref.rpcAddr,
        wsAddr = _ref.wsAddr;

    _classCallCheck(this, SPClient);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "apiAddr", void 0);

    _defineProperty(_assertThisInitialized(_this), "rpcAddr", void 0);

    _defineProperty(_assertThisInitialized(_this), "wsAddr", void 0);

    _defineProperty(_assertThisInitialized(_this), "connectedPromise", void 0);

    _defineProperty(_assertThisInitialized(_this), "socket", void 0);

    _defineProperty(_assertThisInitialized(_this), "connectRes", void 0);

    _defineProperty(_assertThisInitialized(_this), "connectRej", void 0);

    _defineProperty(_assertThisInitialized(_this), "timer", void 0);

    _this.apiAddr = apiAddr;
    _this.rpcAddr = rpcAddr;
    _this.wsAddr = wsAddr;

    var poll = _this.connectivityTest.bind(_assertThisInitialized(_this));

    _this.timer = setInterval(poll, 5000);

    _this.connectivityTest();

    if (_this.wsAddr) {
      _this.connectedPromise = new Promise(function (res, rej) {
        _this.connectRes = res;
        _this.connectRej = rej;
      });

      try {
        _this.socket = new _reconnectingWebsocket["default"](_this.wsAddr);
      } catch (e) {
        _this.connectRej();

        throw "WS node unavailable";
      }

      _this.socket.onopen = _this.onOpenWS.bind(_assertThisInitialized(_this));
      _this.socket.onmessage = _this.onMessageWS.bind(_assertThisInitialized(_this));
      _this.socket.onerror = _this.onErrorWS.bind(_assertThisInitialized(_this));
      _this.socket.onclose = _this.onCloseWS.bind(_assertThisInitialized(_this));
    }

    return _this;
  }

  _createClass(SPClient, [{
    key: "connectivityTest",
    value: function () {
      var _connectivityTest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.apiAddr) {
                  _context.next = 10;
                  break;
                }

                _context.prev = 1;
                _context.next = 4;
                return _axios["default"].get(this.apiAddr + "/node_info");

              case 4:
                this.emit("api-status", true);
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);

                if (!_context.t0.response) {
                  this.emit("api-status", false);
                } else {
                  this.emit("api-status", true);
                }

              case 10:
                if (!this.rpcAddr) {
                  _context.next = 20;
                  break;
                }

                _context.prev = 11;
                _context.next = 14;
                return _axios["default"].get(this.rpcAddr);

              case 14:
                this.emit("rpc-status", true);
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t1 = _context["catch"](11);

                if (!_context.t1.response) {
                  this.emit("rpc-status", false);
                } else {
                  this.emit("api-status", true);
                }

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7], [11, 17]]);
      }));

      function connectivityTest() {
        return _connectivityTest.apply(this, arguments);
      }

      return connectivityTest;
    }()
  }, {
    key: "connectWS",
    value: function connectWS() {
      return this.connectedPromise;
    }
  }, {
    key: "onErrorWS",
    value: function onErrorWS() {
      this.connectRej();
    }
  }, {
    key: "onCloseWS",
    value: function onCloseWS() {
      this.emit("ws-status", false);
    }
  }, {
    key: "onOpenWS",
    value: function onOpenWS() {
      this.connectRes();
      this.emit("ws-status", true);
      this.socket.send(JSON.stringify({
        jsonrpc: "2.0",
        method: "subscribe",
        id: "1",
        params: ["tm.event = 'NewBlock'"]
      }));
    }
  }, {
    key: "onMessageWS",
    value: function onMessageWS(msg) {
      var result = JSON.parse(msg.data).result;

      if (result.data && result.data.type === "tendermint/event/NewBlock") {
        this.emit("newblock", JSON.parse(msg.data).result);
      }
    }
  }, {
    key: "query",
    value: function () {
      var _query = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
        var params,
            response,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "";
                _context2.prev = 1;
                _context2.next = 4;
                return _axios["default"].get(this.apiAddr + url + params);

              case 4:
                response = _context2.sent;
                return _context2.abrupt("return", response.data);

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                throw "Could not access API: " + this.apiAddr + url + params;

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 8]]);
      }));

      function query(_x) {
        return _query.apply(this, arguments);
      }

      return query;
    }()
  }, {
    key: "addQueryParam",
    value: function addQueryParam(query, key) {
      var value = query[key];
      return encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : "".concat(value));
    }
  }, {
    key: "toQueryString",
    value: function toQueryString(rawQuery) {
      var _this2 = this;

      var query = rawQuery || {};
      var keys = Object.keys(query).filter(function (key) {
        return "undefined" !== typeof query[key];
      });
      return keys.map(function (key) {
        return _typeof(query[key]) === "object" && !Array.isArray(query[key]) ? _this2.toQueryString(query[key]) : _this2.addQueryParam(query, key);
      }).join("&");
    }
  }, {
    key: "addQueryParams",
    value: function addQueryParams(rawQuery) {
      var queryString = this.toQueryString(rawQuery);
      return queryString ? "?".concat(queryString) : "";
    }
  }, {
    key: "request",
    value: function () {
      var _request = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref2) {
        var body, path, query, method, url, response, data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                body = _ref2.body, path = _ref2.path, query = _ref2.query, method = _ref2.method;
                url = this.apiAddr + path + this.addQueryParams(query);
                _context3.prev = 2;
                response = (0, _axios["default"])({
                  url: url,
                  method: method,
                  data: body,
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8"
                  }
                });
                _context3.next = 6;
                return response;

              case 6:
                data = _context3.sent;
                return _context3.abrupt("return", data);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](2);
                throw "Could not access API: " + url;

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 10]]);
      }));

      function request(_x2) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }]);

  return SPClient;
}(_events.EventEmitter);

exports["default"] = SPClient;