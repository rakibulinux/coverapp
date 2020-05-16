/*!
 * zsmart-library v1.1
 * 
 * © 2020 @huuhait(https://github.com/huuhait)
 * MIT License.
 */
import axios from 'axios';
import store$1 from '@/store';
import router from '@/router';
import { i18n } from '@/plugins';
import '@/main';
import night_theme from '@/assets/css/tradingview/night';
import colors from '@/colors';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var LIST_WARNING = ["identity.session.missing_otp", "identity.session.not_active", "identity.user.active_or_doesnt_exist"];

var NoticeWaring = function NoticeWaring(message) {
  helpers.runNotice("warning", i18n.t(message));
};

var NoticeError = function NoticeError(message) {
  helpers.runNotice("error", i18n.t(message));
};

var formatError = function formatError(_ref) {
  var response = _ref.response;
  var message = response.data.errors[0];

  if (store$1.state.user.status === "success") {
    //======Auth=====//
    if (response.status === 401) {
      store$1.commit("user/LOGOUT");
    } else if (response.status === 400) {
      if (store$1.state.working == "change_password") {
        store$1.state.security.changePass.ButtonLoading = false;
      }
    }
  } else if (LIST_WARNING.includes(message)) {
    //======UnAuth=====//
    if (LIST_WARNING[0] === message) {
      store$1.commit("user/NEED2FA");
    } else if (LIST_WARNING[1] === message) {
      var payload = JSON.parse(response.config.data);
      store$1.commit("user/WAIT_EMAIL", payload);
    } else if (LIST_WARNING[2] === message) {
      router.push("/");
    }

    return NoticeWaring(message);
  } else if (message !== "authz.invalid_session") NoticeError(message);
};

var csrf_headers = function csrf_headers() {
  var csrf_token = localStorage.getItem("csrf_token");
  var headers = {
    "X-CSRF-Token": csrf_token
  };
  return csrf_token ? headers : {};
};

var getClient = function getClient(baseURL) {
  var client = axios.create({
    baseURL: baseURL,
    headers: csrf_headers()
  });
  client.interceptors.response.use(function (response) {
    return Promise.resolve(response);
  }, function (error) {
    formatError(error);
    return Promise.reject(error);
  });
  return client;
};

var ApiClient =
/*#__PURE__*/
function () {
  function ApiClient(request) {
    _classCallCheck(this, ApiClient);

    this.client = getClient(config.api.url + request);
  }

  _createClass(ApiClient, [{
    key: "get",
    value: function get(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client.get(url + helpers.jsonToParam(data), conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: "delete",
    value: function _delete(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client["delete"](url + helpers.jsonToParam(data), conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: "head",
    value: function head(url) {
      var conf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.client.head(url, conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: "options",
    value: function options(url) {
      var conf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.client.options(url, conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: "post",
    value: function post(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client.post(url, data, conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: "put",
    value: function put(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client.put(url, data, conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: "patch",
    value: function patch(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client.patch(url, data, conf).then(function (response) {
        return Promise.resolve(response);
      })["catch"](function (error) {
        return Promise.reject(error);
      });
    }
  }]);

  return ApiClient;
}();

var store;
var supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"];
var history = {};
var config$1 = {
  supported_resolutions: supportedResolutions
};

var createChannelString = function createChannelString(symbolInfo) {
  var channel = symbolInfo.name.split(/[:/]/);
  return channel[0] + "/" + channel[1];
};

var checkStore = function checkStore(storeFake) {
  if (!store$1) {
    store = storeFake;
  } else {
    store = store$1;
  }
};

var DataFeeds =
/*#__PURE__*/
function () {
  function DataFeeds(storeFake) {
    _classCallCheck(this, DataFeeds);

    checkStore(storeFake);
  }

  _createClass(DataFeeds, [{
    key: "onReady",
    value: function onReady(cb) {
      cb(config$1);
    }
  }, {
    key: "resolveSymbol",
    value: function resolveSymbol(symbolName, onSymbolResolvedCallback) {
      var symbol_stub = {
        name: symbolName,
        description: "",
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        ticker: symbolName,
        minmov: 1,
        pricescale: Math.pow(10, helpers.pricePrecision()),
        has_intraday: true,
        intraday_multipliers: ["1", "5", "15", "30", "60", "240"],
        supported_resolution: supportedResolutions
      };
      onSymbolResolvedCallback(symbol_stub);
    }
  }, {
    key: "getBars",
    value: function getBars(symbolInfo, resolution, from, to, onDataCallback, onErrorCallback, firstDataRequest) {
      var payload, url, _ref, data, bars;

      return regeneratorRuntime.async(function getBars$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (resolution === "D" || resolution === "1D") resolution = 1440;

              if (firstDataRequest) {
                ZSmartModel.emit("tradingview-rending");
              }

              payload = {
                period: resolution,
                time_from: from,
                time_to: to,
                limit: 2000
              };
              url = "public/markets/" + helpers.isMarket() + "/k-line";
              _context.prev = 4;
              _context.next = 7;
              return regeneratorRuntime.awrap(new ApiClient("trade").get(url, payload));

            case 7:
              _ref = _context.sent;
              data = _ref.data;
              bars = data.map(function (el) {
                return {
                  time: el[0] * 1000,
                  open: el[1],
                  high: el[2],
                  low: el[3],
                  close: el[4],
                  volume: el[5]
                };
              });

              if (firstDataRequest) {
                history[symbolInfo.name] = {
                  lastBar: bars[bars.length - 1]
                };
                ZSmartModel.emit("tradingview-ready");
              }

              onDataCallback(bars, {
                noData: !!data.length
              });
              _context.next = 19;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](4);
              onErrorCallback(_context.t0);
              ZSmartModel.emit("tradingview-error");
              return _context.abrupt("return", _context.t0);

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[4, 14]]);
    }
  }, {
    key: "subscribeBars",
    value: function subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID) {
      var channelString = createChannelString(symbolInfo);
      var newSub = {
        channelString: channelString,
        subscribeUID: subscribeUID,
        resolution: resolution,
        symbolInfo: symbolInfo,
        lastBar: history[symbolInfo.name].lastBar,
        listener: onRealtimeCallback
      };
      store.state.exchange.TradingView.stream = [];
      store.state.exchange.TradingView.stream.push(newSub);
    }
  }, {
    key: "unsubscribeBars",
    value: function unsubscribeBars(subscriberUID) {
      var stream = store.state.exchange.TradingView.stream;
      var subIndex = stream.findIndex(function (e) {
        return e.uid === subscriberUID;
      });
      if (subIndex === -1) return;
      stream.splice(subIndex, 1);
    }
  }, {
    key: "calculateHistoryDepth",
    value: function calculateHistoryDepth(resolution) {
      return resolution < 60 ? {
        resolutionBack: "D",
        intervalBack: "1"
      } : undefined;
    }
  }]);

  return DataFeeds;
}();

var balance = {
  data: function data() {
    return {
      select: {
        id: "",
        type: "",
        deposit_address: "ERROR"
      },
      hidesmall: false,
      loading: false,
      search: ""
    };
  },
  computed: {
    getTotalUSDT: function getTotalUSDT() {
      var _this = this;

      var value = 0;
      var currencies = this.$store.getters["public/getAllCurrencies"];
      currencies.forEach(function (e) {
        return value += _this.getCurrencyByUSDT(e.id);
      });
      return value.toFixed(2);
    },
    getTotalUSD: function getTotalUSD() {
      var price = this.$store.getters["public/getGlobalPrice"].USDT;
      if (price) return (price.USD * this.getTotalUSDT).toFixed(2);else return 0;
    },
    getAllCurrencies: function getAllCurrencies() {
      var _this2 = this;

      var currencies = this.$store.getters["public/getAllCurrencies"];
      return currencies.filter(function (e) {
        var btcAmount = Number(_this2.getCurrencyByBTC(e.id));

        if (_this2.search.length) {
          var valueReturn = e.id.indexOf(_this2.search.toLowerCase()) >= 0 || e.name.indexOf(_this2.search.toLowerCase()) >= 0;

          if (_this2.hidesmall) {
            if (btcAmount >= 0.001) return valueReturn;
          } else return valueReturn;
        } else if (_this2.hidesmall) {
          if (btcAmount >= 0.001) return true;
        } else return true;
      });
    }
  },
  methods: {
    getAssets: function getAssets(currency) {
      var assets = helpers.getBalance();

      for (var i in assets) {
        if (assets[i].currency === currency) return assets[i];
      }
    },
    getAllMarket: function getAllMarket(currency) {
      var tickers = this.$store.getters["public/getAllMarkets"];
      return tickers.filter(function (e) {
        if (e.base_unit === currency) return e;
      });
    },
    calculateForTotal: function calculateForTotal(name) {
      var ticker = this.$store.getters["public/getAllTickers"][name];
      var tickerPrice = helpers.getTickerPriceUSD(name, ticker.last);
      var value = tickerPrice * Number(this.getTotal(ticker.base_unit));
      return value || 0;
    },
    getCurrencyByUSDT: function getCurrencyByUSDT(currency) {
      var tickers = this.$store.getters["public/getAllTickers"];
      var allToCheck = ["usd", "usdt", "btc", "eth", "ltc", "xrp"];

      for (var i in allToCheck) {
        if (tickers[currency + allToCheck[i]]) return this.calculateForTotal(currency + allToCheck[i]);
      }

      if (currency === "usd") {
        var price = this.$store.getters["public/getGlobalPrice"].USD;
        if (!price) return Number(this.getTotal(currency));else return Number(price.USDT * this.getTotal(currency));
      } else if (currency === "usdt") return Number(this.getTotal(currency));
    },
    getCurrencyByBTC: function getCurrencyByBTC(currency) {
      var priceUSDT = this.getCurrencyByUSDT(currency);
      var price = this.$store.getters["public/getGlobalPrice"].USDT;
      if (!price) return Number(0).toFixed(8);else return Number(price.BTC * priceUSDT).toFixed(8);
    },
    getCurrencyByUSD: function getCurrencyByUSD(currency) {
      var priceUSDT = this.getCurrencyByUSDT(currency);
      var price = this.$store.getters["public/getGlobalPrice"].USDT;
      if (!price) return Number(0).toFixed(8);else return Number(price.USD * priceUSDT).toFixed(2);
    },
    getTotal: function getTotal(currency) {
      return (Number(this.getAvailable(currency)) + Number(this.getLocked(currency))).toFixed(8);
    },
    getAvailable: function getAvailable(currency) {
      var assets = this.getAssets(currency);
      return Number(assets.balance).toFixed(8);
    },
    getLocked: function getLocked(currency) {
      var assets = this.getAssets(currency);
      return Number(assets.locked).toFixed(8);
    },
    changeAssets: function changeAssets(currency, type) {
      var _this3 = this;

      this.select.id = currency;
      this.select.type = type;
      this.select.deposit_address = null;

      if (type === "deposit") {
        this.loading = true;
        new ApiClient("trade").get("account/deposit_address/" + currency).then(function (_ref) {
          var data = _ref.data;
          _this3.loading = false;
          _this3.select.deposit_address = data.address;
        })["catch"](function () {
          return _this3.loading = false;
        });
      }
    },
    changeMarket: function changeMarket($market) {
      var marketArray = $market.split("/");
      var market = marketArray.join("_");
      this.$store.commit("public/SYNC_EXCHANGE", market);
    }
  }
};

var canvas = (function (canvas) {
  var ctx = canvas.getContext("2d"),
      w = canvas.width = document.querySelector(".preview").offsetWidth,
      h = canvas.height = document.querySelector(".preview").offsetHeight,
      hue = 217,
      stars = [],
      count = 0,
      maxStars = 500;
  var canvas2 = document.createElement("canvas"),
      ctx2 = canvas2.getContext("2d");
  canvas2.width = 100;
  canvas2.height = 100;
  var half = canvas2.width / 2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
  gradient2.addColorStop(0.025, "#fff");
  gradient2.addColorStop(0.1, "hsl(" + hue + ", 61%, 33%)");
  gradient2.addColorStop(0.25, "hsl(" + hue + ", 64%, 6%)");
  gradient2.addColorStop(1, "transparent");
  ctx2.fillStyle = gradient2;
  ctx2.beginPath();
  ctx2.arc(half, half, half, 0, Math.PI * 2);
  ctx2.fill();

  function random(min, max) {
    if (arguments.length < 2) {
      max = min;
      min = 0;
    }

    if (min > max) {
      var hold = max;
      max = min;
      min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function maxOrbit(x, y) {
    var max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter / 2;
  }

  var Star = function Star() {
    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 500000;
    this.alpha = random(2, 10) / 10;
    count++;
    stars[count] = this;
  };

  Star.prototype.draw = function () {
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
        twinkle = random(10);

    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  };

  for (var i = 0; i < maxStars; i++) {
    new Star();
  }

  function animation() {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = colors["bg-color"];
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 1, l = stars.length; i < l; i++) {
      stars[i].draw();
    }

    window.requestAnimationFrame(animation);
  }

  animation();
});

var options = {
  width: 800,
  height: 500,
  symbol: "AA",
  interval: "D",
  timezone: "Etc/UTC",
  container_id: "",
  library_path: "",
  locale: "en",
  widgetbar: {
    details: false,
    watchlist: false,
    watchlist_settings: {
      default_symbols: []
    }
  },
  overrides: {
    "mainSeriesProperties.showCountdown": false
  },
  studies_overrides: {},
  brokerConfig: {
    configFlags: {}
  },
  fullscreen: false,
  autosize: false,
  disabled_features: [],
  enabled_features: [],
  debug: false,
  logo: {},
  time_frames: [{
    text: "5y",
    resolution: "W"
  }, {
    text: "1y",
    resolution: "W"
  }, {
    text: "6m",
    resolution: "120"
  }, {
    text: "3m",
    resolution: "60"
  }, {
    text: "1m",
    resolution: "30"
  }, {
    text: "5d",
    resolution: "5"
  }, {
    text: "1d",
    resolution: "1"
  }],
  client_id: "0",
  user_id: "0",
  charts_storage_api_version: "1.0",
  favorites: {
    intervals: [],
    chartTypes: []
  }
};

var presets = {
  mobile: {
    disabled_features: ["left_toolbar", "header_widget", "timeframes_toolbar", "edit_buttons_in_legend", "context_menus", "control_bar", "border_around_the_chart"],
    enabled_features: []
  }
};

var extend = function extend(o, add) {
  var out = Object.assign({}, o);

  for (var name in add) {
    if ("object" != _typeof(o[name]) || null === o[name] || Array.isArray(o[name])) {
      if (void 0 !== add[name]) {
        out[name] = add[name];
      }
    } else {
      out[name] = extend(o[name], add[name]);
    }
  }

  return out;
};

var Model =
/*#__PURE__*/
function () {
  function Model(opts) {
    _classCallCheck(this, Model);

    if (this._id = "tradingview_" + (1048576 * (1 + Math.random()) | 0).toString(16).substring(1), this._ready = false, this._readyHandlers = [], this._onWindowResize = this._autoResizeChart.bind(this), !opts.datafeed) {
      throw new Error("Datafeed is not defined");
    }

    if (this._options = extend(options, opts), opts.preset) {
      var p = presets[opts.preset];

      if (p) {
        if (void 0 !== this._options.disabled_features) {
          this._options.disabled_features = this._options.disabled_features.concat(p.disabled_features);
        } else {
          this._options.disabled_features = p.disabled_features;
        }

        if (void 0 !== this._options.enabled_features) {
          this._options.enabled_features = this._options.enabled_features.concat(p.enabled_features);
        } else {
          this._options.enabled_features = p.enabled_features;
        }
      } else {
        console.warn("Unknown preset: `" + opts.preset + "`");
      }
    }

    if ("Dark" === this._options.theme && void 0 === this._options.loading_screen) {
      this._options.loading_screen = {
        backgroundColor: "#131722"
      };
    }

    this._create();
  }

  _createClass(Model, [{
    key: "onChartReady",
    value: function onChartReady(t) {
      if (this._ready) {
        t.call(this);
      } else {
        this._readyHandlers.push(t);
      }
    }
  }, {
    key: "headerReady",
    value: function headerReady() {
      var t = this;
      return this._innerWindowLoaded.then(function () {
        return t._innerWindow().headerReady();
      });
    }
  }, {
    key: "onGrayedObjectClicked",
    value: function onGrayedObjectClicked(isBgroundImg) {
      this._innerAPI().onGrayedObjectClicked(isBgroundImg);
    }
  }, {
    key: "onShortcut",
    value: function onShortcut(s, e) {
      this._innerWindow().createShortcutAction(s, e);
    }
  }, {
    key: "subscribe",
    value: function subscribe(event, subName) {
      this._innerAPI().subscribe(event, subName);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(address, callback) {
      this._innerAPI().unsubscribe(address, callback);
    }
  }, {
    key: "chart",
    value: function chart(data) {
      return this._innerAPI().chart(data);
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(data) {
      this.remove();
      /** @type {string} */

      this._options.locale = data;

      this._create();
    }
  }, {
    key: "setSymbol",
    value: function setSymbol(elem, value, settings) {
      this._innerAPI().changeSymbol(elem, value + "", settings);
    }
  }, {
    key: "remove",
    value: function remove() {
      window.removeEventListener("resize", this._onWindowResize);

      this._readyHandlers.splice(0, this._readyHandlers.length);

      delete window[this._id];

      if (this._iFrame.parentNode) {
        this._iFrame.parentNode.removeChild(this._iFrame);
      }
    }
  }, {
    key: "closePopupsAndDialogs",
    value: function closePopupsAndDialogs() {
      this._innerAPI().closePopupsAndDialogs();
    }
  }, {
    key: "selectLineTool",
    value: function selectLineTool(isBgroundImg) {
      this._innerAPI().selectLineTool(isBgroundImg);
    }
  }, {
    key: "selectedLineTool",
    value: function selectedLineTool() {
      return this._innerAPI().selectedLineTool();
    }
  }, {
    key: "save",
    value: function save(refreshForm) {
      this._innerAPI().saveChart(refreshForm);
    }
  }, {
    key: "load",
    value: function load(param, skin) {
      this._innerAPI().loadChart({
        json: param,
        extendedData: skin
      });
    }
  }, {
    key: "getSavedCharts",
    value: function getSavedCharts(isBgroundImg) {
      this._innerAPI().getSavedCharts(isBgroundImg);
    }
  }, {
    key: "loadChartFromServer",
    value: function loadChartFromServer(isBgroundImg) {
      this._innerAPI().loadChartFromServer(isBgroundImg);
    }
  }, {
    key: "saveChartToServer",
    value: function saveChartToServer(isBgroundImg, stgs, index, concurrents) {
      this._innerAPI().saveChartToServer(isBgroundImg, stgs, index, concurrents);
    }
  }, {
    key: "removeChartFromServer",
    value: function removeChartFromServer(preflightData, prefetch) {
      this._innerAPI().removeChartFromServer(preflightData, prefetch);
    }
  }, {
    key: "onContextMenu",
    value: function onContextMenu(e) {
      this._innerAPI().onContextMenu(e);
    }
  }, {
    key: "createButton",
    value: function createButton(type) {
      return this._innerWindow().createButton(type);
    }
  }, {
    key: "showNoticeDialog",
    value: function showNoticeDialog(isBgroundImg) {
      this._innerAPI().showNoticeDialog(isBgroundImg);
    }
  }, {
    key: "showConfirmDialog",
    value: function showConfirmDialog(link) {
      this._innerAPI().showConfirmDialog(link);
    }
  }, {
    key: "showLoadChartDialog",
    value: function showLoadChartDialog() {
      this._innerAPI().showLoadChartDialog();
    }
  }, {
    key: "showSaveAsChartDialog",
    value: function showSaveAsChartDialog() {
      this._innerAPI().showSaveAsChartDialog();
    }
  }, {
    key: "symbolInterval",
    value: function symbolInterval() {
      return this._innerAPI().getSymbolInterval();
    }
  }, {
    key: "mainSeriesPriceFormatter",
    value: function mainSeriesPriceFormatter() {
      return this._innerAPI().mainSeriesPriceFormatter();
    }
  }, {
    key: "getIntervals",
    value: function getIntervals() {
      return this._innerAPI().getIntervals();
    }
  }, {
    key: "getStudiesList",
    value: function getStudiesList() {
      return this._innerAPI().getStudiesList();
    }
  }, {
    key: "addCustomCSSFile",
    value: function addCustomCSSFile(isBgroundImg) {
      this._innerWindow().addCustomCSSFile(isBgroundImg);
    }
  }, {
    key: "applyOverrides",
    value: function applyOverrides(overrides) {
      this._options = extend(this._options, {
        overrides: overrides
      });

      this._innerWindow().applyOverrides(overrides);
    }
  }, {
    key: "applyStudiesOverrides",
    value: function applyStudiesOverrides(isBgroundImg) {
      this._innerWindow().applyStudiesOverrides(isBgroundImg);
    }
  }, {
    key: "watchList",
    value: function watchList() {
      return this._innerAPI().watchlist();
    }
  }, {
    key: "activeChart",
    value: function activeChart() {
      return this._innerAPI().activeChart();
    }
  }, {
    key: "chartsCount",
    value: function chartsCount() {
      return this._innerAPI().chartsCount();
    }
  }, {
    key: "layout",
    value: function layout() {
      return this._innerAPI().layout();
    }
  }, {
    key: "setLayout",
    value: function setLayout(mode) {
      this._innerAPI().setLayout(mode);
    }
  }, {
    key: "layoutName",
    value: function layoutName() {
      return this._innerAPI().layoutName();
    }
  }, {
    key: "changeTheme",
    value: function changeTheme(themeid) {
      this._innerWindow().changeTheme(themeid);
    }
  }, {
    key: "takeScreenshot",
    value: function takeScreenshot() {
      this._innerAPI().takeScreenshot();
    }
  }, {
    key: "lockAllDrawingTools",
    value: function lockAllDrawingTools() {
      return this._innerAPI().lockAllDrawingTools();
    }
  }, {
    key: "hideAllDrawingTools",
    value: function hideAllDrawingTools() {
      return this._innerAPI().hideAllDrawingTools();
    }
  }, {
    key: "undoRedoState",
    value: function undoRedoState() {
      return this._innerAPI().undoRedoState();
    }
  }, {
    key: "_innerAPI",
    value: function _innerAPI() {
      return this._innerWindow().tradingViewApi;
    }
  }, {
    key: "_innerWindow",
    value: function _innerWindow() {
      return this._iFrame.contentWindow;
    }
  }, {
    key: "_autoResizeChart",
    value: function _autoResizeChart() {
      if (this._options.fullscreen) {
        /** @type {string} */
        this._iFrame.style.height = window.innerHeight + "px";
      }
    }
  }, {
    key: "_create",
    value: function _create() {
      var _this = this;

      var html = this._render();
      /** @type {(Element|null)} */


      var e = document.getElementById(this._options.container_id);

      if (null === e) {
        throw new Error("There is no such element - #" + this._options.container_id);
      }

      e.innerHTML = html;
      /** @type {(Element|null)} */

      this._iFrame = e.querySelector("#" + this._id);
      /** @type {(Element|null)} */

      var img = this._iFrame;

      if (this._options.autosize || this._options.fullscreen) {
        /** @type {string} */
        img.style.width = "100%";

        if (!this._options.fullscreen) {
          /** @type {string} */
          img.style.height = "100%";
        }
      }

      window.addEventListener("resize", this._onWindowResize);

      this._onWindowResize();
      /** @type {!Promise} */


      this._innerWindowLoaded = new Promise(function (displayChangeFn) {
        /**
         * @return {undefined}
         */
        var listener = function listener() {
          img.removeEventListener("load", listener, false);
          displayChangeFn();
        };

        img.addEventListener("load", listener, false);
      });

      this._innerWindowLoaded.then(function () {
        _this._innerWindow().widgetReady(function () {
          /** @type {boolean} */
          _this._ready = true;
          /** @type {number} */

          var i = 0;
          var video = _this._readyHandlers;

          for (; i < video.length; i++) {
            var v = video[i];

            try {
              v.call(_this);
            } catch (logValues) {
              console.error(logValues);
            }
          }

          _this._innerWindow().initializationFinished();
        });
      });
    }
  }, {
    key: "_render",
    value: function _render() {
      /** @type {!Window} */
      var _languages = window;
      _languages[this._id] = {
        datafeed: this._options.datafeed,
        customFormatters: this._options.customFormatters,
        brokerFactory: this._options.brokerFactory,
        overrides: this._options.overrides,
        studiesOverrides: this._options.studies_overrides,
        disabledFeatures: this._options.disabled_features,
        enabledFeatures: this._options.enabled_features,
        brokerConfig: this._options.brokerConfig,
        restConfig: this._options.restConfig,
        favorites: this._options.favorites,
        logo: this._options.logo,
        numeric_formatting: this._options.numeric_formatting,
        rss_news_feed: this._options.rss_news_feed,
        newsProvider: this._options.news_provider,
        loadLastChart: this._options.load_last_chart,
        saveLoadAdapter: this._options.save_load_adapter,
        loading_screen: this._options.loading_screen,
        settingsAdapter: this._options.settings_adapter,
        customIndicatorsUrl: this._options.indicators_file_name
      };

      if (this._options.saved_data) {
        _languages[this._id].chartContent = {
          json: this._options.saved_data
        };
      }
      /** @type {string} */


      var e = (this._options.library_path || "") + "static/" + encodeURIComponent(this._options.locale) + "-tv-chart.9a97ec3c5cba51244359.html#symbol=" + encodeURIComponent(this._options.symbol) + "&interval=" + encodeURIComponent(this._options.interval) + (this._options.timeframe ? "&timeframe=" + encodeURIComponent(this._options.timeframe) : "") + (this._options.toolbar_bg ? "&toolbarbg=" + encodeURIComponent(this._options.toolbar_bg.replace("#", "")) : "") + (this._options.studies_access ? "&studiesAccess=" + encodeURIComponent(JSON.stringify(this._options.studies_access)) : "") + "&widgetbar=" + encodeURIComponent(JSON.stringify(this._options.widgetbar)) + (this._options.drawings_access ? "&drawingsAccess=" + encodeURIComponent(JSON.stringify(this._options.drawings_access)) : "") + "&timeFrames=" + encodeURIComponent(JSON.stringify(this._options.time_frames)) + "&locale=" + encodeURIComponent(this._options.locale) + "&uid=" + encodeURIComponent(this._id) + "&clientId=" + encodeURIComponent(String(this._options.client_id)) + "&userId=" + encodeURIComponent(String(this._options.user_id)) + (this._options.charts_storage_url ? "&chartsStorageUrl=" + encodeURIComponent(this._options.charts_storage_url) : "") + (this._options.charts_storage_api_version ? "&chartsStorageVer=" + encodeURIComponent(this._options.charts_storage_api_version) : "") + (this._options.custom_css_url ? "&customCSS=" + encodeURIComponent(this._options.custom_css_url) : "") + (this._options.auto_save_delay ? "&autoSaveDelay=" + encodeURIComponent(String(this._options.auto_save_delay)) : "") + "&debug=" + encodeURIComponent(String(this._options.debug)) + (this._options.snapshot_url ? "&snapshotUrl=" + encodeURIComponent(this._options.snapshot_url) : "") + (this._options.timezone ? "&timezone=" + encodeURIComponent(this._options.timezone) : "") + (this._options.study_count_limit ? "&studyCountLimit=" + encodeURIComponent(String(this._options.study_count_limit)) : "") + (this._options.symbol_search_request_delay ? "&ssreqdelay=" + encodeURIComponent(String(this._options.symbol_search_request_delay)) : "") + (this._options.theme ? "&theme=" + encodeURIComponent(String(this._options.theme)) : "");
      return '<iframe id="' + this._id + '" name="' + this._id + '"  src="' + e + '"' + (this._options.autosize || this._options.fullscreen ? "" : ' width="' + this._options.width + '" height="' + this._options.height + '"') + ' frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen style="display:block;"></iframe>';
    }
  }]);

  return Model;
}();

function cssjson () {
  var base = this;

  base.init = function () {
    // String functions
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };

    String.prototype.repeat = function (n) {
      return new Array(1 + n).join(this);
    };
  };

  base.init();
  var commentX = /\/\*[\s\S]*?\*\//g;
  var lineAttrX = /([^\:]+):([^\;]*);/; // This is used, a concatenation of all above. We use alternation to
  // capture.

  var altX = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gim; // Capture groups

  var capComment = 1;
  var capSelector = 2;
  var capEnd = 3;
  var capAttr = 4;

  var isEmpty = function isEmpty(x) {
    return typeof x == "undefined" || x.length == 0 || x == null;
  };

  var isCssJson = function isCssJson(node) {
    return !isEmpty(node) ? node.attributes && node.children : false;
  };
  /**
   * Input is css string and current pos, returns JSON object
   *
   * @param cssString
   *            The CSS string.
   * @param args
   *            An optional argument object. ordered: Whether order of
   *            comments and other nodes should be kept in the output. This
   *            will return an object where all the keys are numbers and the
   *            values are objects containing "name" and "value" keys for each
   *            node. comments: Whether to capture comments. split: Whether to
   *            split each comma separated list of selectors.
   */


  base.toJSON = function (cssString, args) {
    var node = {
      children: {},
      attributes: {}
    };
    var match = null;
    var count = 0;

    if (typeof args == "undefined") {
      var args = {
        ordered: false,
        comments: false,
        stripComments: false,
        split: false
      };
    }

    if (args.stripComments) {
      args.comments = false;
      cssString = cssString.replace(commentX, "");
    }

    while ((match = altX.exec(cssString)) != null) {
      if (!isEmpty(match[capComment]) && args.comments) {
        // Comment
        var add = match[capComment].trim();
        node[count++] = add;
      } else if (!isEmpty(match[capSelector])) {
        // New node, we recurse
        var name = match[capSelector].trim(); // This will return when we encounter a closing brace

        var newNode = base.toJSON(cssString, args);

        if (args.ordered) {
          var obj = {};
          obj["name"] = name;
          obj["value"] = newNode; // Since we must use key as index to keep order and not
          // name, this will differentiate between a Rule Node and an
          // Attribute, since both contain a name and value pair.

          obj["type"] = "rule";
          node[count++] = obj;
        } else {
          if (args.split) {
            var bits = name.split(",");
          } else {
            var bits = [name];
          }

          for (var i = 0; i < bits.length; i++) {
            var sel = bits[i].trim();

            if (sel in node.children) {
              for (var att in newNode.attributes) {
                node.children[sel].attributes[att] = newNode.attributes[att];
              }
            } else {
              node.children[sel] = newNode;
            }
          }
        }
      } else if (!isEmpty(match[capEnd])) {
        // Node has finished
        return node;
      } else if (!isEmpty(match[capAttr])) {
        var line = match[capAttr].trim();
        var attr = lineAttrX.exec(line);

        if (attr) {
          // Attribute
          var name = attr[1].trim();
          var value = attr[2].trim();

          if (args.ordered) {
            var obj = {};
            obj["name"] = name;
            obj["value"] = value;
            obj["type"] = "attr";
            node[count++] = obj;
          } else {
            if (name in node.attributes) {
              var currVal = node.attributes[name];

              if (!(currVal instanceof Array)) {
                node.attributes[name] = [currVal];
              }

              node.attributes[name].push(value);
            } else {
              node.attributes[name] = value;
            }
          }
        } else {
          // Semicolon terminated line
          node[count++] = line;
        }
      }
    }

    return node;
  };
  /**
   * @param node
   *            A JSON node.
   * @param depth
   *            The depth of the current node; used for indentation and
   *            optional.
   * @param breaks
   *            Whether to add line breaks in the output.
   */


  base.toCSS = function (node, depth, breaks) {
    var cssString = "";

    if (typeof depth == "undefined") {
      depth = 0;
    }

    if (typeof breaks == "undefined") {
      breaks = false;
    }

    if (node.attributes) {
      for (var i in node.attributes) {
        var att = node.attributes[i];

        if (att instanceof Array) {
          for (var j = 0; j < att.length; j++) {
            cssString += strAttr(i, att[j], depth);
          }
        } else {
          cssString += strAttr(i, att, depth);
        }
      }
    }

    if (node.children) {
      var first = true;

      for (var _i in node.children) {
        if (breaks && !first) {
          cssString += "\n";
        } else {
          first = false;
        }

        cssString += strNode(_i, node.children[_i], depth);
      }
    }

    return cssString;
  };
  /**
   * @param data
   *            You can pass css string or the CSSJS.toJSON return value.
   * @param id (Optional)
   *            To identify and easy removable of the style element
   * @param replace (Optional. defaults to TRUE)
   *            Whether to remove or simply do nothing
   * @return HTMLLinkElement
   */


  base.toHEAD = function (data, id, replace) {
    var head = document.getElementsByTagName("head")[0];
    var xnode = document.getElementById(id);

    var _xnodeTest = xnode !== null && xnode instanceof HTMLStyleElement;

    if (isEmpty(data) || !(head instanceof HTMLHeadElement)) return;

    if (_xnodeTest) {
      if (replace === true || isEmpty(replace)) {
        xnode.removeAttribute("id");
      } else return;
    }

    if (isCssJson(data)) {
      data = base.toCSS(data);
    }

    var node = document.createElement("style");
    node.type = "text/css";

    if (!isEmpty(id)) {
      node.id = id;
    } else {
      node.id = "cssjson_" + timestamp();
    }

    if (node.styleSheet) {
      node.styleSheet.cssText = data;
    } else {
      node.appendChild(document.createTextNode(data));
    }

    head.appendChild(node);

    if (isValidStyleNode(node)) {
      if (_xnodeTest) {
        xnode.parentNode.removeChild(xnode);
      }
    } else {
      node.parentNode.removeChild(node);

      if (_xnodeTest) {
        xnode.setAttribute("id", id);
        node = xnode;
      } else return;
    }

    return node;
  }; // Alias


  if (typeof window != "undefined") {
    window.createCSS = base.toHEAD;
  } // Helpers


  var isValidStyleNode = function isValidStyleNode(node) {
    return node instanceof HTMLStyleElement && node.sheet.cssRules.length > 0;
  };

  var timestamp = function timestamp() {
    return Date.now() || +new Date();
  };

  var strAttr = function strAttr(name, value, depth) {
    return "\t".repeat(depth) + name + ": " + value + ";\n";
  };

  var strNode = function strNode(name, value, depth) {
    var cssString = "\t".repeat(depth) + name + " {\n";
    cssString += base.toCSS(value, depth + 1);
    cssString += "\t".repeat(depth) + "}\n";
    return cssString;
  };

  return base;
}

function getY(max, height, diff, value) {
  return parseFloat((height - value * height / max + diff).toFixed(2));
}

function removeChildren(svg) {
  _toConsumableArray(svg.querySelectorAll("*")).forEach(function (element) {
    return svg.removeChild(element);
  });
}

function defaultFetch(entry) {
  return entry.value;
}

function buildElement(tag, attrs) {
  var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

  for (var name in attrs) {
    element.setAttribute(name, attrs[name]);
  }

  return element;
}

function sparkline(svg, entries, options) {
  removeChildren(svg);

  if (entries.length <= 1) {
    return;
  }

  options = options || {};

  if (typeof entries[0] === "number") {
    entries = entries.map(function (entry) {
      return {
        value: entry
      };
    });
  } // This function will be called whenever the mouse moves
  // over the SVG. You can use it to render something like a
  // tooltip.


  var onmousemove = options.onmousemove; // This function will be called whenever the mouse leaves
  // the SVG area. You can use it to hide the tooltip.

  var onmouseout = options.onmouseout; // Should we run in interactive mode? If yes, this will handle the
  // cursor and spot position when moving the mouse.

  var interactive = "interactive" in options ? options.interactive : !!onmousemove; // Define how big should be the spot area.

  var spotRadius = options.spotRadius || 2;
  var spotDiameter = spotRadius * 2; // Define how wide should be the cursor area.

  var cursorWidth = options.cursorWidth || 2; // Get the stroke width; this is used to compute the
  // rendering offset.

  var strokeWidth = parseFloat(svg.attributes["stroke-width"].value); // By default, data must be formatted as an array of numbers or
  // an array of objects with the value key (like `[{value: 1}]`).
  // You can set a custom function to return data for a different
  // data structure.

  var fetch = options.fetch || defaultFetch; // Retrieve only values, easing the find for the maximum value.

  var values = entries.map(function (entry) {
    return fetch(entry);
  }); // The rendering width will account for the spot size.

  var width = parseFloat(svg.attributes.width.value) - spotDiameter * 2; // Get the SVG element's full height.
  // This is used

  var fullHeight = parseFloat(svg.attributes.height.value); // The rendering height accounts for stroke width and spot size.

  var height = fullHeight - strokeWidth * 2 - spotDiameter; // The maximum value. This is used to calculate the Y coord of
  // each sparkline datapoint.

  var max = Math.max.apply(Math, _toConsumableArray(values)); // Some arbitrary value to remove the cursor and spot out of
  // the viewing canvas.

  var offscreen = -1000; // Cache the last item index.

  var lastItemIndex = values.length - 1; // Calculate the X coord base step.

  var offset = width / lastItemIndex; // Hold all datapoints, which is whatever we got as the entry plus
  // x/y coords and the index.

  var datapoints = []; // Hold the line coordinates.

  var pathY = getY(max, height, strokeWidth + spotRadius, values[0]);
  var pathCoords = "M".concat(spotDiameter, " ").concat(pathY);
  values.forEach(function (value, index) {
    var x = index * offset + spotDiameter;
    var y = getY(max, height, strokeWidth + spotRadius, value);
    datapoints.push(Object.assign({}, entries[index], {
      index: index,
      x: x,
      y: y
    }));
    pathCoords += " L ".concat(x, " ").concat(y);
  });
  var path = buildElement("path", {
    "class": "sparkline--line",
    d: pathCoords,
    fill: "none"
  });
  var fillCoords = "".concat(pathCoords, " V ").concat(fullHeight, " L ").concat(spotDiameter, " ").concat(fullHeight, " Z");
  var fill = buildElement("path", {
    "class": "sparkline--fill",
    d: fillCoords,
    stroke: "none"
  });
  svg.appendChild(fill);
  svg.appendChild(path);

  if (!interactive) {
    return;
  }

  var cursor = buildElement("line", {
    "class": "sparkline--cursor",
    x1: offscreen,
    x2: offscreen,
    y1: 0,
    y2: fullHeight,
    "stroke-width": cursorWidth
  });
  var spot = buildElement("circle", {
    "class": "sparkline--spot",
    cx: offscreen,
    cy: offscreen,
    r: spotRadius
  });
  svg.appendChild(cursor);
  svg.appendChild(spot);
  var interactionLayer = buildElement("rect", {
    width: svg.attributes.width.value,
    height: svg.attributes.height.value,
    style: "fill: transparent; stroke: transparent",
    "class": "sparkline--interaction-layer"
  });
  svg.appendChild(interactionLayer);
  interactionLayer.addEventListener("mouseout", function (event) {
    cursor.setAttribute("x1", offscreen);
    cursor.setAttribute("x2", offscreen);
    spot.setAttribute("cx", offscreen);

    if (onmouseout) {
      onmouseout(event);
    }
  });
  interactionLayer.addEventListener("mousemove", function (event) {
    var mouseX = event.offsetX;
    var nextDataPoint = datapoints.find(function (entry) {
      return entry.x >= mouseX;
    });

    if (!nextDataPoint) {
      nextDataPoint = datapoints[lastItemIndex];
    }

    var previousDataPoint = datapoints[datapoints.indexOf(nextDataPoint) - 1];
    var currentDataPoint;
    var halfway;

    if (previousDataPoint) {
      halfway = previousDataPoint.x + (nextDataPoint.x - previousDataPoint.x) / 2;
      currentDataPoint = mouseX >= halfway ? nextDataPoint : previousDataPoint;
    } else {
      currentDataPoint = nextDataPoint;
    }

    var x = currentDataPoint.x;
    var y = currentDataPoint.y;
    spot.setAttribute("cx", x);
    spot.setAttribute("cy", y);
    cursor.setAttribute("x1", x);
    cursor.setAttribute("x2", x);

    if (onmousemove) {
      onmousemove(event, currentDataPoint);
    }
  });
}

var ViewPortHandler =
/*#__PURE__*/
function () {
  function ViewPortHandler() {
    _classCallCheck(this, ViewPortHandler);

    // 绘制区域参数
    this.contentRect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }; // 整个view的高度

    this.viewHeight = 0; // 整个view的宽度

    this.viewWidth = 0;
  }
  /**
   * 设置尺寸
   * @param width
   * @param height
   */


  _createClass(ViewPortHandler, [{
    key: "setChartDimens",
    value: function setChartDimens(width, height) {
      this.viewWidth = width;
      this.viewHeight = height;
      this.restrainViewPort(this.contentLeft(), this.contentTop(), width - this.contentRight(), height - this.contentBottom());
    }
  }, {
    key: "restrainViewPort",
    value: function restrainViewPort(offsetLeft, offsetTop, offsetRight, offsetBottom) {
      this.contentRect.left = offsetLeft;
      this.contentRect.right = this.viewWidth - offsetRight;
      this.contentRect.top = offsetTop;
      this.contentRect.bottom = this.viewHeight - offsetBottom;
    }
  }, {
    key: "contentTop",
    value: function contentTop() {
      return this.contentRect.top;
    }
  }, {
    key: "contentLeft",
    value: function contentLeft() {
      return this.contentRect.left;
    }
  }, {
    key: "contentRight",
    value: function contentRight() {
      return this.contentRect.right;
    }
  }, {
    key: "contentBottom",
    value: function contentBottom() {
      return this.contentRect.bottom;
    }
    /**
     * 获取中间点坐标
     */

  }, {
    key: "getContentCenter",
    value: function getContentCenter() {
      var point = {};
      point.x = (this.contentRect.left + this.contentRect.right) / 2;
      point.y = (this.contentRect.top + this.contentRect.bottom) / 2;
      return point;
    }
  }, {
    key: "isInBoundsX",
    value: function isInBoundsX(x) {
      return this.isInBoundsLeft(x) && this.isInBoundsRight(x);
    }
  }, {
    key: "isInBoundsLeft",
    value: function isInBoundsLeft(x) {
      return this.contentRect.left <= x + 1;
    }
  }, {
    key: "isInBoundsRight",
    value: function isInBoundsRight(x) {
      var tx = +(x * 100).toFixed(0) / 100;
      return this.contentRect.right >= tx - 1;
    }
  }]);

  return ViewPortHandler;
}();

var DataBounds =
/*#__PURE__*/
function () {
  function DataBounds(viewPortHandler) {
    _classCallCheck(this, DataBounds);

    this.viewPortHandler = viewPortHandler; // 数据源

    this.dataList = []; // 数据绘制起始位置

    this.min = 50; // 绘制的数据条数

    this.range = 40; // 最大绘制条数

    this.maxRange = 80; // 最小绘制条数

    this.minRange = 20; // 没条数据的所占的空间

    this.dataSpace = 0; // 每条数据之间的距离比例

    this.dataMarginSpaceRate = 0.2; // 当前数据的位置

    this.currentDataPos = 0;
  }
  /**
   * 获取柱状图之间的间隙
   */


  _createClass(DataBounds, [{
    key: "space",
    value: function space() {
      this.dataSpace = (this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft()) / this.range;
    }
  }, {
    key: "moveToLast",
    value: function moveToLast() {
      if (this.dataList.length > this.range) {
        this.min = this.dataList.length - this.range;
        this.currentDataPos = this.dataList.length - 1;
      } else {
        this.min = 0;
      }
    }
    /**
     * 计算当前数据的索引
     * @param x
     */

  }, {
    key: "calcCurrentDataIndex",
    value: function calcCurrentDataIndex(x) {
      var range = +Math.ceil((x - this.viewPortHandler.contentLeft()) / this.dataSpace).toFixed(0);
      this.currentDataPos = this.min + range - 1;
    }
  }]);

  return DataBounds;
}();

var Chart =
/*#__PURE__*/
function () {
  function Chart(dataBounds, viewPortHandler) {
    _classCallCheck(this, Chart);

    this.dataBounds = dataBounds;
    this.viewPortHandler = viewPortHandler;
    this.chartTop = 0;
    this.chartHeight = 0;
  }
  /**
   * 设置图尺寸
   * @param height
   * @param top
   */


  _createClass(Chart, [{
    key: "setChartDimens",
    value: function setChartDimens(height, top) {
      this.chartHeight = height;
      this.chartTop = top;
    }
    /**
     * 获取y点坐标
     * @param yValue
     * @param yMin
     * @param interval
     * @returns {number}
     */

  }, {
    key: "getY",
    value: function getY(yValue, yMin, interval) {
      return +(this.chartTop + (1 - (yValue - yMin) / interval) * this.chartHeight).toFixed(0);
    }
  }]);

  return Chart;
}();

var GridChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(GridChart, _Chart);

  function GridChart(grid, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, GridChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GridChart).call(this, dataBounds, viewPortHandler));
    _this.grid = grid;
    return _this;
  }

  _createClass(GridChart, [{
    key: "draw",
    value: function draw(canvas) {
      if (!this.grid.display) {
        return;
      }

      canvas.strokeStyle = this.grid.lineColor;
      canvas.lineWidth = this.grid.lineSize;
      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop());
      canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop());
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom());
      canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom());
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop());
      canvas.lineTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom());
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentTop());
      canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom());
      canvas.stroke();
      canvas.closePath();
    }
  }]);

  return GridChart;
}(Chart);

var utils = {
  canvas: document.createElement("canvas").getContext("2d"),
  formatDate: function formatDate(timestamp) {
    var date = new Date(timestamp);
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    return (month.length === 1 ? "0" + month : month) + "-" + (day.length === 1 ? "0" + day : day) + " " + (hours.length === 1 ? "0" + hours : hours) + ":" + (minutes.length === 1 ? "0" + minutes : minutes);
  },

  /**
   * 测量文字的宽度
   * @param font
   * @param text
   * @returns {number}
   */
  calcTextWidth: function calcTextWidth(font, text) {
    this.canvas.font = font;
    return this.canvas.measureText(text).width;
  },
  nice: function nice(value) {
    var exponent = Math.floor(Math.log(value) / Math.log(10.0));
    var exp10 = Math.pow(10.0, exponent);
    var f = value / exp10; // 1 <= f < 10

    var nf = 0;

    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }

    value = nf * exp10;
    return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value;
  },
  getIntervalPrecision: function getIntervalPrecision(value) {
    var str = value.toString(); // Consider scientific notation: '3.4e-12' '3.4e+12'

    var eIndex = str.indexOf("e");

    if (eIndex > 0) {
      var precision = +str.slice(eIndex + 1);
      return precision < 0 ? -precision : 0;
    } else {
      var dotIndex = str.indexOf(".");
      return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
    }
  },
  round: function round(x, precision) {
    if (precision == null) {
      precision = 10;
    } // Avoid range error


    precision = Math.min(Math.max(0, precision), 20);
    x = (+x).toFixed(precision);
    return x;
  }
};

var AxisChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(AxisChart, _Chart);

  function AxisChart(dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, AxisChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AxisChart).call(this, dataBounds, viewPortHandler));
    _this.values = [];
    _this.valueCount = 0;
    return _this;
  }
  /**
   * 计算x轴上的值
   * @param min
   * @param max
   */


  _createClass(AxisChart, [{
    key: "computeAxisValues",
    value: function computeAxisValues(min, max) {
      var span = max - min;

      if (span < 0) {
        this.values = [];
        this.valueCount = 0;
        return;
      }

      var interval = +utils.nice(span / 5.0);
      var precision = utils.getIntervalPrecision(interval);
      var first = +utils.round(Math.ceil(min / interval) * interval, precision);
      var last = +utils.round(Math.floor(max / interval) * interval, precision);
      var n = 0;
      var f = first;

      if (interval !== 0) {
        while (f <= +last) {
          ++n;
          f += interval;
        }
      }

      this.valueCount = n;
      this.values = [];
      var i = 0;
      f = first;

      while (i < n) {
        this.values[i] = f;
        f += interval;
        ++i;
      }
    }
  }]);

  return AxisChart;
}(Chart);

/**
 * 指标类型
 */

var IndicatorType = {
  /**
   * 没有设置任何指标
   */
  NO: "NO",

  /**
   * 均线
   */
  MA: "MA",

  /**
   * 成交量
   */
  VOL: "VOL",

  /**
   * 指数平滑异同平均线（MACD指标）
   */
  MACD: "MACD",

  /**
   * 布林指标
   */
  BOLL: "BOLL",

  /**
   * 随机指标(KDJ)
   */
  KDJ: "KDJ",

  /**
   * 随机指标(KD)，同KDJ，只输出KD
   */
  KD: "KD",

  /**
   * 强弱指标
   */
  RSI: "RSI",

  /**
   * 乖离率（BIAS）是测量股价偏离均线大小程度的指标
   */
  BIAS: "BIAS",

  /**
   * 情绪指标（BRAR）也称为人气意愿指标
   */
  BRAR: "BRAR",

  /**
   * 顺势指标
   */
  CCI: "CCI",

  /**
   * 动向指标
   */
  DMI: "DMI",

  /**
   * 能量指标
   */
  CR: "CR",

  /**
   * 心理线（PSY）指标是研究投资者对股市涨跌产生心理波动的情绪指标
   */
  PSY: "PSY",

  /**
   * 平行线差指标
   */
  DMA: "DMA",

  /**
   * 三重指数平滑平均线（TRIX）属于长线指标
   */
  TRIX: "TRIX",

  /**
   * 平衡交易量指标
   */
  OBV: "OBV",

  /**
   * 成交量变异率
   */
  VR: "VR",

  /**
   * 威廉超买超卖指标
   */
  WR: "WR",

  /**
   * 动量指标
   */
  MTM: "MTM",

  /**
   * 简易波动指标
   */
  EMV: "EMV",

  /**
   * 停损转向操作点指标
   */
  SAR: "SAR"
};

var Indicator = function Indicator() {
  _classCallCheck(this, Indicator);

  /**
   * 线的尺寸
   */
  this.lineSize = 1;
  this.increasingColor = colors["up-color"];
  this.decreasingColor = colors["down-color"];
  this.lineColors = [colors["mobile-icon-color"], "#F5A623", "#F601FF", "#1587DD", "#50A300"];
};

/**
 * 线的风格
 */
var LineStyle = {
  /**
   * 虚线
   */
  DASH: "dash",

  /**
   * 实线
   */
  SOLID: "solid"
};

var Axis = function Axis() {
  _classCallCheck(this, Axis);

  /**
   * 是否显示整个轴
   */
  this.display = true;
  /**
   * 整个轴的颜色
   */

  this.color = colors["sort-color"];
  /**
   * 轴线配置
   */

  this.axisLine = {
    display: false,
    color: colors["sort-color"],
    size: 1
  };
  /**
   * 分割文字配置
   */

  this.tickText = {
    display: true,
    position: YAxisTextPosition.OUTSIDE,
    color: colors["mobile-icon-color"],
    size: 10,
    margin: 4,
    valueFormatter: null
  };
  /**
   * 分割tick线配置
   */

  this.tickLine = {
    display: false,
    size: 3,
    color: colors["sort-color"]
  };
  /**
   * 分割线配置
   */

  this.separatorLine = {
    display: false,
    size: 1,
    color: colors["sort-color"],
    style: LineStyle.DASH,
    dashValue: [8, 8]
  };
};

/**
 * y轴位置
 */

var YAxisPosition = {
  /**
   * 左边
   */
  LEFT: "left",

  /**
   * 右边
   */
  RIGHT: "right"
};
/**
 * y轴上文字位置
 */

var YAxisTextPosition = {
  /**
   * 外部
   */
  OUTSIDE: "outside",

  /**
   * 内部
   */
  INSIDE: "inside"
};

var YAxis =
/*#__PURE__*/
function (_Axis) {
  _inherits(YAxis, _Axis);

  function YAxis() {
    var _this;

    _classCallCheck(this, YAxis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YAxis).call(this));
    /**
     * y轴位置
     */

    _this.yAxisPosition = YAxisPosition.RIGHT;
    /**
     * y轴最大宽度
     */

    _this.yAxisMaxWidth = 80;
    /**
     * y轴最小宽度
     */

    _this.yAxisMinWidth = 40;
    return _this;
  }
  /**
   * 是否需要留间距绘制y轴
   * @return Boolean
   */


  _createClass(YAxis, [{
    key: "needsOffset",
    value: function needsOffset() {
      return ((this.tickText.display || this.tickLine.display || this.tickText.margin > 0) && this.tickText.position === YAxisTextPosition.OUTSIDE || this.axisLine.display) && this.display;
    }
    /**
     * 获取y轴需要的宽度
     * @return number
     */

  }, {
    key: "getRequiredWidthSpace",
    value: function getRequiredWidthSpace() {
      var width = 0;

      if (this.tickText.position === YAxisTextPosition.OUTSIDE) {
        width += utils.calcTextWidth("".concat(this.tickText.size * 2, "px Arial"), "0000000") + this.tickText.margin * 2;

        if (this.display && this.tickLine.display) {
          width += this.tickLine.size * 2;
        }
      }

      if (this.display && this.axisLine.display) {
        width += this.axisLine.size;
      }

      if (width === this.axisLine.size) {
        return parseInt(width);
      }

      var maxWidth = width;

      if (maxWidth > 0) {
        maxWidth = this.yAxisMaxWidth * 2;
        width = Math.min(maxWidth, Math.max(width, this.yAxisMinWidth * 2));
      }

      return parseInt(width);
    }
  }]);

  return YAxis;
}(Axis);

var YAxisChart =
/*#__PURE__*/
function (_AxisChart) {
  _inherits(YAxisChart, _AxisChart);

  function YAxisChart(yAxis, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, YAxisChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(YAxisChart).call(this, dataBounds, viewPortHandler));
    _this.axisMaximum = 0;
    _this.axisMinimum = 0;
    _this.axisRange = 0;
    _this.yAxis = yAxis;
    return _this;
  }

  _createClass(YAxisChart, [{
    key: "drawAxisLine",
    value: function drawAxisLine(canvas) {
      if (!this.yAxis.display || !this.yAxis.axisLine.display) {
        return;
      }

      canvas.strokeStyle = this.yAxis.axisLine.color || this.yAxis.color;
      canvas.lineWidth = this.yAxis.axisLine.size;
      canvas.beginPath();

      if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
        canvas.moveTo(this.viewPortHandler.contentLeft() + 0.5, this.chartTop);
        canvas.lineTo(this.viewPortHandler.contentLeft() + 0.5, this.chartTop + this.chartHeight);
      } else {
        canvas.moveTo(this.viewPortHandler.contentRight() + 0.5, this.chartTop);
        canvas.lineTo(this.viewPortHandler.contentRight() + 0.5, this.chartTop + this.chartHeight);
      }

      canvas.stroke();
      canvas.closePath();
    }
    /**
     * 绘制y轴上文字
     * @param canvas
     */

  }, {
    key: "drawAxisLabels",
    value: function drawAxisLabels(canvas) {
      if (!this.yAxis.display || !this.yAxis.tickText.display) {
        return;
      }

      var initX;

      if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
        if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
          if (this.yAxis.display && this.yAxis.tickLine.display) {
            initX = this.viewPortHandler.contentLeft() - this.yAxis.tickLine.size * 2 - this.yAxis.tickText.margin * 2;
          } else {
            initX = this.viewPortHandler.contentLeft() - this.yAxis.tickText.margin * 2;
          }
        } else {
          if (this.yAxis.display && this.yAxis.tickLine.display) {
            initX = this.viewPortHandler.contentLeft() + this.yAxis.tickLine.size * 2 + this.yAxis.tickText.margin * 2;
          } else {
            initX = this.viewPortHandler.contentLeft() + this.yAxis.tickText.margin * 2;
          }
        }
      } else {
        if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
          if (this.yAxis.display && this.yAxis.tickLine.display) {
            initX = this.viewPortHandler.contentRight() + this.yAxis.tickLine.size * 2 + this.yAxis.tickText.margin * 2;
          } else {
            initX = this.viewPortHandler.contentRight() + this.yAxis.tickText.margin * 2;
          }
        } else {
          if (this.yAxis.display && this.yAxis.tickLine.display) {
            initX = this.viewPortHandler.contentRight() - this.yAxis.tickLine.size * 2 - this.yAxis.tickText.margin * 2;
          } else {
            initX = this.viewPortHandler.contentRight() - this.yAxis.tickText.margin * 2;
          }
        }
      }

      canvas.textBaseline = "middle";
      canvas.font = this.yAxis.tickText.size * 2 + "px Arial";
      canvas.fillStyle = this.yAxis.tickText.color || this.yAxis.color;
      var labelHeight = this.yAxis.tickText.size * 2;
      var formatter = this.yAxis.tickText.valueFormatter;

      for (var i = 0; i < this.values.length; i++) {
        var labelY = this.getValueY(this.values[i]);
        var label = this.values[i].toString();

        if (formatter) {
          label = formatter(this.values[i]) || "--";
        }

        if (this.checkShowLabel(labelY, labelHeight)) {
          if (this.yAxis.yAxisPosition === YAxisPosition.LEFT && this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE || this.yAxis.yAxisPosition === YAxisPosition.RIGHT && this.yAxis.tickText.position !== YAxisTextPosition.OUTSIDE) {
            canvas.textAlign = "right";
          } else {
            canvas.textAlign = "left";
          }

          canvas.fillText(label, initX, labelY);
        }
      }

      canvas.textAlign = "left";
    }
    /**
     * 绘制y轴分割线
     * @param canvas
     */

  }, {
    key: "drawSeparatorLines",
    value: function drawSeparatorLines(canvas) {
      if (!this.yAxis.display || !this.yAxis.separatorLine.display) {
        return;
      }

      canvas.strokeStyle = this.yAxis.separatorLine.color || this.yAxis.color;
      canvas.lineWidth = this.yAxis.separatorLine.size;
      var labelHeight = this.yAxis.tickText.size * 2;

      if (this.yAxis.separatorLine.style === LineStyle.DASH) {
        canvas.setLineDash(this.yAxis.separatorLine.dashValue);
      }

      for (var i = 0; i < this.values.length; i++) {
        var y = this.getValueY(this.values[i]);

        if (this.checkShowLabel(y, labelHeight)) {
          canvas.beginPath();
          canvas.moveTo(this.viewPortHandler.contentLeft(), y + 0.5);
          canvas.lineTo(this.viewPortHandler.contentRight(), y + 0.5);
          canvas.stroke();
          canvas.closePath();
        }
      }

      canvas.setLineDash([]);
    }
    /**
     * 绘制刻度线
     * @param canvas
     */

  }, {
    key: "drawTickLines",
    value: function drawTickLines(canvas) {
      if (!this.yAxis.display || !this.yAxis.tickLine.display) {
        return;
      }

      canvas.lineWidth = 1;
      canvas.strokeStyle = this.yAxis.axisLine.color || this.yAxis.color;
      var labelHeight = this.yAxis.tickText.size * 2;
      var startX;
      var endX;

      if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
        startX = this.viewPortHandler.contentLeft();

        if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
          endX = startX - this.yAxis.tickLine.size * 2;
        } else {
          endX = startX + this.yAxis.tickLine.size * 2;
        }
      } else {
        startX = this.viewPortHandler.contentRight();

        if (this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE) {
          endX = startX + this.yAxis.tickLine.size * 2;
        } else {
          endX = startX - this.yAxis.tickLine.size * 2;
        }
      }

      for (var i = 0; i < this.values.length; i++) {
        var y = this.getValueY(this.values[i]);

        if (this.checkShowLabel(y, labelHeight)) {
          canvas.beginPath();
          canvas.moveTo(startX, y + 0.5);
          canvas.lineTo(endX, y + 0.5);
          canvas.stroke();
          canvas.closePath();
        }
      }
    }
    /**
     * 检查是否需要真正显示label及tick线 分割线
     * @param y
     * @param labelHeight
     */

  }, {
    key: "checkShowLabel",
    value: function checkShowLabel(y, labelHeight) {
      return y > this.chartTop + labelHeight && y < this.chartTop + this.chartHeight - labelHeight;
    }
    /**
     * 计算y轴数据的最大最小值
     * @param indicatorType
     * @param isMainChart
     * @param isTimeLine
     */

  }, {
    key: "getYAxisDataMinMax",
    value: function getYAxisDataMinMax(indicatorType) {
      var isMainChart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var isTimeLine = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var dataList = this.dataBounds.dataList;
      var min = this.dataBounds.min;
      var max = Math.min(min + this.dataBounds.range, dataList.length);
      var minMaxArray = [Number.MAX_VALUE, Number.MIN_VALUE];

      if (isTimeLine) {
        for (var i = min; i < max; i++) {
          var model = dataList[i];
          minMaxArray[0] = Math.min.apply(null, [model.averagePrice, model.close, minMaxArray[0]]);
          minMaxArray[1] = Math.max.apply(null, [model.averagePrice, model.close, minMaxArray[1]]);
        }
      } else {
        for (var _i = min; _i < max; _i++) {
          var _model = dataList[_i];
          this.calcIndexMinMax(_model, indicatorType, minMaxArray);

          if (isMainChart) {
            minMaxArray[0] = Math.min(_model.low, minMaxArray[0]);
            minMaxArray[1] = Math.max(_model.high, minMaxArray[1]);
          }
        }
      }

      if (minMaxArray[0] !== Number.MAX_VALUE && minMaxArray[1] !== Number.MIN_VALUE) {
        this.axisMinimum = minMaxArray[0];
        this.axisMaximum = minMaxArray[1];
        this.computeAxis();
      }
    }
    /**
     * 计算指标值的最大最小值
     * @param model
     * @param indexType
     * @param minMaxArray
     * @returns {*}
     */

  }, {
    key: "calcIndexMinMax",
    value: function calcIndexMinMax(model, indexType, minMaxArray) {
      switch (indexType) {
        case IndicatorType.MA:
          {
            minMaxArray[0] = Math.min.apply(null, [model.ma.ma5, model.ma.ma10, model.ma.ma20, model.ma.ma60, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.ma.ma5, model.ma.ma10, model.ma.ma20, model.ma.ma60, minMaxArray[1]]);
            break;
          }

        case IndicatorType.MACD:
          {
            minMaxArray[0] = Math.min.apply(null, [model.macd.dea, model.macd.diff, model.macd.macd, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.macd.dea, model.macd.diff, model.macd.macd, minMaxArray[1]]);
            break;
          }

        case IndicatorType.VOL:
          {
            minMaxArray[0] = Math.min.apply(null, [model.volume, 0]);
            minMaxArray[1] = Math.max.apply(null, [model.volume, minMaxArray[1]]);
            break;
          }

        case IndicatorType.BOLL:
          {
            minMaxArray[0] = Math.min.apply(null, [model.boll.up, model.boll.mid, model.boll.dn, model.low, minMaxArray[0]]);
            minMaxArray[0] = Math.max.apply(null, [model.boll.up, model.boll.mid, model.boll.dn, model.high, minMaxArray[1]]);
            break;
          }

        case IndicatorType.BIAS:
          {
            minMaxArray[0] = Math.min.apply(null, [model.bias.bias1, model.bias.bias2, model.bias.bias3, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.bias.bias1, model.bias.bias2, model.bias.bias3, minMaxArray[1]]);
            break;
          }

        case IndicatorType.BRAR:
          {
            minMaxArray[0] = Math.min.apply(null, [model.brar.br, model.brar.ar, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.brar.br, model.brar.ar, minMaxArray[1]]);
            break;
          }

        case IndicatorType.CCI:
          {
            minMaxArray[0] = Math.min(model.cci.cci, minMaxArray[0]);
            minMaxArray[1] = Math.max(model.cci.cci, minMaxArray[1]);
            break;
          }

        case IndicatorType.CR:
          {
            minMaxArray[0] = Math.min.apply(null, [model.cr.cr, model.cr.ma1, model.cr.ma2, model.cr.ma3, model.cr.ma4, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.cr.cr, model.cr.ma1, model.cr.ma2, model.cr.ma3, model.cr.ma4, minMaxArray[1]]);
            break;
          }

        case IndicatorType.DMA:
          {
            minMaxArray[0] = Math.min.apply(null, [model.dma.dif, model.dma.difMa, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.dma.dif, model.dma.difMa, minMaxArray[1]]);
            break;
          }

        case IndicatorType.DMI:
          {
            minMaxArray[0] = Math.min.apply(null, [model.dmi.pdi, model.dmi.mdi, model.dmi.adx, model.dmi.adxr, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.dmi.pdi, model.dmi.mdi, model.dmi.adx, model.dmi.adxr, minMaxArray[1]]);
            break;
          }

        case IndicatorType.KDJ:
          {
            minMaxArray[0] = Math.min.apply(null, [model.kdj.k, model.kdj.d, model.kdj.j, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.kdj.k, model.kdj.d, model.kdj.j, minMaxArray[1]]);
            break;
          }

        case IndicatorType.KD:
          {
            minMaxArray[0] = Math.min.apply(null, [model.kdj.k, model.kdj.d, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.kdj.k, model.kdj.d, minMaxArray[1]]);
            break;
          }

        case IndicatorType.RSI:
          {
            minMaxArray[0] = Math.min.apply(null, [model.rsi.rsi1, model.rsi.rsi2, model.rsi.rsi3, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.rsi.rsi1, model.rsi.rsi2, model.rsi.rsi3, minMaxArray[1]]);
            break;
          }

        case IndicatorType.PSY:
          {
            minMaxArray[0] = Math.min(model.psy.psy, minMaxArray[0]);
            minMaxArray[1] = Math.max(model.psy.psy, minMaxArray[1]);
            break;
          }

        case IndicatorType.TRIX:
          {
            minMaxArray[0] = Math.min.apply(null, [model.trix.trix, model.trix.maTrix, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.trix.trix, model.trix.maTrix, minMaxArray[1]]);
            break;
          }

        case IndicatorType.OBV:
          {
            minMaxArray[0] = Math.min.apply(null, [model.obv.obv, model.obv.maObv, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.obv.obv, model.obv.maObv, minMaxArray[1]]);
            break;
          }

        case IndicatorType.VR:
          {
            minMaxArray[0] = Math.min.apply(null, [model.vr.vr, model.vr.maVr, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.vr.vr, model.vr.maVr, minMaxArray[1]]);
            break;
          }

        case IndicatorType.WR:
          {
            minMaxArray[0] = Math.min.apply(null, [model.wr.wr1, model.wr.wr2, model.wr.wr3, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.wr.wr1, model.wr.wr2, model.wr.wr3, minMaxArray[1]]);
            break;
          }

        case IndicatorType.MTM:
          {
            minMaxArray[0] = Math.min.apply(null, [model.mtm.mtm, model.mtm.mtmMa, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.mtm.mtm, model.mtm.mtmMa, minMaxArray[1]]);
            break;
          }

        case IndicatorType.EMV:
          {
            minMaxArray[0] = Math.min.apply(null, [model.emv.emv, model.emv.maEmv, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.emv.emv, model.emv.maEmv, minMaxArray[1]]);
            break;
          }

        case IndicatorType.SAR:
          {
            minMaxArray[0] = Math.min.apply(null, [model.sar.sar, model.low, minMaxArray[0]]);
            minMaxArray[1] = Math.max.apply(null, [model.sar.sar, model.high, minMaxArray[1]]);
            break;
          }
      }

      return minMaxArray;
    }
  }, {
    key: "computeAxis",
    value: function computeAxis() {
      var min = this.axisMinimum;
      var max = this.axisMaximum;
      var range = Math.abs(max - min);

      if (range === 0) {
        max += 1;
        min -= 1;
        range = Math.abs(max - min);
      }

      this.axisMinimum = min - range / 100 * 10;
      this.axisMaximum = max + range / 100 * 20;
      this.axisRange = Math.abs(this.axisMaximum - this.axisMinimum);
      this.computeAxisValues(this.axisMinimum, this.axisMaximum);
    }
    /**
     * 获取y点坐标
     * @param yValue Float
     * @return number
     */

  }, {
    key: "getValueY",
    value: function getValueY(yValue) {
      return this.getY(yValue, this.axisMinimum, this.axisRange);
    }
  }]);

  return YAxisChart;
}(AxisChart);

var IndicatorChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(IndicatorChart, _Chart);

  function IndicatorChart(indicator, xAxis, yAxis, dataBounds, viewPortHandler) {
    var _this;

    var indicatorType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : IndicatorType.MACD;

    _classCallCheck(this, IndicatorChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IndicatorChart).call(this, dataBounds, viewPortHandler));
    _this.indicator = indicator;
    _this.xAxis = xAxis;
    _this.yAxisChart = new YAxisChart(yAxis, dataBounds, viewPortHandler);
    _this.indicatorType = indicatorType;
    return _this;
  }

  _createClass(IndicatorChart, [{
    key: "setChartDimens",
    value: function setChartDimens(height, top) {
      _get(_getPrototypeOf(IndicatorChart.prototype), "setChartDimens", this).call(this, height, top);

      this.yAxisChart.setChartDimens(height, top);
    }
  }, {
    key: "draw",
    value: function draw(canvas) {
      if (this.isDisplayChart()) {
        this.drawChartHorizontalSeparatorLine(canvas);
        this.yAxisChart.getYAxisDataMinMax(this.indicatorType);
        this.yAxisChart.drawSeparatorLines(canvas);
        this.yAxisChart.drawTickLines(canvas);
        this.drawIndicator(canvas);
        this.yAxisChart.drawAxisLine(canvas);
        this.yAxisChart.drawAxisLabels(canvas);
      }
    }
    /**
     * 绘制各图之间分割线
     * @param canvas
     */

  }, {
    key: "drawChartHorizontalSeparatorLine",
    value: function drawChartHorizontalSeparatorLine(canvas) {
      canvas.strokeStyle = this.xAxis.axisLine.color || this.xAxis.color;
      canvas.lineWidth = this.xAxis.axisLine.size;
      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentLeft(), this.chartTop + 0.5);
      canvas.lineTo(this.viewPortHandler.contentRight(), this.chartTop + 0.5);
      canvas.stroke();
      canvas.closePath();
    }
    /**
     * 绘制指标
     * @param canvas
     * @param isMainIndicator
     */

  }, {
    key: "drawIndicator",
    value: function drawIndicator(canvas) {
      var _this2 = this;

      var isMainIndicator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      switch (this.indicatorType) {
        case IndicatorType.MA:
          {
            this.drawLines(canvas, "ma", ["ma5", "ma10", "ma20", "ma60"]);
            break;
          }

        case IndicatorType.MACD:
          {
            this.drawBarLines(canvas, "macd", function (kLineModel, preKLineModel, barBuffer) {
              var macd = (kLineModel.macd || {}).macd;
              var preMacd = ((preKLineModel || {}).macd || {}).macd;

              if (macd > 0) {
                canvas.strokeStyle = _this2.indicator.increasingColor;
                canvas.fillStyle = _this2.indicator.increasingColor;
              } else {
                canvas.strokeStyle = _this2.indicator.decreasingColor;
                canvas.fillStyle = _this2.indicator.decreasingColor;
              }

              if ((preMacd || preMacd === 0) && macd > preMacd) {
                canvas.strokeRect(barBuffer[0], barBuffer[1], barBuffer[2] - barBuffer[0], barBuffer[3] - barBuffer[1]);
              } else {
                canvas.fillRect(barBuffer[0], barBuffer[1], barBuffer[2] - barBuffer[0], barBuffer[3] - barBuffer[1]);
              }
            });
            break;
          }

        case IndicatorType.VOL:
          {
            this.drawBarLines(canvas, "volume", function (kLineModel, preKLineModel, barBuffer) {
              var close = kLineModel.close;
              var preClose = (preKLineModel || {}).close;

              if ((preClose || preClose === 0) && close > preClose) {
                canvas.fillStyle = _this2.indicator.increasingColor;
              } else {
                canvas.fillStyle = _this2.indicator.decreasingColor;
              }

              canvas.fillRect(barBuffer[0], barBuffer[1], barBuffer[2] - barBuffer[0], barBuffer[3] - barBuffer[1]);
            });
            break;
          }

        case IndicatorType.BOLL:
          {
            this.drawLines(canvas, "boll", ["up", "mid", "dn"], function (x, kLineModel) {
              var halfSpace = _this2.dataBounds.dataSpace * (1 - _this2.dataBounds.dataMarginSpaceRate) / 2;

              _this2.drawOhlc(canvas, halfSpace, x, kLineModel, isMainIndicator);
            });
            break;
          }

        case IndicatorType.BIAS:
          {
            this.drawLines(canvas, "bias", ["bias1", "bias2", "bias3"]);
            break;
          }

        case IndicatorType.BRAR:
          {
            this.drawLines(canvas, "brar", ["br", "ar"]);
            break;
          }

        case IndicatorType.CCI:
          {
            this.drawLines(canvas, "cci", ["cci"]);
            break;
          }

        case IndicatorType.CR:
          {
            this.drawLines(canvas, "cr", ["cr", "ma1", "ma2", "ma3", "ma4"]);
            break;
          }

        case IndicatorType.DMA:
          {
            this.drawLines(canvas, "dma", ["dif", "difMa"]);
            break;
          }

        case IndicatorType.DMI:
          {
            this.drawLines(canvas, "dmi", ["mdi", "pdi", "adx", "adxr"]);
            break;
          }

        case IndicatorType.KDJ:
          {
            this.drawLines(canvas, "kdj", ["k", "d", "j"]);
            break;
          }

        case IndicatorType.KD:
          {
            this.drawLines(canvas, "kdj", ["k", "d"]);
            break;
          }

        case IndicatorType.RSI:
          {
            this.drawLines(canvas, "rsi", ["rsi1", "rsi2", "rsi3"]);
            break;
          }

        case IndicatorType.PSY:
          {
            this.drawLines(canvas, "psy", ["psy"]);
            break;
          }

        case IndicatorType.TRIX:
          {
            this.drawLines(canvas, "trix", ["trix", "maTrix"]);
            break;
          }

        case IndicatorType.OBV:
          {
            this.drawLines(canvas, "obv", ["obv", "maObv"]);
            break;
          }

        case IndicatorType.VR:
          {
            this.drawLines(canvas, "vr", ["vr", "maVr"]);
            break;
          }

        case IndicatorType.WR:
          {
            this.drawLines(canvas, "wr", ["wr1", "wr2", "wr3"]);
            break;
          }

        case IndicatorType.MTM:
          {
            this.drawLines(canvas, "mtm", ["mtm", "mtmMa"]);
            break;
          }

        case IndicatorType.EMV:
          {
            this.drawLines(canvas, "emv", ["emv", "maEmv"]);
            break;
          }

        case IndicatorType.SAR:
          {
            this.drawSar(canvas, isMainIndicator);
          }
      }
    }
    /**
     * 绘制Sar
     * @param canvas
     * @param isMainIndicator
     */

  }, {
    key: "drawSar",
    value: function drawSar(canvas, isMainIndicator) {
      canvas.save();
      canvas.beginPath();
      canvas.rect(this.viewPortHandler.contentLeft(), this.chartTop, this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom() - this.chartTop);
      canvas.closePath();
      canvas.clip();
      canvas.lineWidth = 1;
      var startX = this.viewPortHandler.contentLeft();
      var dataSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate);
      var halfBarSpace = dataSpace / 2;
      var i = this.dataBounds.min;

      while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
        var endX = startX + dataSpace;
        var x = (startX + endX) / 2;
        var kLineModel = this.dataBounds.dataList[i];
        this.drawOhlc(canvas, halfBarSpace, x, kLineModel, isMainIndicator);
        var data = kLineModel.sar;
        var sar = data.sar;

        if (sar || sar === 0) {
          var dataY = this.getValueY(sar);

          if (sar < (kLineModel.high + kLineModel.low) / 2) {
            canvas.strokeStyle = this.indicator.increasingColor;
          } else {
            canvas.strokeStyle = this.indicator.decreasingColor;
          }

          canvas.beginPath();
          canvas.arc(x, dataY, halfBarSpace, Math.PI * 2, 0, true);
          canvas.stroke();
          canvas.closePath();
        }

        startX += this.dataBounds.dataSpace;
        ++i;
      }

      canvas.restore();
    }
    /**
     * 绘制有柱状图有线的指标
     * @param canvas
     * @param dataKey
     * @param barDataKey
     * @param lineDataKeys
     * @param drawRect
     */

  }, {
    key: "drawBarLines",
    value: function drawBarLines(canvas, dataKey, drawRect) {
      var startX = this.viewPortHandler.contentLeft();
      var dataSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate);
      var halfBarSpace = dataSpace / 2;
      var i = this.dataBounds.min;
      var barBuffer = [];
      var lineValues = [];

      while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
        var endX = startX + dataSpace;
        var x = (startX + endX) / 2;
        var kLineModel = this.dataBounds.dataList[i];
        var preKLineModel = void 0;

        if (i > 0) {
          preKLineModel = this.dataBounds.dataList[i - 1];
        }

        var barData = kLineModel[dataKey];

        if (barData || barData === 0) {
          barBuffer[0] = x - halfBarSpace;
          barBuffer[2] = x + halfBarSpace;
          var dataY = this.getValueY(barData);
          var zeroY = this.getValueY(0);
          barBuffer[1] = dataY;
          barBuffer[3] = zeroY;
          drawRect(kLineModel, preKLineModel, barBuffer);
        }

        startX += this.dataBounds.dataSpace;
        ++i;
      }

      this.drawLine(canvas, lineValues);
    }
    /**
     * 绘制只有线的指标
     * @param canvas
     * @param dataKey
     * @param lineDataKeys
     * @param draw
     */

  }, {
    key: "drawLines",
    value: function drawLines(canvas, dataKey, lineDataKeys, draw) {
      var startX = this.viewPortHandler.contentLeft();
      var i = this.dataBounds.min;
      var dataSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate);
      var lineValues = [];

      while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
        var endX = startX + dataSpace;
        var x = (startX + endX) / 2;
        var kLineModel = this.dataBounds.dataList[i];

        if (draw) {
          draw(x, kLineModel);
        }

        var data = kLineModel[dataKey];

        for (var j = 0; j < lineDataKeys.length; j++) {
          var value = data[lineDataKeys[j]];
          var valueY = this.getValueY(value);

          if (!lineValues[j]) {
            lineValues[j] = [{
              x: x,
              y: valueY
            }];
          } else {
            lineValues[j].push({
              x: x,
              y: valueY
            });
          }
        }

        startX += this.dataBounds.dataSpace;
        ++i;
      }

      this.drawLine(canvas, lineValues);
    }
    /**
     * 绘制线
     * @param canvas
     * @param lineValues
     */

  }, {
    key: "drawLine",
    value: function drawLine(canvas, lineValues) {
      for (var i = 0; i < lineValues.length; i++) {
        var values = lineValues[i];

        if (values.length > 0) {
          canvas.strokeStyle = this.indicator.lineColors[i];
          canvas.beginPath();
          canvas.moveTo(values[0].x, values[0].y);

          for (var j = 1; j < values.length; j++) {
            canvas.lineTo(values[j].x, values[j].y);
          }

          canvas.stroke();
          canvas.closePath();
        }
      }
    }
    /**
     * 绘制指标图里面的开低高收价
     */

  }, {
    key: "drawOhlc",
    value: function drawOhlc(canvas, halfBarSpace, x, kLineModel, isMainIndicator) {
      if (!isMainIndicator) {
        var openY = this.getValueY(kLineModel.open);
        var closeY = this.getValueY(kLineModel.close);
        var highY = this.getValueY(kLineModel.high);
        var lowY = this.getValueY(kLineModel.low);

        if (kLineModel.close > kLineModel.open) {
          canvas.strokeStyle = this.indicator.increasingColor;
        } else {
          canvas.strokeStyle = this.indicator.decreasingColor;
        }

        this.drawOhlcLines(canvas, halfBarSpace, x, openY, closeY, highY, lowY);
      }
    }
    /**
     * 绘制ohlc线
     * @param canvas
     * @param halfBarSpace
     * @param x
     * @param openY
     * @param closeY
     * @param highY
     * @param lowY
     */

  }, {
    key: "drawOhlcLines",
    value: function drawOhlcLines(canvas, halfBarSpace, x, openY, closeY, highY, lowY) {
      canvas.beginPath();
      canvas.moveTo(x, highY);
      canvas.lineTo(x, lowY);
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(x - halfBarSpace, openY + 0.5);
      canvas.lineTo(x, openY + 0.5);
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(x + halfBarSpace, closeY + 0.5);
      canvas.lineTo(x, closeY + 0.5);
      canvas.stroke();
      canvas.closePath();
    }
    /**
     * 获取y点坐标
     * @param yValue Float
     */

  }, {
    key: "getValueY",
    value: function getValueY(yValue) {
      return this.getY(yValue, this.yAxisChart.axisMinimum, this.yAxisChart.axisRange);
    }
    /**
     * 是否显示图
     * @returns {boolean}
     */

  }, {
    key: "isDisplayChart",
    value: function isDisplayChart() {
      return this.indicatorType !== IndicatorType.NO;
    }
  }]);

  return IndicatorChart;
}(Chart);

/**
 * 蜡烛图样式
 */

var CandleStyle = {
  /**
   * 全实心
   */
  SOLID: "solid",

  /**
   * 全空心
   */
  STROKE: "stroke",

  /**
   * 涨空心
   */
  INCREASING_STROKE: "increasing_stroke",

  /**
   * 跌空心
   */
  DECREASING_STROKE: "decreasing_stroke",

  /**
   * 美国线
   */
  OHLC: "ohlc"
};
/**
 * 图表类型
 */

var ChartStyle = {
  /**
   * 蜡烛图
   */
  CANDLE: "candle",

  /**
   * 分时线
   */
  TIME_LINE: "time_line"
};

var Candle = function Candle() {
  _classCallCheck(this, Candle);

  /**
   * 图类型
   */
  this.chartStyle = ChartStyle.CANDLE;
  /**
   * 分时图配置
   */

  this.timeChart = {
    /**
     * 分时线尺寸
     */
    timeLineSize: 1,

    /**
     * 分时线颜色
     */
    timeLineColor: "#D8D8D8",

    /**
     * 分时线填充色
     */
    timeLineFillColor: "#f4f4f4",

    /**
     * 分时均线颜色
     */
    timeAverageLineColor: "#F5A623"
  };
  /**
   * 蜡烛图配置
   */

  this.candleChart = {
    /**
     * 蜡烛图样式
     */
    candleStyle: CandleStyle.SOLID,

    /**
     * 上涨颜色
     */
    increasingColor: colors["up-color"],

    /**
     * 下跌颜色
     */
    decreasingColor: colors["down-color"]
  };
  /**
   * 最低最高价格标记文字颜色
   */

  this.lowestHighestPriceMarkTextColor = colors["mobile-icon-color"];
  /**
   * 最低最高价格标记文字大小
   */

  this.lowestHighestPriceMarkTextSize = 10;
  /**
   * 最高最低价格标记值格式化
   */

  this.lowestHighestValueFormatter = null;
  /**
   * 最大价格标记参数
   */

  this.highestPriceMark = {
    display: true,
    color: colors["mobile-icon-color"],
    textSize: 10,
    valueFormatter: null
  };
  /**
   * 最小价格标记参数
   */

  this.lowestPriceMark = {
    display: true,
    color: colors["mobile-icon-color"],
    textSize: 10,
    valueFormatter: null
  };
  /**
   * 最新价标记参数
   */

  this.lastPriceMark = {
    display: true,
    lineStyle: LineStyle.DASH,
    dashValue: [8, 8],
    lineSize: 1,
    lineColor: colors["mobile-icon-color"]
  };
};

var CandleChart =
/*#__PURE__*/
function (_IndicatorChart) {
  _inherits(CandleChart, _IndicatorChart);

  function CandleChart(candle, indicator, yAxis, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, CandleChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CandleChart).call(this, indicator, null, yAxis, dataBounds, viewPortHandler));
    _this.candle = candle;
    _this.indicatorType = IndicatorType.NO; // 最高价标记数据

    _this.highestMarkData = {}; // 最低价标记数据

    _this.lowestMarkData = {};
    return _this;
  }
  /**
   * 绘制
   * @param canvas
   */


  _createClass(CandleChart, [{
    key: "draw",
    value: function draw(canvas) {
      var isTimeLineChart = this.candle.chartStyle === ChartStyle.TIME_LINE;
      this.yAxisChart.getYAxisDataMinMax(this.indicatorType, true, isTimeLineChart);
      this.yAxisChart.drawSeparatorLines(canvas);
      this.yAxisChart.drawTickLines(canvas);

      if (!isTimeLineChart) {
        this.drawCandle(canvas);
        this.drawIndicator(canvas, true);
        this.drawHighestPriceMark(canvas);
        this.drawLowestPriceMark(canvas);
      } else {
        this.drawTimeLine(canvas);
      }

      this.drawLastPriceMark(canvas);
      this.yAxisChart.drawAxisLine(canvas);
      this.yAxisChart.drawAxisLabels(canvas);
    }
    /**
     * 绘制蜡烛图
     * @param canvas
     */

  }, {
    key: "drawCandle",
    value: function drawCandle(canvas) {
      canvas.lineWidth = 1;
      var kLineDataList = this.dataBounds.dataList;
      var startX = this.viewPortHandler.contentLeft();
      var i = this.dataBounds.min;
      var candleSpace = this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate);
      var halfSpace = candleSpace / 2;
      var rect = [];
      var markHighestPrice = Number.MIN_VALUE;
      var markHighestPriceX = -1;
      var markLowestPrice = Number.MAX_VALUE;
      var markLowestPriceX = -1;

      while (i < kLineDataList.length && i < this.dataBounds.min + this.dataBounds.range) {
        var endX = startX + candleSpace;
        var x = (startX + endX) / 2;
        var model = kLineDataList[i];
        var high = model.high;
        var low = model.low;

        if (markHighestPrice < high) {
          markHighestPrice = high;
          markHighestPriceX = x;
        }

        if (low < markLowestPrice) {
          markLowestPrice = low;
          markLowestPriceX = x;
        }

        var openY = this.getValueY(model.open);
        var closeY = this.getValueY(model.close);
        var highY = this.getValueY(high);
        var lowY = this.getValueY(low);

        if (model.close > model.open) {
          canvas.strokeStyle = this.candle.candleChart.increasingColor;
          canvas.fillStyle = this.candle.candleChart.increasingColor;
        } else {
          canvas.strokeStyle = this.candle.candleChart.decreasingColor;
          canvas.fillStyle = this.candle.candleChart.decreasingColor;
        }

        if (this.candle.candleChart.candleStyle !== CandleStyle.OHLC) {
          var highLine = [];
          var lowLine = [];

          if (openY > closeY) {
            highLine[0] = highY;
            highLine[1] = closeY;
            lowLine[0] = openY;
            lowLine[1] = lowY;
            rect = [startX, closeY, endX - startX, openY - closeY];
          } else if (openY < closeY) {
            highLine[0] = highY;
            highLine[1] = openY;
            lowLine[0] = closeY;
            lowLine[1] = lowY;
            rect = [startX, openY, endX - startX, closeY - openY];
          } else {
            highLine[0] = highY;
            highLine[1] = openY;
            lowLine[0] = closeY;
            lowLine[1] = lowY;
            rect = [startX, openY, endX - startX, 1];
          }

          canvas.beginPath();
          canvas.moveTo(x, highLine[0]);
          canvas.lineTo(x, highLine[1]);
          canvas.stroke();
          canvas.closePath();
          canvas.beginPath();
          canvas.moveTo(x, lowLine[0]);
          canvas.lineTo(x, lowLine[1]);
          canvas.stroke();
          canvas.closePath();

          switch (this.candle.candleChart.candleStyle) {
            case CandleStyle.SOLID:
              {
                canvas.fillRect(rect[0], rect[1], rect[2], rect[3]);
                break;
              }

            case CandleStyle.STROKE:
              {
                canvas.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                break;
              }

            case CandleStyle.INCREASING_STROKE:
              {
                if (model.close > model.open) {
                  canvas.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                } else {
                  canvas.fillRect(rect[0], rect[1], rect[2], rect[3]);
                }

                break;
              }

            case CandleStyle.DECREASING_STROKE:
              {
                if (model.close > model.open) {
                  canvas.fillRect(rect[0], rect[1], rect[2], rect[3]);
                } else {
                  canvas.strokeRect(rect[0], rect[1], rect[2], rect[3]);
                }

                break;
              }
          }
        } else {
          this.drawOhlcLines(canvas, halfSpace, x, openY, closeY, highY, lowY);
        }

        startX += this.dataBounds.dataSpace;
        ++i;
      }

      this.highestMarkData = {
        x: markHighestPriceX,
        price: markHighestPrice
      };
      this.lowestMarkData = {
        x: markLowestPriceX,
        price: markLowestPrice
      };
    }
    /**
     * 绘制最高价标记
     * @param canvas
     */

  }, {
    key: "drawHighestPriceMark",
    value: function drawHighestPriceMark(canvas) {
      var price = this.highestMarkData.price;

      if (price === Number.MIN_VALUE || !this.candle.highestPriceMark.display) {
        return;
      }

      var color = this.candle.highestPriceMark.color || this.candle.lowestHighestPriceMarkTextColor;
      var textSize = this.candle.highestPriceMark.textSize || this.candle.lowestHighestPriceMarkTextSize;
      var valueFormatter = this.candle.highestPriceMark.valueFormatter || this.candle.lowestHighestValueFormatter;
      this.drawLowestHighestPriceMark(canvas, this.highestMarkData.x, price, color, textSize, valueFormatter, true);
    }
    /**
     * 绘制最低价标记
     * @param canvas
     */

  }, {
    key: "drawLowestPriceMark",
    value: function drawLowestPriceMark(canvas) {
      var price = this.lowestMarkData.price;

      if (price === Number.MAX_VALUE || !this.candle.lowestPriceMark.display) {
        return;
      }

      var color = this.candle.lowestPriceMark.color || this.candle.lowestHighestPriceMarkTextColor;
      var textSize = this.candle.lowestPriceMark.textSize || this.candle.lowestHighestPriceMarkTextSize;
      var valueFormatter = this.candle.lowestPriceMark.valueFormatter || this.candle.lowestHighestValueFormatter;
      this.drawLowestHighestPriceMark(canvas, this.lowestMarkData.x, price, color, textSize, valueFormatter);
    }
    /**
     * 绘制最高最低价格标记
     * @param canvas
     * @param x
     * @param price
     * @param color
     * @param textSize
     * @param valueFormatter
     * @param isHigh
     */

  }, {
    key: "drawLowestHighestPriceMark",
    value: function drawLowestHighestPriceMark(canvas, x, price, color, textSize, valueFormatter) {
      var isHigh = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      canvas.save();
      canvas.beginPath();
      canvas.rect(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentTop(), this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(), this.chartTop + this.chartHeight);
      canvas.closePath();
      canvas.clip();
      var priceY = this.getValueY(price);
      var startX = x;
      var startY = priceY + (isHigh ? -4 : 4) + 0.5;
      canvas.textAlign = "left";
      canvas.lineWidth = 1;
      canvas.strokeStyle = color;
      canvas.fillStyle = color;
      canvas.beginPath();
      canvas.moveTo(startX + 0.5, startY + 0.5);
      canvas.lineTo(startX - 4 + 0.5, startY + (isHigh ? -4 : 4) + 0.5);
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(startX + 0.5, startY + 0.5);
      canvas.lineTo(startX + 4 + 0.5, startY + (isHigh ? -4 : 4) + 0.5);
      canvas.stroke();
      canvas.closePath(); // 绘制竖线

      canvas.beginPath();
      canvas.moveTo(startX + 0.5, startY);
      startY = startY + (isHigh ? -10 : 10);
      canvas.lineTo(startX + 0.5, startY);
      canvas.stroke();
      canvas.closePath();
      canvas.beginPath();
      canvas.moveTo(startX, startY + 0.5);
      canvas.lineTo(startX + 10, startY + 0.5);
      canvas.stroke();
      canvas.closePath();
      canvas.font = textSize * 2 + "px Arial";
      var value = price.toFixed(2);

      if (valueFormatter) {
        value = valueFormatter(price) + "";
      }

      canvas.textBaseline = "middle";
      canvas.fillText(value, startX + 14, startY);
      canvas.restore();
    }
    /**
     * 绘制最新价标记
     * @param canvas
     */

  }, {
    key: "drawLastPriceMark",
    value: function drawLastPriceMark(canvas) {
      if (!this.candle.lastPriceMark.display || this.dataBounds.dataList.length === 0) {
        return;
      }

      var lastPrice = this.dataBounds.dataList[this.dataBounds.dataList.length - 1].close;
      var priceY = this.getValueY(lastPrice);
      priceY = +Math.max(this.chartTop + this.chartHeight * 0.05, Math.min(priceY, this.chartTop + this.chartHeight * 0.98)).toFixed(0);
      canvas.strokeStyle = this.candle.lastPriceMark.lineColor;
      canvas.lineWidth = this.candle.lastPriceMark.lineSize;

      if (this.candle.lastPriceMark.lineStyle === LineStyle.DASH) {
        canvas.setLineDash(this.candle.lastPriceMark.dashValue);
      }

      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentLeft(), priceY + 0.5);
      canvas.lineTo(this.viewPortHandler.contentRight(), priceY + 0.5);
      canvas.stroke();
      canvas.closePath();
      canvas.setLineDash([]);
    }
    /**
     * 绘制分时线
     * @param canvas
     */

  }, {
    key: "drawTimeLine",
    value: function drawTimeLine(canvas) {
      var timeLinePoints = [];
      var timeLineAreaPoints = [{
        x: this.viewPortHandler.contentLeft(),
        y: this.chartTop + this.chartHeight
      }];
      var averageLinePoints = [];
      canvas.lineWidth = this.candle.timeChart.timeLineSize;
      var kLineDataList = this.dataBounds.dataList;
      var startX = this.viewPortHandler.contentLeft();
      var i = this.dataBounds.min;
      var dataSpace = this.dataBounds.dataSpace - this.dataBounds.dataMarginSpaceRate * this.dataBounds.dataSpace;

      while (i < this.dataBounds.dataList.length && i < this.dataBounds.min + this.dataBounds.range) {
        var endX = startX + dataSpace;
        var x = +((startX + endX) / 2).toFixed(0);
        var model = kLineDataList[i];
        var closeY = this.getValueY(model.close);
        var averagePriceY = this.getValueY(model.averagePrice);
        timeLinePoints.push({
          x: x,
          y: closeY
        });

        if (model.averagePrice) {
          averageLinePoints.push({
            x: x,
            y: averagePriceY
          });
        }

        if (i === this.dataBounds.min) {
          timeLineAreaPoints.push({
            x: this.viewPortHandler.contentLeft(),
            y: closeY
          });
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
        } else if (i === this.dataBounds.min + this.dataBounds.range - 1) {
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
          timeLineAreaPoints.push({
            x: this.viewPortHandler.contentRight(),
            y: closeY
          });
          timeLineAreaPoints.push({
            x: this.viewPortHandler.contentRight(),
            y: this.chartHeight + this.chartTop
          });
        } else if (i === this.dataBounds.dataList.length - 1) {
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
          timeLineAreaPoints.push({
            x: x,
            y: this.chartTop + this.chartHeight
          });
        } else {
          timeLineAreaPoints.push({
            x: x,
            y: closeY
          });
        }

        startX += this.dataBounds.dataSpace;
        ++i;
      }

      if (timeLinePoints.length > 0) {
        // 绘制分时线
        canvas.strokeStyle = this.candle.timeChart.timeLineColor;
        canvas.beginPath();
        canvas.moveTo(timeLinePoints[0].x, timeLinePoints[0].y);

        for (var _i = 1; _i < timeLinePoints.length; _i++) {
          canvas.lineTo(timeLinePoints[_i].x, timeLinePoints[_i].y);
        }

        canvas.stroke();
        canvas.closePath();
      }

      if (timeLineAreaPoints.length > 0) {
        // 绘制分时线填充区域
        canvas.fillStyle = this.candle.timeChart.timeLineFillColor;
        canvas.beginPath();
        canvas.moveTo(timeLineAreaPoints[0].x, timeLineAreaPoints[0].y);

        for (var _i2 = 1; _i2 < timeLineAreaPoints.length; _i2++) {
          canvas.lineTo(timeLineAreaPoints[_i2].x, timeLineAreaPoints[_i2].y);
        }

        canvas.closePath();
        canvas.fill();
      }

      if (averageLinePoints.length > 0) {
        // 绘制均线
        canvas.strokeStyle = this.candle.timeChart.timeAverageLineColor;
        canvas.beginPath();
        canvas.moveTo(averageLinePoints[0].x, averageLinePoints[0].y);

        for (var _i3 = 1; _i3 < averageLinePoints.length; _i3++) {
          canvas.lineTo(averageLinePoints[_i3].x, averageLinePoints[_i3].y);
        }

        canvas.stroke();
        canvas.closePath();
      }
    }
  }]);

  return CandleChart;
}(IndicatorChart);

var XAxisChart =
/*#__PURE__*/
function (_AxisChart) {
  _inherits(XAxisChart, _AxisChart);

  function XAxisChart(xAxis, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, XAxisChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XAxisChart).call(this, dataBounds, viewPortHandler));
    _this.xAxis = xAxis;
    return _this;
  }
  /**
   * 绘制
   * @param canvas
   */


  _createClass(XAxisChart, [{
    key: "draw",
    value: function draw(canvas) {
      this.computeAxis();
      this.drawAxisLine(canvas);
      this.drawTickLines(canvas);
      this.drawAxisLabels(canvas);
      this.drawSeparatorLines(canvas);
    }
    /**
     * 绘制轴线
     * @param canvas
     */

  }, {
    key: "drawAxisLine",
    value: function drawAxisLine(canvas) {
      if (!this.xAxis.display || !this.xAxis.axisLine.display) {
        return;
      }

      canvas.strokeStyle = this.xAxis.axisLine.color || this.xAxis.color;
      canvas.lineWidth = this.xAxis.axisLine.size;
      canvas.beginPath();
      canvas.moveTo(this.viewPortHandler.contentLeft(), this.viewPortHandler.contentBottom() + 0.5);
      canvas.lineTo(this.viewPortHandler.contentRight(), this.viewPortHandler.contentBottom() + 0.5);
      canvas.stroke();
      canvas.closePath();
    }
    /**
     * 绘制坐标轴上的文字
     * @param canvas Canvas
     */

  }, {
    key: "drawAxisLabels",
    value: function drawAxisLabels(canvas) {
      var chartHeight = canvas.canvas.offsetHeight * 2;

      if (!this.xAxis.display || !this.xAxis.tickText.display) {
        return;
      }

      canvas.textBaseline = "top";
      canvas.font = this.xAxis.tickText.size * 2 + "px Arial";
      canvas.textAlign = "center";
      canvas.fillStyle = this.xAxis.tickText.color || this.xAxis.color;
      var positions = this.pointValuesToPixel();
      var startY = this.viewPortHandler.contentBottom() + this.xAxis.tickText.margin * 2;

      if (this.display && this.xAxis.tickLine.display) {
        startY += this.xAxis.tickLine.size * 2;
      }

      var formatter = this.xAxis.tickText.valueFormatter;

      for (var i = 0; i < positions.length; i += 2) {
        var x = positions[i];

        if (this.viewPortHandler.isInBoundsX(x)) {
          var kLineModel = this.dataBounds.dataList[parseInt(this.values[i / 2])];
          var timestamp = kLineModel.timestamp;
          var label = utils.formatDate(timestamp);

          if (formatter) {
            label = formatter(kLineModel);
          }

          canvas.fillText(label, x, startY);
        }
      }
    }
    /**
     * 绘制分割线
     * @param canvas Canvas
     */

  }, {
    key: "drawSeparatorLines",
    value: function drawSeparatorLines(canvas) {
      if (!this.xAxis.display || !this.xAxis.separatorLine.display) {
        return;
      }

      canvas.strokeStyle = this.xAxis.separatorLine.color || this.xAxis.color;
      canvas.lineWidth = this.xAxis.separatorLine.size;

      if (this.xAxis.separatorLine.style === LineStyle.DASH) {
        canvas.setLineDash(this.xAxis.separatorLine.dashValue);
      }

      var positions = this.pointValuesToPixel();

      for (var i = 0; i < positions.length; i += 2) {
        var x = positions[i];

        if (this.viewPortHandler.isInBoundsX(x)) {
          canvas.beginPath();
          canvas.moveTo(x + 0.5, this.viewPortHandler.contentTop());
          canvas.lineTo(x + 0.5, this.viewPortHandler.contentBottom());
          canvas.stroke();
          canvas.closePath();
        }
      }

      canvas.setLineDash([]);
    }
    /**
     * 绘制tick线
     * @param canvas Canvas
     */

  }, {
    key: "drawTickLines",
    value: function drawTickLines(canvas) {
      if (!this.xAxis.display || !this.xAxis.tickLine.display) {
        return;
      }

      canvas.lineWidth = 1;
      canvas.strokeStyle = this.xAxis.axisLine.color || this.xAxis.color;
      var positions = this.pointValuesToPixel();
      var startY = this.viewPortHandler.contentBottom();
      var endY = startY + this.xAxis.tickLine.size * 2;

      for (var i = 0; i < positions.length; i += 2) {
        var x = positions[i];

        if (this.viewPortHandler.isInBoundsX(x)) {
          canvas.beginPath();
          canvas.moveTo(x + 0.5, startY);
          canvas.lineTo(x + 0.5, endY);
          canvas.stroke();
          canvas.closePath();
        }
      }
    }
    /**
     * 获取值对应的坐标点值
     * @return Array
     */

  }, {
    key: "pointValuesToPixel",
    value: function pointValuesToPixel() {
      var positions = [];

      for (var i = 0; i < this.valueCount * 2; i += 2) {
        var pos = this.values[i / 2];
        positions[i] = parseInt((pos - this.dataBounds.min) * this.dataBounds.dataSpace + this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate) / 2);
      }

      return positions;
    }
  }, {
    key: "computeAxis",
    value: function computeAxis() {
      var dataMin = this.dataBounds.min;
      var max = Math.min(dataMin + this.dataBounds.range - 1, this.dataBounds.dataList.length - 1);
      this.computeAxisValues(dataMin, max);
    }
  }]);

  return XAxisChart;
}(AxisChart);

/**
 * 指标提示显示规则
 */

var IndicatorDisplayRule = {
  /**
   * 总是显示
   */
  ALWAYS: "always",

  /**
   * 跟随十字光标显示
   */
  FOLLOW_CROSS: "follow_cross",

  /**
   * 一直不显示
   */
  NONE: "none"
};

var Tooltip = function Tooltip() {
  _classCallCheck(this, Tooltip);

  /**
   * 文字大小
   */
  this.textSize = 8;
  /**
   * 光标线配置
   */

  this.crossLine = {
    display: true,
    style: LineStyle.DASH,
    dashValue: [8, 8],
    size: 2,
    color: colors["mobile-placeholder-color"],
    text: {
      color: colors["text-default-color"],
      size: 10,
      rectStrokeLineSize: 0,
      rectStrokeLineColor: colors["mobile-placeholder-color"],
      rectFillColor: colors["mobile-placeholder-color"],
      margin: 2,
      valueFormatter: null
    }
  };
  /**
   * 指标数据显示配置
   */

  this.indicatorData = {
    displayRule: IndicatorDisplayRule.ALWAYS,
    valueFormatter: null,
    text: {
      size: 10,
      margin: 20
    }
  };
};

var TooltipChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(TooltipChart, _Chart);

  function TooltipChart(tooltip, candle, indicator, xAxis, yAxis, candleChart, volChart, indicatorChart, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, TooltipChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TooltipChart).call(this, dataBounds, viewPortHandler));
    _this.displayCross = false;
    _this.crossPoint = {
      x: 0,
      y: 0
    };
    _this.tooltip = tooltip;
    _this.candle = candle;
    _this.indicator = indicator;
    _this.xAxis = xAxis;
    _this.yAxis = yAxis;
    _this.candleChart = candleChart;
    _this.volChart = volChart;
    _this.indicatorChart = indicatorChart;
    _this.yAxisLabelStrokePathPoints = [];
    return _this;
  }

  _createClass(TooltipChart, [{
    key: "draw",
    value: function draw(canvas) {
      var yAxisDataLabel = this.getCrossYAxisLabel();

      if (yAxisDataLabel == null) {
        return ZSmartModel.emit("tooltipHide");
      }

      if (this.dataBounds.currentDataPos < this.dataBounds.dataList.length) {
        var oldkLineModel = this.dataBounds.dataList[this.dataBounds.currentDataPos - 1];
        var kLineModel = this.dataBounds.dataList[this.dataBounds.currentDataPos];

        if (this.displayCross) {
          this.crossPoint.x = +(this.viewPortHandler.contentLeft() + this.dataBounds.dataSpace * (this.dataBounds.currentDataPos - this.dataBounds.min) + this.dataBounds.dataSpace * (1 - this.dataBounds.dataMarginSpaceRate) / 2).toFixed(0);
          canvas.font = (this.tooltip.crossLine.text.size || this.tooltip.textSize) * 2 + "px Arial";

          if (this.tooltip.crossLine.display) {
            this.drawCrossHorizontalLine(canvas);
            this.drawCrossVerticalLine(canvas, kLineModel);
          }
        }

        if (this.tooltip.indicatorData.displayRule === IndicatorDisplayRule.ALWAYS || this.tooltip.indicatorData.displayRule === IndicatorDisplayRule.FOLLOW_CROSS) {
          this.drawGeneralDataTooltip(oldkLineModel, kLineModel);
        }
      }
    }
    /**
     * 绘制水平线
     * @param canvas Canvas
     */

  }, {
    key: "drawCrossHorizontalLine",
    value: function drawCrossHorizontalLine(canvas) {
      var yAxisDataLabel = this.getCrossYAxisLabel();
      if (yAxisDataLabel == null) return;
      var isDrawYAxisTextOutside = this.yAxis.tickText.position === YAxisTextPosition.OUTSIDE;
      var textSize = this.tooltip.crossLine.text.size || this.tooltip.textSize;
      var yAxisDataLabelWidth = utils.calcTextWidth(textSize * 2 + "px Arial", yAxisDataLabel);
      var halfLabelHeight = textSize;
      var labelStartX;
      var labelStartY = this.crossPoint.y + 1;
      var lineStartX = this.viewPortHandler.contentLeft();
      var lineEndX = this.viewPortHandler.contentRight();
      var centerPoint = this.viewPortHandler.getContentCenter();
      var crossTextMarginSpace = this.tooltip.crossLine.text.margin;
      var rectStrokeLineSize = this.tooltip.crossLine.text.rectStrokeLineSize;

      if (isDrawYAxisTextOutside) {
        if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
          labelStartX = lineStartX - rectStrokeLineSize - crossTextMarginSpace * 2 - yAxisDataLabelWidth;
        } else {
          labelStartX = lineEndX + rectStrokeLineSize + crossTextMarginSpace * 2;
        }
      } else {
        if (this.crossPoint.x > centerPoint.x) {
          // 左边
          lineStartX = this.viewPortHandler.contentLeft() + rectStrokeLineSize * 2 + crossTextMarginSpace * 3 + yAxisDataLabelWidth;
          labelStartX = this.viewPortHandler.contentLeft() + rectStrokeLineSize + crossTextMarginSpace;
        } else {
          lineEndX = this.viewPortHandler.contentRight() - rectStrokeLineSize * 2 - crossTextMarginSpace * 3 - yAxisDataLabelWidth;
          labelStartX = lineEndX + rectStrokeLineSize + crossTextMarginSpace * 2;
        }
      }

      if (!isDrawYAxisTextOutside && this.crossPoint.x > centerPoint.x || isDrawYAxisTextOutside && this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
        // 左边
        this.yAxisLabelStrokePathPoints[0] = {
          x: lineStartX,
          y: this.crossPoint.y
        };
        this.yAxisLabelStrokePathPoints[1] = {
          x: lineStartX - crossTextMarginSpace,
          y: this.crossPoint.y - halfLabelHeight - crossTextMarginSpace
        };
        this.yAxisLabelStrokePathPoints[2] = {
          x: lineStartX - crossTextMarginSpace * 3 - yAxisDataLabelWidth,
          y: this.yAxisLabelStrokePathPoints[1].y
        };
        this.yAxisLabelStrokePathPoints[3] = {
          x: this.yAxisLabelStrokePathPoints[2].x,
          y: this.crossPoint.y + halfLabelHeight + crossTextMarginSpace
        };
        this.yAxisLabelStrokePathPoints[4] = {
          x: this.yAxisLabelStrokePathPoints[1].x,
          y: this.yAxisLabelStrokePathPoints[3].y
        };
      } else {
        // 右边
        this.yAxisLabelStrokePathPoints[0] = {
          x: lineEndX,
          y: this.crossPoint.y
        };
        this.yAxisLabelStrokePathPoints[1] = {
          x: lineEndX + crossTextMarginSpace,
          y: this.crossPoint.y - halfLabelHeight - crossTextMarginSpace
        };
        this.yAxisLabelStrokePathPoints[2] = {
          x: lineEndX + crossTextMarginSpace * 3 + yAxisDataLabelWidth,
          y: this.yAxisLabelStrokePathPoints[1].y
        };
        this.yAxisLabelStrokePathPoints[3] = {
          x: this.yAxisLabelStrokePathPoints[2].x,
          y: this.crossPoint.y + halfLabelHeight + crossTextMarginSpace
        };
        this.yAxisLabelStrokePathPoints[4] = {
          x: this.yAxisLabelStrokePathPoints[1].x,
          y: this.yAxisLabelStrokePathPoints[3].y
        };
      } // 绘制十字光标水平线


      canvas.lineWidth = this.tooltip.crossLine.size;
      canvas.strokeStyle = this.tooltip.crossLine.color;

      if (this.tooltip.crossLine.style === LineStyle.DASH) {
        canvas.setLineDash(this.tooltip.crossLine.dashValue);
      }

      canvas.beginPath();
      canvas.moveTo(lineStartX, this.crossPoint.y + 0.5);
      canvas.lineTo(lineEndX, this.crossPoint.y + 0.5);
      canvas.stroke();
      canvas.closePath();
      canvas.setLineDash([]); // 绘制y轴文字外的边框

      canvas.fillStyle = this.tooltip.crossLine.text.rectFillColor;
      canvas.beginPath();
      canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x, this.yAxisLabelStrokePathPoints[0].y);

      for (var i = 1; i < this.yAxisLabelStrokePathPoints.length; i++) {
        canvas.lineTo(this.yAxisLabelStrokePathPoints[i].x, this.yAxisLabelStrokePathPoints[i].y);
      }

      canvas.closePath();
      canvas.fill();
      canvas.lineWidth = this.tooltip.crossLine.text.rectStrokeLineSize;
      canvas.strokeStyle = this.tooltip.crossLine.text.rectStrokeLineColor;
      canvas.beginPath();
      canvas.moveTo(this.yAxisLabelStrokePathPoints[0].x, this.yAxisLabelStrokePathPoints[0].y);

      for (var _i = 1; _i < this.yAxisLabelStrokePathPoints.length; _i++) {
        canvas.lineTo(this.yAxisLabelStrokePathPoints[_i].x, this.yAxisLabelStrokePathPoints[_i].y);
      }

      canvas.closePath();
      canvas.stroke();
      canvas.textBaseline = "middle";
      canvas.fillStyle = this.tooltip.crossLine.text.color;
      canvas.fillText(yAxisDataLabel, labelStartX, labelStartY);
    }
    /**
     * 获取十字光标y轴上的文字
     */

  }, {
    key: "getCrossYAxisLabel",
    value: function getCrossYAxisLabel() {
      var candleChartYAxis = this.candleChart.yAxisChart;
      var candleChartHeight = candleChartYAxis.chartHeight;
      var candleChartTop = candleChartYAxis.chartTop;
      var volChartYAxis = this.volChart.yAxisChart;
      var volChartHeight = volChartYAxis.chartHeight;
      var volChartTop = volChartYAxis.chartTop;
      var indicatorChartYAxis = this.indicatorChart.yAxisChart;
      var indicatorChartHeight = indicatorChartYAxis.chartHeight;
      var indicatorChartTop = indicatorChartYAxis.chartTop;
      var eventY = this.crossPoint.y;

      if (eventY > candleChartTop && eventY < candleChartHeight + candleChartTop) {
        var candleChartYAxisDataMin = candleChartYAxis.axisMinimum;
        var candleChartYAxisDataMax = candleChartYAxis.axisMaximum;
        var yData = (1 - (eventY - candleChartTop) / candleChartHeight) * (candleChartYAxisDataMax - candleChartYAxisDataMin) + candleChartYAxisDataMin;
        var text = yData.toFixed(2);

        if (this.tooltip.crossLine.text.valueFormatter) {
          text = this.tooltip.crossLine.text.valueFormatter("y", yData) || "--";
        }

        return text;
      } else if (eventY > volChartTop && eventY < volChartTop + volChartHeight) {
        var volIndicatorChartYAxisDataMin = volChartYAxis.axisMinimum;
        var volIndicatorChartYAxisDataMax = volChartYAxis.axisMaximum;

        var _yData = (1 - (eventY - volChartTop) / volChartHeight) * (volIndicatorChartYAxisDataMax - volIndicatorChartYAxisDataMin) + volIndicatorChartYAxisDataMin;

        var _text = _yData.toFixed(0);

        if (this.tooltip.crossLine.text.valueFormatter) {
          _text = this.tooltip.crossLine.text.valueFormatter("y", _yData) || "--";
        }

        return _text;
      } else if (eventY > indicatorChartTop && eventY < indicatorChartTop + indicatorChartHeight) {
        var indicatorChartYAxisDataMin = indicatorChartYAxis.axisMinimum;
        var indicatorChartYAxisDataMax = indicatorChartYAxis.axisMaximum;

        var _yData2 = (1 - (eventY - indicatorChartTop) / indicatorChartHeight) * (indicatorChartYAxisDataMax - indicatorChartYAxisDataMin) + indicatorChartYAxisDataMin;

        var _text2 = _yData2.toFixed(2);

        if (this.indicatorChart.indicatorType === IndicatorType.VOL) {
          _text2 = _yData2.toFixed(0);
        }

        if (this.tooltip.crossLine.text.valueFormatter) {
          _text2 = this.tooltip.crossLine.text.valueFormatter("y", _yData2) || "--";
        }

        return _text2;
      }

      return null;
    }
    /**
     * 绘制十字光标垂直线
     * @param canvas Canvas
     * @param kLineModel KLineModel
     */

  }, {
    key: "drawCrossVerticalLine",
    value: function drawCrossVerticalLine(canvas, kLineModel) {
      canvas.lineWidth = this.tooltip.crossLine.size;
      canvas.strokeStyle = this.tooltip.crossLine.color;

      if (this.tooltip.crossLine.style === LineStyle.DASH) {
        canvas.setLineDash(this.tooltip.crossLine.dashValue);
      }

      canvas.beginPath();
      canvas.moveTo(this.crossPoint.x + 0.5, this.viewPortHandler.contentTop());
      canvas.lineTo(this.crossPoint.x + 0.5, this.viewPortHandler.contentBottom());
      canvas.stroke();
      canvas.closePath();
      canvas.setLineDash([]);
      var timestamp = kLineModel.timestamp;
      var label = utils.formatDate(timestamp);

      if (this.tooltip.crossLine.text.valueFormatter) {
        label = this.tooltip.crossLine.text.valueFormatter("x", kLineModel) || "--";
      }

      var textSize = this.tooltip.crossLine.text.size || this.tooltip.textSize;
      var labelWidth = utils.calcTextWidth(textSize * 2 + "px Arial", label);
      var xAxisLabelX = this.crossPoint.x - labelWidth / 2;
      var crossTextMarginSpace = this.tooltip.crossLine.text.margin;
      var rectStrokeLineSize = this.tooltip.crossLine.text.rectStrokeLineSize; // 保证整个x轴上的提示文字总是完全显示

      if (xAxisLabelX < this.viewPortHandler.contentLeft() + crossTextMarginSpace + rectStrokeLineSize) {
        xAxisLabelX = this.viewPortHandler.contentLeft();
      } else if (xAxisLabelX > this.viewPortHandler.contentRight() - labelWidth - rectStrokeLineSize) {
        xAxisLabelX = this.viewPortHandler.contentRight() - labelWidth - rectStrokeLineSize;
      }

      var rectLeft = xAxisLabelX - rectStrokeLineSize - crossTextMarginSpace;
      var rectTop = this.viewPortHandler.contentBottom() + 6;
      var rectRight = xAxisLabelX + labelWidth + crossTextMarginSpace + rectStrokeLineSize;
      var rectBottom = this.viewPortHandler.contentBottom() + 26;
      canvas.fillStyle = this.tooltip.crossLine.text.rectFillColor;
      canvas.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop);
      canvas.lineWidth = rectStrokeLineSize;
      canvas.strokeStyle = this.tooltip.crossLine.text.rectStrokeLineColor;
      canvas.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop); // 绘制轴上的提示文字

      canvas.textBaseline = "top";
      canvas.fillStyle = this.tooltip.crossLine.text.color;
      canvas.fillText(label, xAxisLabelX, this.viewPortHandler.contentBottom() + rectStrokeLineSize + crossTextMarginSpace + 6);
    }
    /**
     * 绘制基础数据提示
     * @param oldkLineModel
     * @param kLineModel
     */

  }, {
    key: "drawGeneralDataTooltip",
    value: function drawGeneralDataTooltip(oldkLineModel, kLineModel) {
      ZSmartModel.emit("tooltipShowingData", {
        old: oldkLineModel,
        "new": kLineModel
      });
    }
    /**
     * 设置会否显示cross
     */

  }, {
    key: "setCross",
    value: function setCross(y, display) {
      this.crossPoint.y = y;
      this.displayCross = display;
    }
  }]);

  return TooltipChart;
}(Chart);

var MarkType = {
  /**
   * 无
   */
  NONE: "none",

  /**
   * 水平直线
   */
  HORIZONTAL_LINE: "horizontal_line",

  /**
   * 垂直直线
   */
  VERTICAL_LINE: "vertical_line",

  /**
   * 普通直线
   */
  LINE: "line",

  /**
   * 水平线段
   */
  HORIZONTAL_SEGMENT: "horizontal_segment",

  /**
   * 垂直线段
   */
  VERTICAL_SEGMENT: "vertical_segment",

  /**
   * 普通线段
   */
  SEGMENT: "segment",

  /**
   * 箭头线
   */
  ARROW_LINE: "arrow_line"
};
var ActiveType = {
  LINE: "line",
  POINT: "point",
  NONE: "none"
};

var MarkData = function MarkData() {
  _classCallCheck(this, MarkData);

  this.markingType = MarkType.NONE; // 开始绘制时的点

  this.startMarkPoint = {
    x: 0,
    y: 0
  }; // 正在绘制的数据

  this.markingDatas = []; // 绘制的水平线数据集合

  this.horizontalLineDatas = []; // 绘制的垂直线数据集合

  this.verticalLineDatas = []; // 绘制的普通直线数据集合

  this.lineDatas = []; // 绘制的水平线段数据集合

  this.horizontalSegmentDatas = []; // 绘制的垂直线段数据集合

  this.verticalSegmentDatas = []; // 普通线段数据集合

  this.segmentDatas = []; // 箭头线数据集合

  this.arrowLineDatas = [];
};

var MarkChart =
/*#__PURE__*/
function (_Chart) {
  _inherits(MarkChart, _Chart);

  function MarkChart(mark, markData, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, MarkChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MarkChart).call(this, dataBounds, viewPortHandler));
    _this.mark = mark;
    _this.markData = markData;
    return _this;
  }

  _createClass(MarkChart, [{
    key: "draw",
    value: function draw(canvas) {
      canvas.save();
      canvas.beginPath();
      canvas.rect(this.viewPortHandler.contentLeft(), this.chartTop, this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft(), this.chartHeight);
      canvas.closePath();
      canvas.clip();
      this.drawStartPoint(canvas);
      this.drawHorizontalVerticalLine(canvas, this.markData.horizontalLineDatas, MarkType.HORIZONTAL_LINE);
      this.drawHorizontalVerticalLine(canvas, this.markData.verticalLineDatas, MarkType.VERTICAL_LINE);
      this.drawLine(canvas);
    }
    /**
     * 绘制点
     * @param canvas
     * @param point
     * @param isHighlight
     */

  }, {
    key: "drawPoint",
    value: function drawPoint(canvas, point, isHighlight) {
      var radius = (isHighlight ? this.mark.point.highlight.radius : this.mark.point.radius) * 2;
      canvas.fillStyle = isHighlight ? this.mark.point.highlight.fillColor : this.mark.point.fillColor;
      canvas.strokeStyle = isHighlight ? this.mark.point.highlight.strokeColor : this.mark.point.strokeColor;
      canvas.lineWidth = 1;
      canvas.beginPath();
      canvas.arc(point.x, point.y, radius, 0, Math.PI * 2, true);
      canvas.fill();
      canvas.closePath();
      canvas.beginPath();
      canvas.arc(point.x, point.y, radius, 0, Math.PI * 2, true);
      canvas.stroke();
      canvas.closePath();
    }
    /**
     * 绘制开始点
     * @param canvas
     */

  }, {
    key: "drawStartPoint",
    value: function drawStartPoint(canvas) {
      if (this.markData.markingType !== MarkType.NONE && this.markData.markingDatas.length === 0) {
        var point = this.markData.startMarkPoint;
        this.drawPoint(canvas, point, true);
      }
    }
    /**
     * 绘制水平直线
     */

  }, {
    key: "drawHorizontalVerticalLine",
    value: function drawHorizontalVerticalLine(canvas, lineDatas, markType) {
      var lineDataLength = lineDatas.length;

      for (var i = 0; i < lineDataLength; i++) {
        var _point = lineDatas[i];
        canvas.lineWidth = 1;

        if (_point.activeType === ActiveType.LINE || _point.activeType === ActiveType.POINT) {
          this.drawPoint(canvas, _point, _point.activeType === ActiveType.POINT);
          canvas.strokeStyle = this.mark.line.highlight.color;
        }

        canvas.beginPath();

        if (markType === MarkType.HORIZONTAL_LINE) {
          canvas.moveTo(this.viewPortHandler.contentLeft(), _point.y);
          canvas.lineTo(this.viewPortHandler.contentRight(), _point.y);
        } else {
          canvas.moveTo(_point.x, this.viewPortHandler.contentTop());
          canvas.lineTo(_point.x, this.viewPortHandler.contentBottom());
        }

        canvas.stroke();
        canvas.closePath();
      }

      var point = this.markData.markingDatas[0];

      if (point && this.markData.markingType === markType) {
        canvas.lineWidth = 1;
        canvas.strokeStyle = this.mark.line.highlight.color;
        canvas.beginPath();

        if (markType === MarkType.HORIZONTAL_LINE) {
          canvas.moveTo(this.viewPortHandler.contentLeft(), point.y);
          canvas.lineTo(this.viewPortHandler.contentRight(), point.y);
        } else {
          canvas.moveTo(point.x, this.viewPortHandler.contentTop());
          canvas.lineTo(point.x, this.viewPortHandler.contentBottom());
        }

        canvas.stroke();
        canvas.closePath();
        this.drawPoint(canvas, point, true);
      }
    }
    /**
     * 绘制直线
     * @param canvas
     */

  }, {
    key: "drawLine",
    value: function drawLine(canvas) {
      var lineDataLength = this.markData.lineDatas.length;
      canvas.lineWidth = 1;
      canvas.strokeStyle = "#ffffff";

      for (var i = 0; i < lineDataLength; i++) {
        var lineData = this.markData.lineDatas[i];
        var points = lineData.points;
        canvas.beginPath();
        canvas.moveTo(this.viewPortHandler.contentLeft(), this.getY(this.viewPortHandler.contentLeft(), points[0], points[1]));
        canvas.lineTo(this.viewPortHandler.contentRight(), this.getY(this.viewPortHandler.contentRight(), points[0], points[1]));
        canvas.stroke();
        canvas.closePath();
      }

      var markingPointSize = this.markData.markingDatas.length;

      if (markingPointSize > 0 && this.markData.markingType === MarkType.LINE) {
        if (markingPointSize === 1) {
          this.drawPoint(canvas, this.markData.markingDatas[0], true);
        } else {
          this.drawPoint(canvas, this.markData.markingDatas[0], false);
          this.drawPoint(canvas, this.markData.markingDatas[1], true);
          canvas.beginPath();
          canvas.moveTo(this.viewPortHandler.contentLeft(), this.getY(this.viewPortHandler.contentLeft(), this.markData.markingDatas[0], this.markData.markingDatas[1]));
          canvas.lineTo(this.viewPortHandler.contentRight(), this.getY(this.viewPortHandler.contentRight(), this.markData.markingDatas[0], this.markData.markingDatas[1]));
          canvas.stroke();
          canvas.closePath();
        }
      }
    }
    /**
     * 获取x点对应的y轴坐标
     * @param x
     * @param point1
     * @param point2
     * @returns {number}
     */

  }, {
    key: "getY",
    value: function getY(x, point1, point2) {
      return (point2.y - point1.y) / (point2.x - point1.x) * x + point1.y - (point2.y - point1.y) / (point2.x - point1.x) * point1.x;
    }
  }]);

  return MarkChart;
}(Chart);

var XAxis =
/*#__PURE__*/
function (_Axis) {
  _inherits(XAxis, _Axis);

  function XAxis() {
    var _this;

    _classCallCheck(this, XAxis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XAxis).call(this));
    /**
     * x轴最大高度
     */

    _this.xAxisMaxHeight = 20;
    /**
     * x轴最小高度
     */

    _this.xAxisMinHeight = 20;
    return _this;
  }
  /**
   * 计算x轴需要的高度
   * @return number
   */


  _createClass(XAxis, [{
    key: "getRequiredHeightSpace",
    value: function getRequiredHeightSpace() {
      var height = this.tickText.size * 2 + this.tickText.margin * 2;

      if (this.display && this.tickLine.display) {
        height += this.tickLine.size * 2;
      }

      if (this.display && this.axisLine.display) {
        height += this.axisLine.size;
      }

      var maxHeight = height;

      if (this.xAxisMaxHeight > 0) {
        maxHeight = this.xAxisMaxHeight * 2;
      }

      height = Math.max(this.xAxisMinHeight * 2, Math.min(height, maxHeight));
      return parseInt(height);
    }
  }]);

  return XAxis;
}(Axis);

var Grid = function Grid() {
  _classCallCheck(this, Grid);

  this.display = true;
  /**
   * 边框线尺寸
   */

  this.lineSize = 1;
  /**
   * 边框线颜色
   */

  this.lineColor = colors["sort-color"];
};

var DrawLine = function DrawLine() {
  _classCallCheck(this, DrawLine);

  this.line = {
    color: "#DEDEDE",
    highlight: {
      color: "#ffffff"
    }
  };
  this.point = {
    fillColor: "#DEDEDE",
    strokeColor: "#DEDEDE",
    radius: 4,
    highlight: {
      fillColor: "#FFFFFF",
      strokeColor: "#FFFFFF",
      radius: 5
    }
  };
};

var Event =
/*#__PURE__*/
function () {
  function Event(kline, dataBounds, viewPortHandler) {
    _classCallCheck(this, Event);

    this.kline = kline;
    this.dataBounds = dataBounds;
    this.viewPortHandler = viewPortHandler;
  }
  /**
   * 是否是有效事件
   * @param point
   * @returns {boolean}
   */


  _createClass(Event, [{
    key: "isValidEvent",
    value: function isValidEvent(point) {
      return !(point.x < this.viewPortHandler.contentLeft() || point.x > this.viewPortHandler.contentRight() || point.y < this.viewPortHandler.contentTop() || point.y > this.viewPortHandler.contentBottom());
    }
    /**
     * 获取事件对应画布上的点
     * @param e
     * @returns {{x: number, y: number}}
     */

  }, {
    key: "getCanvasPoint",
    value: function getCanvasPoint(e) {
      var rect = this.kline.markCanvasDom.getBoundingClientRect();
      var x = Math.round(e.clientX - rect.left);
      var y = Math.round(e.clientY - rect.top);
      return {
        x: x * 2,
        y: y * 2
      };
    }
    /**
     * 阻止事件
     * @param e
     */

  }, {
    key: "stopEvent",
    value: function stopEvent(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }

      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
      }
    }
  }]);

  return Event;
}();

var CROSS = "cross";
var DRAG = "drag";

var MouseEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(MouseEvent, _Event);

  function MouseEvent(kline, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, MouseEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MouseEvent).call(this, kline, dataBounds, viewPortHandler)); // 事件模型

    _this.mouseMode = CROSS;
    _this.mouseDownPoint = {
      x: 0,
      y: 0
    };
    return _this;
  }
  /**
   * 鼠标按下时事件
   * @param e
   */


  _createClass(MouseEvent, [{
    key: "mouseDown",
    value: function mouseDown(e) {
      this.stopEvent(e);

      if (e.button === 0) {
        var point = this.getCanvasPoint(e);

        if (!this.isValidEvent(point)) {
          return;
        }

        this.mouseMode = DRAG;
        this.mouseDownPoint.x = e.x;
        this.mouseDownPoint.y = e.y;
        this.kline.tooltipChart.setCross(point.y, false);
        this.kline.freshen(FRESHEN_TOOLTIP);
      }
    }
    /**
     * 鼠标抬起时事件
     * @param e
     */

  }, {
    key: "mouseUp",
    value: function mouseUp(e) {
      this.stopEvent(e);
      var point = this.getCanvasPoint(e);

      if (!this.isValidEvent(point)) {
        return;
      }

      this.mouseMode = CROSS;
      this.kline.tooltipChart.setCross(point.y, true);
      this.kline.freshen(FRESHEN_TOOLTIP);
    }
  }, {
    key: "mouseLeave",
    value: function mouseLeave(e) {
      this.stopEvent(e);
      var point = this.getCanvasPoint(e);
      this.kline.tooltipChart.setCross(point.y, false);
      this.kline.freshen(FRESHEN_TOOLTIP);
    }
    /**
     * 鼠标移动时事件
     * @param e
     */

  }, {
    key: "mouseMove",
    value: function mouseMove(e) {
      this.stopEvent(e);
      var point = this.getCanvasPoint(e);

      if (!this.isValidEvent(point)) {
        this.kline.tooltipChart.setCross(point.y, false);
        this.kline.freshen(FRESHEN_TOOLTIP);
        return;
      }

      if (this.mouseMode === DRAG) {
        var moveDist = e.x - this.mouseDownPoint.x;

        if (moveDist > this.dataBounds.dataSpace / 2) {
          if (this.dataBounds.min === 0 || this.dataBounds.dataList.length < this.dataBounds.range) {
            return false;
          }

          this.mouseDownPoint.x = e.x;
          var moveRange = +Math.abs(moveDist / this.dataBounds.dataSpace).toFixed(0);

          if (moveRange === 0) {
            moveRange = 1;
          }

          this.dataBounds.min -= moveRange;

          if (this.dataBounds.min <= 0) {
            this.dataBounds.min = 0;
          }

          this.kline.freshen(FRESHEN_CHART);
        } else if (moveDist < 0 - this.dataBounds.dataSpace / 2) {
          if (this.dataBounds.min + this.dataBounds.range === this.dataBounds.dataList.length || this.dataBounds.dataList.length < this.dataBounds.range) {
            return false;
          }

          this.mouseDownPoint.x = e.x;

          var _moveRange = +Math.abs(moveDist / this.dataBounds.dataSpace).toFixed(0);

          if (_moveRange === 0) {
            _moveRange = 1;
          }

          this.dataBounds.min += _moveRange;

          if (this.dataBounds.min >= this.dataBounds.dataList.length - this.dataBounds.range) {
            this.dataBounds.min = this.dataBounds.dataList.length - this.dataBounds.range;
          }

          this.kline.freshen();
        }
      } else if (this.mouseMode === CROSS) {
        this.dataBounds.calcCurrentDataIndex(point.x);
        this.kline.tooltipChart.setCross(point.y, true);
        this.kline.freshen(FRESHEN_TOOLTIP);
      }
    }
    /**
     * 鼠标滚轮事件
     * @param e
     */

  }, {
    key: "mouseWheel",
    value: function mouseWheel(e) {
      var point = this.getCanvasPoint(e);

      if (!this.isValidEvent(point)) {
        return;
      }

      this.stopEvent(e);
      var touchStartPosition = this.dataBounds.min;
      var touchRange = this.dataBounds.range;
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY)); // 是否缩小

      var isZoomingOut = delta === 1;
      var scaleX = 1;

      if (isZoomingOut) {
        scaleX = 0.95;

        if (this.dataBounds.range >= this.dataBounds.maxRange) {
          // 无法继续缩小
          return false;
        }
      } else {
        scaleX = 1.05;

        if (this.dataBounds.range <= this.dataBounds.minRange) {
          // 无法继续放大
          return false;
        }
      } // 计算缩放后的range大小


      this.dataBounds.range = +(touchRange / scaleX).toFixed(0);
      this.dataBounds.range = Math.min(Math.max(this.dataBounds.range, this.dataBounds.minRange), this.dataBounds.maxRange);
      this.dataBounds.min = touchStartPosition + touchRange - this.dataBounds.range;

      if (this.dataBounds.min + this.dataBounds.range > this.dataBounds.dataList.length) {
        this.dataBounds.min = 0;
      }

      if (this.dataBounds.min < 0) {
        this.dataBounds.min = 0;
      }

      this.kline.freshen(FRESHEN_CHART);
    }
  }]);

  return MouseEvent;
}(Event);

/**
 * 无
 */

var TOUCH_NO = 0;
/**
 * 拖拽
 */

var TOUCH_DRAG = 1;
/**
 * 缩放
 */

var TOUCH_ZOOM = 2;
/**
 *
 */

var TOUCH_POST_ZOOM = 3;
/**
 * 十字光标
 */

var TOUCH_CROSS = 4;
/**
 * 十字光标取消
 */

var TOUCH_CROSS_CANCEL = 5;

var TouchEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(TouchEvent, _Event);

  function TouchEvent(kline, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, TouchEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TouchEvent).call(this, kline, dataBounds, viewPortHandler)); // 事件模型

    _this.touchMode = TOUCH_NO;
    _this.touchStartPoint = {
      x: 0,
      y: 0
    };
    _this.touchMovePoint = {
      x: 0,
      y: 0
    };
    _this.touchCrossPoint = {
      x: 0,
      y: 0
    };
    _this.savedDist = 1;
    _this.savedXDist = 1;
    _this.touchRange = _this.dataBounds.range;
    _this.touchStartPosition = _this.dataBounds.min;
    _this.delayTimeout = null;

    _this.delayActiveCross = function () {
      if (_this.touchMode === TOUCH_NO || _this.touchMode === TOUCH_CROSS_CANCEL) {
        if (_this.kline) {
          _this.touchMode = TOUCH_CROSS;
          _this.touchCrossPoint = {
            x: _this.touchStartPoint.x,
            y: _this.touchStartPoint.y
          };
          dataBounds.calcCurrentDataIndex(_this.touchCrossPoint.x);

          _this.kline.tooltipChart.setCross(_this.touchCrossPoint.y, true);

          _this.kline.freshen(FRESHEN_TOOLTIP);
        }
      }
    };

    return _this;
  }
  /**
   * 触摸事件开始
   * @param e
   */


  _createClass(TouchEvent, [{
    key: "touchStart",
    value: function touchStart(e) {
      if (e.targetTouches.length === 1) {
        var point = this.getCanvasPoint(e.targetTouches[0]);
        this.touchStartPoint = {
          x: point.x,
          y: point.y
        };
        this.touchMovePoint = {
          x: point.x,
          y: point.y
        };

        if (!this.isValidEvent(this.touchStartPoint)) {
          return;
        }

        if (this.touchMode === TOUCH_CROSS) {
          this.stopEvent(e);
          var crossRadius = this.distance(point.x, this.touchCrossPoint.x, point.y, this.touchCrossPoint.y);

          if (crossRadius < 10) {
            this.performCross(e);
          } else {
            this.touchMode = TOUCH_CROSS_CANCEL;
            this.kline.tooltipChart.setCross(0, false);
            this.kline.freshen(FRESHEN_TOOLTIP);
          }
        } else {
          this.touchMode = TOUCH_NO;
        }

        this.removeDelayActiveCross();
        this.postDelayDelayActiveCross();
      } else if (e.targetTouches.length > 1) {
        if (!this.isValidEvent(this.touchStartPoint)) {
          return;
        }

        if (this.touchMode !== TOUCH_CROSS) {
          this.stopEvent(e);
          this.savedDist = this.spacing(e);
          this.savedXDist = this.getXDist(e);

          if (this.savedDist > 3) {
            this.touchMode = TOUCH_ZOOM;
          }

          this.touchRange = this.dataBounds.range;
          this.touchStartPosition = this.dataBounds.min;
        }
      }
    }
    /**
     * 触摸事件移动
     * @param e
     */

  }, {
    key: "touchMove",
    value: function touchMove(e) {
      if (!this.isValidEvent(this.touchStartPoint)) {
        return;
      }

      switch (this.touchMode) {
        case TOUCH_ZOOM:
          {
            this.stopEvent(e);
            this.performZoom(e);
            break;
          }

        case TOUCH_DRAG:
          {
            this.stopEvent(e);
            this.performDrag(e);
            break;
          }

        case TOUCH_CROSS:
          {
            this.stopEvent(e);
            this.performCross(e);
            break;
          }

        case TOUCH_CROSS_CANCEL:
          {
            this.removeDelayActiveCross();
            break;
          }

        case TOUCH_NO:
          {
            var point = this.getCanvasPoint(e.targetTouches[0]);
            var distance = Math.abs(this.distance(point.x, this.touchStartPoint.x, point.y, this.touchStartPoint.y));

            if (distance > 10) {
              var distanceX = Math.abs(point.x - this.touchStartPoint.x);
              var distanceY = Math.abs(point.y - this.touchStartPoint.y);

              if (distanceY <= distanceX) {
                this.stopEvent(e);
                this.kline.tooltipChart.setCross(0, false);
                this.touchMode = TOUCH_DRAG;
                this.kline.freshen(FRESHEN_TOOLTIP);
              }
            }

            this.removeDelayActiveCross();
          }
      }
    }
    /**
     * 触摸事件结束
     * @param e
     */

  }, {
    key: "touchEnd",
    value: function touchEnd(e) {
      if (!this.isValidEvent(this.touchStartPoint)) {
        return;
      }

      this.stopEvent(e);

      if (e.targetTouches.length > 0) {
        if (this.touchMode === TOUCH_CROSS) {
          this.performCross(e);
        } else {
          this.touchMode = TOUCH_POST_ZOOM;
        }
      } else {
        this.removeDelayActiveCross();

        if (this.touchMode !== TOUCH_CROSS) {
          // 拿起
          this.touchMode = TOUCH_NO;
          this.kline.tooltipChart.setCross(0, false);
          this.kline.freshen(FRESHEN_TOOLTIP);
        }
      }
    }
    /**
     * 处理拖拽视图事件
     * @param e
     * @returns {boolean}
     */

  }, {
    key: "performDrag",
    value: function performDrag(e) {
      // 左右滑动事件
      var point = this.getCanvasPoint(e.targetTouches[0]);
      var moveDist = point.x - this.touchMovePoint.x;

      if (moveDist < 0 - this.dataBounds.dataSpace / 2) {
        if (this.dataBounds.min + this.dataBounds.range === this.dataBounds.dataList.length || this.dataBounds.dataList.length < this.dataBounds.range) {
          return false;
        }

        this.touchMovePoint.x = point.x;
        var moveRange = +Math.abs(moveDist / this.dataBounds.dataSpace).toFixed(0);

        if (moveRange === 0) {
          moveRange = 1;
        }

        this.dataBounds.min += moveRange;

        if (this.dataBounds.min >= this.dataBounds.dataList.length - this.dataBounds.range) {
          this.dataBounds.min = this.dataBounds.dataList.length - this.dataBounds.range;
        }

        this.kline.freshen(FRESHEN_CHART);
      } else if (moveDist > this.dataBounds.dataSpace / 2) {
        if (this.dataBounds.min === 0 || this.dataBounds.dataList.length < this.dataBounds.range) {
          return false;
        }

        this.touchMovePoint.x = point.x;

        var _moveRange = +Math.abs(moveDist / this.dataBounds.dataSpace).toFixed(0);

        if (_moveRange === 0) {
          _moveRange = 1;
        }

        this.dataBounds.min -= _moveRange;

        if (this.dataBounds.min <= 0) {
          this.dataBounds.min = 0;
        }

        this.kline.freshen(FRESHEN_CHART);
      }
    }
    /**
     * 处理缩放
     * @param e
     * @returns {boolean}
     */

  }, {
    key: "performZoom",
    value: function performZoom(e) {
      if (e.targetTouches.length > 1) {
        var totalDist = this.spacing(e);

        if (totalDist > 10) {
          var xDist = this.getXDist(e); // x轴方向 scale

          var scaleX = xDist / this.savedXDist; // 是否缩小

          var isZoomingOut = scaleX < 1;

          if (isZoomingOut) {
            if (this.dataBounds.range >= this.dataBounds.maxRange) {
              // 无法继续缩小
              return false;
            }
          } else {
            if (this.dataBounds.range <= this.dataBounds.minRange) {
              // 无法继续放大
              return false;
            }
          } // 计算缩放后的range大小


          this.dataBounds.range = +(this.touchRange / scaleX).toFixed(0);
          this.dataBounds.range = Math.min(Math.max(this.dataBounds.range, this.dataBounds.minRange), this.dataBounds.maxRange);
          this.dataBounds.min = this.touchStartPosition + this.touchRange - this.dataBounds.range;

          if (this.dataBounds.min + this.dataBounds.range > this.dataBounds.dataList.length) {
            this.dataBounds.min = 0;
          }

          if (this.dataBounds.min < 0) {
            this.dataBounds.min = 0;
          }

          this.kline.freshen(FRESHEN_CHART);
        }
      }
    }
    /**
     * 处理移动光标
     * @param e
     * @returns {boolean}
     */

  }, {
    key: "performCross",
    value: function performCross(e) {
      var point = this.getCanvasPoint(e.targetTouches[0]);
      this.touchCrossPoint = {
        x: point.x,
        y: point.y
      };
      this.dataBounds.calcCurrentDataIndex(this.touchCrossPoint.x);
      this.kline.tooltipChart.setCross(this.touchCrossPoint.y, true);
      this.kline.freshen(FRESHEN_TOOLTIP);
    }
    /**
     * 执行延迟事件
     */

  }, {
    key: "postDelayDelayActiveCross",
    value: function postDelayDelayActiveCross() {
      this.delayTimeout = setTimeout(this.delayActiveCross, 200);
    }
    /**
     * 移除延迟事件
     */

  }, {
    key: "removeDelayActiveCross",
    value: function removeDelayActiveCross() {
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = null;
      }
    }
    /**
     * 两点之间的距离
     * @param eventX
     * @param startX
     * @param eventY
     * @param startY
     * @returns {*}
     */

  }, {
    key: "distance",
    value: function distance(eventX, startX, eventY, startY) {
      var dx = eventX - startX;
      var dy = eventY - startY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * 计算移动距离
     * @param e
     * @returns {*}
     */

  }, {
    key: "spacing",
    value: function spacing(e) {
      if (e.targetTouches.length < 2) {
        return 0;
      }

      var point1 = this.getCanvasPoint(e.targetTouches[0]);
      var point2 = this.getCanvasPoint(e.targetTouches[1]);
      var x = Math.abs(point1.x - point2.x);
      var y = Math.abs(point1.y - point2.y);
      return Math.sqrt(x * x + y * y);
    }
    /**
     * 获取两点间x的距离
     * @param e
     * @returns {number}
     */

  }, {
    key: "getXDist",
    value: function getXDist(e) {
      var point1 = this.getCanvasPoint(e.targetTouches[0]);
      var point2 = this.getCanvasPoint(e.targetTouches[1]);
      return Math.abs(point1.x - point2.y);
    }
  }]);

  return TouchEvent;
}(Event);

var MarkEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(MarkEvent, _Event);

  function MarkEvent(kline, markData, dataBounds, viewPortHandler) {
    var _this;

    _classCallCheck(this, MarkEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MarkEvent).call(this, kline, dataBounds, viewPortHandler));
    _this.markData = markData;
    return _this;
  }
  /**
   * 绘制结束
   */


  _createClass(MarkEvent, [{
    key: "drawLineEnd",
    value: function drawLineEnd() {
      this.markData.markingType = MarkType.NONE;
      this.markData.markingDatas = [];
      this.kline.tooltipCanvasDom.style.display = "";
    }
    /**
     * 开始绘制
     */

  }, {
    key: "drawLineStart",
    value: function drawLineStart(markingType) {
      this.markData.markingType = markingType;
      this.markData.markingDatas = [];
      this.kline.tooltipCanvasDom.style.display = "none";
    }
    /**
     * 鼠标按下时事件
     * @param e
     */

  }, {
    key: "mouseDown",
    value: function mouseDown(e) {
      this.stopEvent(e);
      var point = this.getCanvasPoint(e);

      if (!this.isValidEvent(point)) {
        return;
      }

      if (e.button === 0) {
        if (this.markData.markingType === MarkType.NONE) {
          if (this.performHorizontalLineMouseLeftClick(point) || this.performVerticalLineMouseLeftClick(point)) {
            this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
            return;
          }

          return;
        }

        if (this.markData.markingDatas.length === 0) {
          this.markData.markingDatas[0] = point;
          this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
        } else if (this.markData.markingDatas.length === 1) {
          if (this.markData.markingType === MarkType.HORIZONTAL_LINE || this.markData.markingType === MarkType.VERTICAL_LINE) {
            if (this.markData.markingType === MarkType.HORIZONTAL_LINE) {
              this.markData.horizontalLineDatas.push(point);
            } else {
              this.markData.verticalLineDatas.push(point);
            }

            this.drawLineEnd();
          }

          this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
        } else if (this.markData.markingDatas.length === 2) {
          this.markData.lineDatas.push({
            points: [this.markData.markingDatas[0], point]
          });
          this.drawLineEnd();
          this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
        }
      } else if (e.button === 2) {
        if (this.markData.markingType !== MarkType.NONE) {
          this.drawLineEnd();
          this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
          return;
        }

        if (this.performHorizontalLineMouseRightClick(point) || this.performVerticalLineMouseRightClick(point)) {
          this.kline.freshen(FRESHEN_DRAW_LINE_CHART); // return
        }
      }
    }
    /**
     * 处理水平直线鼠标左键点击事件
     * @param point
     */

  }, {
    key: "performHorizontalLineMouseLeftClick",
    value: function performHorizontalLineMouseLeftClick(point) {
      var horizontalLineDataLength = this.markData.horizontalLineDatas.length;

      for (var i = 0; i < horizontalLineDataLength; i++) {
        var lineData = this.markData.horizontalLineDatas[i];

        if (point.y < lineData.y + 10 && point.y > lineData.y - 10 && point.x < lineData.x + 10 && point.x > lineData.x - 10) {
          this.markData.horizontalLineDatas.splice(i, 1);
          this.drawLineStart(MarkType.HORIZONTAL_LINE);
          this.markData.markingDatas[0] = point;
          return true;
        }
      }

      return false;
    }
    /**
     * 处理水平直线鼠标左键点击事件
     * @param point
     */

  }, {
    key: "performHorizontalLineMouseRightClick",
    value: function performHorizontalLineMouseRightClick(point) {
      var horizontalLineDataLength = this.markData.horizontalLineDatas.length;

      for (var i = 0; i < horizontalLineDataLength; i++) {
        var lineData = this.markData.horizontalLineDatas[i];

        if (point.x < lineData.x + 10 && point.x > lineData.x - 10) {
          if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
            if (this.markData.markingType === MarkType.NONE) {
              this.markData.horizontalLineDatas.splice(i, 1);
              this.drawLineEnd();
              return true;
            }
          }
        } else {
          if (point.y < lineData.y + 4 && point.y > lineData.y - 4) {
            if (this.markData.markingType === MarkType.NONE) {
              this.markData.horizontalLineDatas.splice(i, 1);
              this.drawLineEnd();
              return true;
            }
          }
        }
      }

      return false;
    }
    /**
     * 处理垂直直线鼠标左键点击事件
     * @param point
     */

  }, {
    key: "performVerticalLineMouseLeftClick",
    value: function performVerticalLineMouseLeftClick(point) {
      var verticalLineDataLength = this.markData.verticalLineDatas.length;

      for (var i = 0; i < verticalLineDataLength; i++) {
        var lineData = this.markData.verticalLineDatas[i];

        if (point.y < lineData.y + 10 && point.y > lineData.y - 10 && point.x < lineData.x + 10 && point.x > lineData.x - 10) {
          this.markData.verticalLineDatas.splice(i, 1);
          this.drawLineStart(MarkType.VERTICAL_LINE);
          this.markData.markingDatas[0] = point;
          return true;
        }
      }

      return false;
    }
    /**
     * 处理水平直线鼠标左键点击事件
     * @param point
     */

  }, {
    key: "performVerticalLineMouseRightClick",
    value: function performVerticalLineMouseRightClick(point) {
      var verticalLineDataLength = this.markData.verticalLineDatas.length;

      for (var i = 0; i < verticalLineDataLength; i++) {
        var lineData = this.markData.verticalLineDatas[i];

        if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
          if (point.y < lineData.x + 10 && point.x > lineData.x - 10) {
            if (this.markData.markingType === MarkType.NONE) {
              this.markData.verticalLineDatas.splice(i, 1);
              this.drawLineEnd();
              return true;
            }
          }
        } else {
          if (point.x < lineData.x + 4 && point.x > lineData.x - 4) {
            if (this.markData.markingType === MarkType.NONE) {
              this.markData.verticalLineDatas.splice(i, 1);
              this.drawLineEnd();
              return true;
            }
          }
        }
      }

      return false;
    }
    /**
     * 鼠标抬起时事件
     * @param e
     */

  }, {
    key: "mouseUp",
    value: function mouseUp(e) {
      this.stopEvent(e);
    }
  }, {
    key: "mouseLeave",
    value: function mouseLeave(e) {
      this.stopEvent(e);
    }
    /**
     * 鼠标移动时事件
     * @param e
     */

  }, {
    key: "mouseMove",
    value: function mouseMove(e) {
      this.stopEvent(e);
      var point = this.getCanvasPoint(e);

      if (!this.isValidEvent(point)) {
        return;
      }

      if (this.markData.markingType === MarkType.NONE) {
        if (this.performHorizontalLineEventMove(point) || this.performVerticalLineEventMove(point)) {
          this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
          return;
        }
      }

      if (this.markData.markingDatas.length === 0) {
        this.markData.startMarkPoint = point;
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
      } else if (this.markData.markingDatas.length === 1) {
        if (this.markData.markingType === MarkType.HORIZONTAL_LINE || this.markData.markingType === MarkType.VERTICAL_LINE) {
          this.markData.markingDatas[0] = point;
        } else {
          this.markData.markingDatas[1] = point;
        }

        this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
      } else if (this.markData.markingDatas.length === 2) {
        this.markData.markingDatas[1] = point;
        this.kline.freshen(FRESHEN_DRAW_LINE_CHART);
      }
    }
    /**
     * 处理鼠标移动时对水平直线的处理
     * @param point
     */

  }, {
    key: "performHorizontalLineEventMove",
    value: function performHorizontalLineEventMove(point) {
      var horizontalLineDataLength = this.markData.horizontalLineDatas.length;
      var isActive = false;

      for (var i = 0; i < horizontalLineDataLength; i++) {
        var lineData = this.markData.horizontalLineDatas[i];

        if (point.x < lineData.x + 10 && point.x > lineData.x - 10) {
          if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
            this.markData.horizontalLineDatas[i].activeType = ActiveType.POINT;
            isActive = true;
          }
        } else {
          if (point.y < lineData.y + 4 && point.y > lineData.y - 4) {
            this.markData.horizontalLineDatas[i].activeType = ActiveType.LINE;
            isActive = true;
          } else {
            this.markData.horizontalLineDatas[i].activeType = ActiveType.NONE;
          }
        }
      }

      return isActive;
    }
    /**
     * 处理鼠标移动时对水平直线的处理
     * @param point
     */

  }, {
    key: "performVerticalLineEventMove",
    value: function performVerticalLineEventMove(point) {
      var verticalLineDataLength = this.markData.verticalLineDatas.length;
      var isActive = false;

      for (var i = 0; i < verticalLineDataLength; i++) {
        var lineData = this.markData.verticalLineDatas[i];

        if (point.y < lineData.y + 10 && point.y > lineData.y - 10) {
          if (point.x < lineData.x + 10 && point.x > lineData.x - 10) {
            this.markData.verticalLineDatas[i].activeType = ActiveType.POINT;
            isActive = true;
          }
        } else {
          if (point.x < lineData.x + 4 && point.x > lineData.x - 4) {
            this.markData.verticalLineDatas[i].activeType = ActiveType.LINE;
            isActive = true;
          } else {
            this.markData.verticalLineDatas[i].activeType = ActiveType.NONE;
          }
        }
      }

      return isActive;
    }
    /**
     * 鼠标滚轮事件
     * @param e
     */

  }, {
    key: "mouseWheel",
    value: function mouseWheel(e) {
      this.stopEvent(e);
    }
    /**
     * 是否是有效事件
     * @param point
     * @returns {boolean}
     */

  }, {
    key: "isValidEvent",
    value: function isValidEvent(point) {
      return !(point.x < this.viewPortHandler.contentLeft() || point.x > this.viewPortHandler.contentRight() || point.y < this.viewPortHandler.contentTop() || point.y > this.kline.candleChart.chartTop + this.kline.candleChart.chartHeight);
    }
  }]);

  return MarkEvent;
}(Event);

/**
 * 计算均线数据
 * @param data
 * @returns {*}
 */
function calculationMa(data) {
  var ma5Num = 0.0;
  var ma10Num = 0.0;
  var ma20Num = 0.0;
  var ma60Num = 0.0;
  var ma5;
  var ma10;
  var ma20;
  var ma60;
  var totalTurnover = 0.0;
  var totalVolume = 0.0;

  for (var i = 0; i < data.length; i++) {
    totalVolume += data[i].volume;
    totalTurnover += data[i].turnover || 0;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var close = data[i].close;
    ma5Num += close;
    ma10Num += close;
    ma20Num += close;
    ma60Num += close;

    if (i < 5) {
      ma5 = ma5Num / (i + 1);
    } else {
      ma5Num -= data[i - 5].close;
      ma5 = ma5Num / 5;
    }

    if (i < 10) {
      ma10 = ma10Num / (i + 1);
    } else {
      ma10Num -= data[i - 10].close;
      ma10 = ma10Num / 10;
    }

    if (i < 20) {
      ma20 = ma20Num / (i + 1);
    } else {
      ma20Num -= data[i - 20].close;
      ma20 = ma20Num / 20;
    }

    if (i < 60) {
      ma60 = ma60Num / (i + 1);
    } else {
      ma60Num -= data[i - 60].close;
      ma60 = ma60Num / 60;
    }

    data[i].ma = {
      ma5: ma5,
      ma10: ma10,
      ma20: ma20,
      ma60: ma60
    };
  }

  return data;
}
/**
 * 计算成交量包含ma5、ma10、ma20
 *
 * @param data
 * @return
 */

function calculationVol(data) {
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }
  }

  return data;
}
function calculationChange(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i - 1]) {
      data[i].change = Number(((data[i].close - data[i - 1].close) / data[i - 1].close * 100).toFixed(2));
    }
  }

  return data;
}
/**
 * 计算MACD指标
 *
 * @param data
 * @return
 */

function calculationMacd(data) {
  // MACD：参数快线移动平均、慢线移动平均、移动平均，
  // 参数值12、26、9。
  // 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
  // ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
  // ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
  // ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0红色，小于0绿色。
  var ema12;
  var ema26;
  var oldEma12 = 0;
  var oldEma26 = 0;
  var diff = 0;
  var dea = 0;
  var oldDea = 0;
  var macd = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;

    if (i > 0) {
      ema12 = (2 * closePrice + 11 * oldEma12) / 13;
      ema26 = (2 * closePrice + 25 * oldEma26) / 27;
      diff = ema12 - ema26;
      dea = (diff * 2 + oldDea * 8) / 10;
      macd = (diff - dea) * 2;
      oldEma12 = ema12;
      oldEma26 = ema26;
      oldDea = dea;
    }

    data[i].macd = {
      diff: diff,
      dea: dea,
      macd: macd
    };
  }

  return data;
}
/**
 * 计算BOLL指标
 *
 * @param data
 * @return
 */

function calculationBoll(data) {
  var closes26 = 0; // MA

  var closes25 = 0;
  var ma; // 中轨线

  var mb;
  var md; // 标准差

  var up; // 上轨线

  var dn; // 下轨线

  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;
    closes26 += closePrice;
    closes25 += closePrice;

    if (i >= 24) {
      mb = closes25 / 25;
      closes25 -= data[i - 24].close;
    } else {
      mb = closes25 / (i + 1);
    }

    if (i >= 25) {
      ma = closes26 / 26;
      md = getBollMd(data.slice(i - 25, i + 1), ma);
      closes26 -= data[i - 25].close;
    } else {
      ma = closes26 / (i + 1);
      md = getBollMd(data.slice(0, i + 1), ma);
    }

    up = mb + 2 * md;
    dn = mb - 2 * md;
    data[i].boll = {
      up: up,
      mid: ma,
      dn: dn
    };
  }

  return data;
}
/**
 * 计算KDJ
 *
 * @param data
 * @return
 */

function calculationKdj(data) {
  var k;
  var d;
  var j; // n日内最低价

  var ln; // n日内最高价

  var hn;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    } // n日收盘价


    var cn = data[i].close;

    if (i < 8) {
      ln = getLow(data.slice(0, i + 1));
      hn = getHigh(data.slice(0, i + 1));
    } else {
      ln = getLow(data.slice(i - 8, i + 1));
      hn = getHigh(data.slice(i - 8, i + 1));
    }

    var rsv = (cn - ln) / (hn - ln === 0 ? 1 : hn - ln) * 100; // 当日K值=2/3×前一日K值+1/3×当日RSV
    // 当日D值=2/3×前一日D值+1/3×当日K值
    // 若无前一日K 值与D值，则可分别用50来代替。
    // J值=3*当日K值-2*当日D值

    k = 2.0 / 3.0 * (i < 8 ? 50.0 : data[i - 1].kdj.k) + 1.0 / 3.0 * rsv;
    d = 2.0 / 3.0 * (i < 8 ? 50.0 : data[i - 1].kdj.d) + 1.0 / 3.0 * k;
    j = 3.0 * k - 2.0 * d;
    data[i].kdj = {
      k: k,
      d: d,
      j: j
    };
  }

  return data;
}
/**
 * 计算RSI
 *
 * @param data
 * @return
 */

function calculationRsi(data) {
  // N日RSI =
  // N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
  var rsi1 = 0; // 参数6

  var rsi2 = 0; // 参数12

  var rsi3 = 0; // 参数24

  var sumCloseA = 0;
  var sumCloseB = 0;
  var a1;
  var b1;
  var oldA1 = 0;
  var oldB1 = 0;
  var a2;
  var b2;
  var oldA2 = 0;
  var oldB2 = 0;
  var a3;
  var b3;
  var oldA3 = 0;
  var oldB3 = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    if (i > 0) {
      var tmp = data[i].close - data[i - 1].close;

      if (tmp > 0) {
        sumCloseA += tmp;
      } else {
        sumCloseB += tmp;
      }

      var AA = tmp > 0 ? tmp : 0;
      var BB = Math.abs(tmp);

      if (i < 6) {
        a1 = sumCloseA / (i + 1);
        b1 = (Math.abs(sumCloseB) + sumCloseA) / (i + 1);
      } else {
        a1 = (AA + 5 * oldA1) / 6;
        b1 = (BB + 5 * oldB1) / 6;
      }

      oldA1 = a1;
      oldB1 = b1;
      rsi1 = a1 / b1 * 100;

      if (i < 12) {
        a2 = sumCloseA / (i + 1);
        b2 = (Math.abs(sumCloseB) + sumCloseA) / (i + 1);
      } else {
        a2 = (AA + 11 * oldA2) / 12;
        b2 = (BB + 11 * oldB2) / 12;
      }

      oldA2 = a2;
      oldB2 = b2;
      rsi2 = a2 / b2 * 100;

      if (i < 24) {
        a3 = sumCloseA / (i + 1);
        b3 = (Math.abs(sumCloseB) + sumCloseA) / (i + 1);
      } else {
        a3 = (AA + 23 * oldA3) / 24;
        b3 = (BB + 23 * oldB3) / 24;
      }

      oldA3 = a3;
      oldB3 = b3;
      rsi3 = a3 / b3 * 100;
    }

    data[i].rsi = {
      rsi1: rsi1,
      rsi2: rsi2,
      rsi3: rsi3
    };
  }

  return data;
}
/**
 * 计算BIAS指标
 *
 * @param data
 * @return
 */

function calculationBias(data) {
  // 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
  // 参数：6，12、24
  var bias1;
  var bias2;
  var bias3;
  var closes1 = 0;
  var closes2 = 0;
  var closes3 = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;
    closes1 += closePrice;
    closes2 += closePrice;
    closes3 += closePrice;

    if (i < 6) {
      var mean6 = closes1 / (i + 1);
      bias1 = (closePrice - mean6) / mean6 * 100;
    } else {
      closes1 -= data[i - 6].close;

      var _mean = closes1 / 6;

      bias1 = (closePrice - _mean) / _mean * 100;
    }

    if (i < 12) {
      var mean12 = closes2 / (i + 1);
      bias2 = (closePrice - mean12) / mean12 * 100;
    } else {
      closes2 -= data[i - 12].close;

      var _mean2 = closes2 / 12;

      bias2 = (closePrice - _mean2) / _mean2 * 100;
    }

    if (i < 24) {
      var mean24 = closes3 / (i + 1);
      bias3 = (closePrice - mean24) / mean24 * 100;
    } else {
      closes3 -= data[i - 24].close;

      var _mean3 = closes3 / 24;

      bias3 = (closePrice - _mean3) / _mean3 * 100;
    }

    data[i].bias = {
      bias1: bias1,
      bias2: bias2,
      bias3: bias3
    };
  }

  return data;
}
/**
 * 计算BRAR指标
 *
 * @param data
 * @return
 */

function calculationBrar(data) {
  // 参数是26。
  // 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
  // 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
  // N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
  // 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
  var br = 0;
  var ar = 0;
  var hcy = 0;
  var cyl = 0;
  var ho = 0;
  var ol = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var highestPrice = data[i].high;
    var lowestPrice = data[i].low;
    var openPrice = data[i].open;
    ho += highestPrice - openPrice;
    ol += openPrice - lowestPrice;

    if (i > 25) {
      ho -= data[i - 26].high - data[i - 26].open;
      ol -= data[i - 26].open - data[i - 26].low;
    }

    if (ol !== 0) {
      ar = ho / ol * 100;
    }

    if (i > 0) {
      var preClosePrice = data[i - 1].close;
      var highSubPreClose = highestPrice - preClosePrice;

      if (highSubPreClose < 0) {
        highSubPreClose = 0;
      }

      hcy += highSubPreClose;
      var preCloseSubLow = preClosePrice - lowestPrice;

      if (preCloseSubLow < 0) {
        preCloseSubLow = 0;
      }

      cyl += preCloseSubLow;

      if (cyl !== 0) {
        br = hcy / cyl * 100;
      }
    }

    data[i].brar = {
      br: br,
      ar: ar
    };
  }

  return data;
}
/**
 * 计算CCI指标
 *
 * @param data
 * @return
 */

function calculationCci(data) {
  // 中价与 中价的N日内移动平均 的差 除以 N日内中价的平均绝对偏差
  // 其中，中价等于最高价、最低价和收盘价之和除以3
  // ={【79-（79+62+45+90+25）/5）】
  // +【62-（79+62+45+90+25）/5）】
  // +【45-（79+62+45+90+25）/5）】
  // +【90-（79+62+45+90+25）/5）】
  // +【25-（79+62+45+90+25）/5）】}/5
  var TYPEs = 0;
  var cci;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var TYP = (data[i].high + data[i].low + data[i].close) / 3;
    TYPEs += TYP;

    if (i >= 13) {
      var TYPEsMean = TYPEs / 14;
      TYPEs -= (data[i - 13].high + data[i - 13].low + data[i - 13].close) / 3;
      var types = 0;

      for (var j = i - 13; j < i + 1; j++) {
        var typ = (data[j].high + data[j].low + data[j].close) / 3;
        types += Math.abs(typ - TYPEsMean);
      }

      var MD = types / 14;

      if (MD === 0) {
        cci = 0;
      } else {
        cci = 200 * (TYP - TYPEsMean) / 3 / MD;
      }
    } else {
      var _TYPEsMean = TYPEs / (i + 1);

      var _types = 0;

      for (var _j = 0; _j < i + 1; _j++) {
        var _typ = (data[_j].high + data[_j].low + data[_j].close) / 3;

        _types += Math.abs(_typ - _TYPEsMean);
      }

      var _MD = _types / (i + 1);

      if (_MD === 0) {
        cci = 0;
      } else {
        cci = 200 * (TYP - _TYPEsMean) / 3 / _MD;
      }
    }

    data[i].cci = {
      cci: cci
    };
  }

  return data;
}
/**
 * 计算DMI
 *
 * @param data
 * @return
 */

function calculationDmi(data) {
  // 参数 14，6
  // MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N)
  // HD :=HIGH-REF(HIGH,1);
  // LD :=REF(LOW,1)-LOW;
  // DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);
  // DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);
  //
  // PDI: DMP*100/MTR;
  // MDI: DMM*100/MTR;
  // ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);
  // ADXR:EXPMEMA(ADX,MM);
  // 公式含义：
  // MTR赋值:最高价-最低价和最高价-昨收的绝对值的较大值和昨收-最低价的绝对值的较大值的N日指数平滑移动平均
  // HD赋值:最高价-昨日最高价
  // LD赋值:昨日最低价-最低价
  // DMP赋值:如果HD>0并且HD>LD,返回HD,否则返回0的N日指数平滑移动平均
  // DMM赋值:如果LD>0并且LD>HD,返回LD,否则返回0的N日指数平滑移动平均
  // 输出PDI:DMP*100/MTR
  // 输出MDI:DMM*100/MTR
  // 输出ADX:MDI-PDI的绝对值/(MDI+PDI)*100的MM日指数平滑移动平均
  // 输出ADXR:ADX的MM日指数平滑移动平均
  var pdi = 0;
  var mdi = 0;
  var adx = 0;
  var adxr = 0;
  var HD;
  var LD;
  var refClose;
  var sumMax = [];
  var sumMaxDmp = [];
  var sumMaxDmm = [];
  var sumAdx = [];
  var sumAdxr = [];
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    if (i > 0) {
      refClose = data[i - 1].close;
      HD = data[i].high - data[i - 1].high;
      LD = data[i - 1].low - data[i].low;
      var max1 = data[i].high - data[i].low > Math.abs(data[i].high - refClose) ? data[i].high - data[i].low : Math.abs(data[i].high - refClose);
      var max2 = max1 > Math.abs(refClose) - data[i].low ? max1 : Math.abs(refClose) - data[i].low;
      sumMax.push(max2);
      var H = void 0;

      if (HD > 0 && HD > LD) {
        H = HD;
      } else {
        H = 0;
      }

      sumMaxDmp.push(H);
      var L = void 0;

      if (LD > 0 && LD > HD) {
        L = LD;
      } else {
        L = 0;
      }

      sumMaxDmm.push(L);
      var sumMax1 = 0;
      var sumMaxDmp1 = 0;
      var sumMaxDmm1 = 0;

      for (var j = 0; j < sumMax.length; j++) {
        sumMax1 += sumMax[j];
        sumMaxDmp1 += sumMaxDmp[j];
        sumMaxDmm1 += sumMaxDmm[j];
      }

      var mtr = sumMax1;
      var dmp = sumMaxDmp1;
      var dmm = sumMaxDmm1;
      pdi = dmp * 100 / mtr;
      mdi = dmm * 100 / mtr;
      var adxN1 = Math.abs(mdi - pdi) / (mdi + pdi) * 100;
      sumAdx.push(adxN1);
      var sum = 0;

      for (var _j2 = 0; _j2 < sumAdx.length; _j2++) {
        sum += sumAdx[_j2];
      }

      adx = sum / 6;
      sumAdxr.push(adx);
      var sum1 = 0;
      sum1 += sumAdxr[0];
      sum1 += sumAdxr[sumAdxr.length - 1];
      adxr = sum1 / 2;

      if (i >= 14) {
        sumMax.splice(0, 1);
        sumMaxDmp.splice(0, 1);
        sumMaxDmm.splice(0, 1);
      }

      if (i >= 19) {
        sumAdx.splice(0, 1);
      }

      if (i >= 25) {
        sumAdxr.splice(0, 1);
      }
    }

    data[i].dmi = {
      pdi: pdi,
      mdi: mdi,
      adx: adx,
      adxr: adxr
    };
  }

  return data;
}
/**
 * 计算CR
 *
 * @param data
 * @return
 */

function calculationCr(data) {
  // 参数26、10、20、40、60
  // MID:=REF(HIGH+LOW,1)/2;
  // CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
  // MA1:REF(MA(CR,M1),M1/2.5+1);
  // MA2:REF(MA(CR,M2),M2/2.5+1);
  // MA3:REF(MA(CR,M3),M3/2.5+1);
  // MA4:REF(MA(CR,M4),M4/2.5+1);
  // MID赋值:(昨日最高价+昨日最低价)/2
  // 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
  // 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
  // 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
  // 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
  // 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均
  var cr = 0;
  var ma1;
  var ma2;
  var ma3;
  var ma4;
  var p1 = 0;
  var p2 = 0;
  var ma10Sum = 0;
  var ma10;
  var ma10List = [];
  var ma20Sum = 0;
  var ma20;
  var ma20List = [];
  var ma40Sum = 0;
  var ma40;
  var ma40List = [];
  var ma60Sum = 0;
  var ma60;
  var ma60List = [];
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    if (i > 0) {
      var preHighestPrice = data[i - 1].high;
      var preLowestPrice = data[i - 1].low;
      var preClosePrice = data[i - 1].close;
      var preOpenPrice = data[i - 1].open;
      var preMidPrice = (preHighestPrice + preClosePrice + preLowestPrice + preOpenPrice) / 4;
      var highestPrice = data[i].high;
      var lowestPrice = data[i].low;
      var highSubPreMid = highestPrice - preMidPrice;

      if (highSubPreMid < 0) {
        highSubPreMid = 0;
      }

      p1 += highSubPreMid;
      var preMidSubLow = preMidPrice - lowestPrice;

      if (preMidSubLow < 0) {
        preMidSubLow = 0;
      }

      p2 += preMidSubLow;

      if (i > 26) {
        var firstHighestPrice = data[i - 27].high;
        var firstLowestPrice = data[i - 27].low;
        var firstClosePrice = data[i - 27].close;
        var firstOpenPrice = data[i - 27].open;
        var firstMidPrice = (firstHighestPrice + firstLowestPrice + firstClosePrice + firstOpenPrice) / 4;
        var secondHighestPrice = data[i - 26].high;
        var secondLowestPrice = data[i - 26].low;
        var secondHighSubFirstMid = secondHighestPrice - firstMidPrice;

        if (secondHighSubFirstMid < 0) {
          secondHighSubFirstMid = 0;
        }

        var firstMidSubSecondLow = firstMidPrice - secondLowestPrice;

        if (firstMidSubSecondLow < 0) {
          firstMidSubSecondLow = 0;
        }

        p1 -= secondHighSubFirstMid;
        p2 -= firstMidSubSecondLow;
      }

      if (p2 !== 0) {
        cr = p1 / p2 * 100;
      }

      var YM = (data[i - 1].high + data[i - 1].low + data[i - 1].close) / 3;
      var HYM = data[i].high - YM;
      p1 += HYM <= 0 ? 0 : HYM;
      var LYM = YM - data[i].low;
      p2 += LYM <= 0 ? 0 : LYM;
    }

    ma10Sum += cr;
    ma20Sum += cr;
    ma40Sum += cr;
    ma60Sum += cr;

    if (i < 10) {
      ma10 = ma10Sum / (i + 1);
    } else {
      ma10Sum -= data[i - 10].cr.cr;
      ma10 = ma10Sum / 10;
    }

    ma10List.push(ma10);

    if (i < 20) {
      ma20 = ma20Sum / (i + 1);
    } else {
      ma20Sum -= data[i - 20].cr.cr;
      ma20 = ma20Sum / 20;
    }

    ma20List.push(ma20);

    if (i < 40) {
      ma40 = ma40Sum / (i + 1);
    } else {
      ma40Sum -= data[i - 40].cr.cr;
      ma40 = ma40Sum / 40;
    }

    ma40List.push(ma40);

    if (i < 60) {
      ma60 = ma60Sum / (i + 1);
    } else {
      ma60Sum -= data[i - 60].cr.cr;
      ma60 = ma60Sum / 60;
    }

    ma60List.push(ma60);

    if (i < 5) {
      ma1 = ma10List[0];
    } else {
      ma1 = ma10List[i - 5];
    }

    if (i < 9) {
      ma2 = ma20List[0];
    } else {
      ma2 = ma20List[i - 9];
    }

    if (i < 17) {
      ma3 = ma40List[0];
    } else {
      ma3 = ma40List[i - 17];
    }

    if (i < 25) {
      ma4 = ma60List[0];
    } else {
      ma4 = ma60List[i - 25];
    }

    data[i].cr = {
      cr: cr,
      ma1: ma1,
      ma2: ma2,
      ma3: ma3,
      ma4: ma4
    };
  }

  return data;
}
/**
 * 计算PSY
 *
 * @param data
 * @return
 */

function calculationPsy(data) {
  // PSY：参数是12。公式：PSY=N日内的上涨天数/N×100%。
  var psy = 0;
  var upDay = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    if (i > 0) {
      upDay += data[i].close - data[i - 1].close > 0 ? 1 : 0;

      if (i >= 12) {
        psy = upDay / 12 * 100;
        upDay -= data[i - 11].close - data[i - 12].close > 0 ? 1 : 0;
      } else {
        psy = upDay / i * 100;
      }
    }

    data[i].psy = {
      psy: psy
    };
  }

  return data;
}
/**
 * 计算DMA
 *
 * @param data
 * @return
 */

function calculationDma(data) {
  // 参数是10、50、10。公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
  var dif;
  var difMa;
  var ma10s = 0;
  var ma10;
  var ma50s = 0;
  var ma50;
  var dif10s = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;
    ma10s += closePrice;
    ma50s += closePrice;

    if (i < 10) {
      ma10 = ma10s / (i + 1);
    } else {
      ma10s -= data[i - 10].close;
      ma10 = ma10s / 10;
    }

    if (i < 50) {
      ma50 = ma50s / (i + 1);
    } else {
      ma50s -= data[i - 50].close;
      ma50 = ma50s / 50;
    }

    dif = ma10 - ma50;
    dif10s += dif;

    if (i < 10) {
      difMa = dif10s / (i + 1);
    } else {
      dif10s -= data[i - 10].dma.dif;
      difMa = dif10s / 10;
    }

    data[i].dma = {
      dif: dif,
      difMa: difMa
    };
  }

  return data;
}
/**
 * 计算TRIX
 *
 * @param data
 * @return
 */

function calculationTrix(data) {
  // TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
  // TRIX=(TR-昨日TR)/昨日TR*100；
  // MATRIX=TRIX的M日简单移动平均；
  // 参数N设为12，参数M设为20；
  // 参数12、20
  // 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
  // TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
  // TRMA:MA(TRIX,M)
  var trix = 0;
  var maTrix;
  var sumTrix = 0;
  var sumClose = 0;
  var emaClose;
  var oldEmaClose = 0;
  var sumEmaClose = 0;
  var ema2;
  var oldEma2 = 0;
  var sumEma2 = 0;
  var ema3;
  var oldEma3 = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;
    sumClose += closePrice;

    if (i < 12) {
      emaClose = sumClose / (i + 1);
    } else {
      emaClose = (closePrice * 2 + oldEmaClose * 11) / 13;
    }

    oldEmaClose = emaClose;
    sumEmaClose += emaClose;

    if (i < 12) {
      ema2 = sumEmaClose / (i + 1);
    } else {
      ema2 = (emaClose * 2 + oldEma2 * 11) / 13;
    }

    oldEma2 = ema2;
    sumEma2 += ema2;

    if (i < 12) {
      ema3 = sumEma2 / (i + 1);
    } else {
      ema3 = (ema2 * 2 + oldEma3 * 11) / 13;
    }

    if (oldEma3 !== 0) {
      trix = (ema3 - oldEma3) / oldEma3 * 100;
    }

    sumTrix += trix;
    oldEma3 = ema3;

    if (i < 20) {
      maTrix = sumTrix / (i + 1);
    } else {
      maTrix = sumTrix / 20;
      sumTrix -= data[i - 19].trix.trix;
    }

    data[i].trix = {
      trix: trix,
      maTrix: maTrix
    };
  }

  return data;
}
/**
 * 计算obv指标
 * 计算公式： V × [（C - L）- （H - C）]/（H - C）
 * V: 成交量, C: 收盘价， L: 最低价, H: 最高价
 * @param data
 * @return
 */

function calculationObv(data) {
  var sumObv = 0;
  var maObv;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;
    var highestPrice = data[i].high;
    var highSubClose = highestPrice - closePrice;
    var obv = data[i].volume * (closePrice - data[i].low - highSubClose) / highestPrice;
    sumObv += obv;

    if (i < 30) {
      maObv = sumObv / (i + 1);
    } else {
      sumObv = sumObv - data[i - 30].obv.obv;
      maObv = sumObv / 30;
    }

    data[i].obv = {
      obv: obv,
      maObv: maObv
    };
  }

  return data;
}
/**
 * 计算vr指标
 * 默认参数24 ， 30
 * VR=（AVS+1/2CVS）/（BVS+1/2CVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为AVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为BVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为CVS
 * @param data
 * @return
 */

function calculationVr(data) {
  var avs = 0;
  var bvs = 0;
  var cvs = 0;
  var vr = 0;
  var maVr;
  var sumVr = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    if (i < 24) {
      var closePrice = data[i].close;
      var openPrice = data[i].open;
      var volume = data[i].volume;

      if (closePrice > openPrice) {
        avs += volume;
      } else if (closePrice < openPrice) {
        bvs += volume;
      } else {
        cvs += volume;
      }
    } else {
      for (var j = i - 24; j < i; j++) {
        var _closePrice = data[j].close;
        var _openPrice = data[j].open;
        var _volume = data[j].volume;

        if (j === i - 24) {
          avs = 0;
          bvs = 0;
          cvs = 0;
        }

        if (_closePrice > _openPrice) {
          avs += _volume;
        } else if (_closePrice < _openPrice) {
          bvs += _volume;
        } else {
          cvs += _volume;
        }
      }
    }

    var v = bvs + 1 / 2 * cvs;

    if (v !== 0) {
      vr = (avs + 1 / 2 * cvs) / v * 100;
    }

    sumVr += vr;

    if (i < 30) {
      maVr = sumVr / (i + 1);
    } else {
      sumVr -= data[i - 30].vr.vr;
      maVr = sumVr / 30;
    }

    data[i].vr = {
      vr: vr,
      maVr: maVr
    };
  }

  return data;
}
/**
 * 计算wr指标
 * 默认参数13 34 89
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 * @param data
 * @return
 */

function calculationWr(data) {
  var wr1 = 0;
  var wr2 = 0;
  var wr3 = 0;
  var wr1HighestPrice = Number.MIN_VALUE;
  var wr1LowestPrice = Number.MAX_VALUE;
  var wr2HighestPrice = Number.MIN_VALUE;
  var wr2LowestPrice = Number.MAX_VALUE;
  var wr3HighestPrice = Number.MIN_VALUE;
  var wr3LowestPrice = Number.MAX_VALUE;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;

    if (i < 13) {
      var highPrice = data[i].high;
      var lowPrice = data[i].low;
      wr1HighestPrice = Math.max(highPrice, wr1HighestPrice);
      wr1LowestPrice = Math.min(lowPrice, wr1LowestPrice);
      wr2HighestPrice = Math.max(highPrice, wr2HighestPrice);
      wr2LowestPrice = Math.min(lowPrice, wr2LowestPrice);
      wr3HighestPrice = Math.max(highPrice, wr3HighestPrice);
      wr3LowestPrice = Math.min(lowPrice, wr3LowestPrice);
      var highSubLow = wr1HighestPrice - wr1LowestPrice;

      if (highSubLow !== 0) {
        wr1 = (wr1HighestPrice - closePrice) / highSubLow * 100;
      }

      wr2 = wr1;
      wr3 = wr1;
    } else {
      for (var j = i - 13; j < i; j++) {
        if (j === i - 13) {
          wr1HighestPrice = data[j].high;
          wr1LowestPrice = data[j].low;
        } else {
          wr1HighestPrice = Math.max(data[j].high, wr1HighestPrice);
          wr1LowestPrice = Math.min(data[j].low, wr1LowestPrice);
        }

        var _highSubLow = wr1HighestPrice - wr1LowestPrice;

        if (_highSubLow !== 0) {
          wr1 = (wr1HighestPrice - closePrice) / _highSubLow * 100;
        }
      }

      if (i < 34) {
        var _highPrice = data[i].high;
        var _lowPrice = data[i].low;
        wr2HighestPrice = Math.max(_highPrice, wr2HighestPrice);
        wr2LowestPrice = Math.min(_lowPrice, wr2LowestPrice);
        wr3HighestPrice = Math.max(_highPrice, wr3HighestPrice);
        wr3LowestPrice = Math.min(_lowPrice, wr3LowestPrice);

        var _highSubLow2 = wr2HighestPrice - wr2LowestPrice;

        if (_highSubLow2 !== 0) {
          wr2 = (wr2HighestPrice - closePrice) / _highSubLow2 * 100;
        }

        wr3 = wr2;
      } else {
        for (var _j3 = i - 34; _j3 < i; _j3++) {
          if (_j3 === i - 34) {
            wr2HighestPrice = data[_j3].high;
            wr2LowestPrice = data[_j3].low;
          } else {
            wr2HighestPrice = Math.max(data[_j3].high, wr2HighestPrice);
            wr2LowestPrice = Math.min(data[_j3].low, wr2LowestPrice);
          }

          var _highSubLow3 = wr2HighestPrice - wr2LowestPrice;

          if (_highSubLow3 !== 0) {
            wr2 = (wr2HighestPrice - closePrice) / _highSubLow3 * 100;
          }
        }

        if (i < 89) {
          var _highPrice2 = data[i].high;
          var _lowPrice2 = data[i].low;
          wr3HighestPrice = Math.max(_highPrice2, wr3HighestPrice);
          wr3LowestPrice = Math.min(_lowPrice2, wr3LowestPrice);

          var _highSubLow4 = wr3HighestPrice - wr3LowestPrice;

          if (_highSubLow4 !== 0) {
            wr3 = (wr3HighestPrice - closePrice) / _highSubLow4 * 100;
          }
        } else {
          for (var _j4 = i - 89; _j4 < i; _j4++) {
            if (_j4 === i - 89) {
              wr3HighestPrice = data[_j4].high;
              wr3LowestPrice = data[_j4].low;
            } else {
              wr3HighestPrice = Math.max(data[_j4].high, wr3HighestPrice);
              wr3LowestPrice = Math.min(data[_j4].low, wr3LowestPrice);
            }

            var _highSubLow5 = wr3HighestPrice - wr3LowestPrice;

            if (_highSubLow5 !== 0) {
              wr3 = (wr3HighestPrice - closePrice) / _highSubLow5 * 100;
            }
          }
        }
      }
    }

    data[i].wr = {
      wr1: wr1,
      wr2: wr2,
      wr3: wr3
    };
  }

  return data;
}
/**
 * 计算mtm指标
 * 默认参数6 10
 * 公式 MTM（N日）=C－CN
 * @param data
 * @return
 */

function calculationMtm(data) {
  var mtm;
  var mtmSum = 0;
  var mtmMa;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    var closePrice = data[i].close;

    if (i < 6) {
      mtm = closePrice - data[0].close;
    } else {
      mtm = closePrice - data[i - 6].close;
    }

    mtmSum += mtm;

    if (i < 10) {
      mtmMa = mtmSum / (i + 1);
    } else {
      mtmSum -= data[i - 10].mtm.mtm;
      mtmMa = mtmSum / 10;
    }

    data[i].mtm = {
      mtm: mtm,
      mtmMa: mtmMa
    };
  }

  return data;
}
/**
 * 简易波动指标
 * 默认参数N为14，参数M为9
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 * @param data
 * @return
 */

function calculationEmv(data) {
  var emv = 0;
  var maEmv;
  var sumEmv = 0;
  var em = 0;
  var emList = [];
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    }

    if (i > 0) {
      var highestPrice = data[i].high;
      var lowestPrice = data[i].low;
      var preHighestPrice = data[i - 1].high;
      var preLowestPrice = data[i - 1].low;
      var highSubLow = highestPrice - lowestPrice;
      var halfHighAddLow = (highestPrice + lowestPrice) / 2;
      var preHalfHighAddLow = (preHighestPrice + preLowestPrice) / 2;
      em = (halfHighAddLow - preHalfHighAddLow) * highSubLow / turnover;
    }

    emList.push(em);

    if (i < 14) {
      emv += em;
    } else {
      emv -= emList[i - 14];
    }

    sumEmv += emv;

    if (i < 9) {
      maEmv = sumEmv / (i + 1);
    } else {
      sumEmv -= data[i - 9].emv.emv;
      maEmv = sumEmv / 9;
    }

    data[i].emv = {
      emv: emv,
      maEmv: maEmv
    };
  }

  return data;
}
/**
 * 计算sar
 * @param data
 * @return
 */

function calculationSar(data) {
  // 加速因子
  var af = 0; // 极值

  var ep = -100; // 判断是上涨还是下跌  false：下跌

  var isIncreasing = false;
  var sar = 0;
  var totalTurnover = 0;
  var totalVolume = 0;

  for (var i = 0; i < data.length; i++) {
    var turnover = data[i].turnover;
    totalVolume += data[i].volume;
    totalTurnover += turnover;

    if (totalVolume !== 0) {
      data[i].averagePrice = totalTurnover / totalVolume;
    } // 上一个周期的sar


    var preSar = sar;
    var highestPrice = data[i].high;
    var lowestPrice = data[i].low;

    if (isIncreasing) {
      // 上涨
      if (ep === -100 || ep < highestPrice) {
        // 重新初始化值
        ep = highestPrice;
        af = Math.min(af + 0.02, 2);
      }

      sar = preSar + af * (ep - preSar);
      var lowestPriceMin = Math.min(data[Math.max(1, i) - 1].low, lowestPrice);

      if (sar > data[i].low) {
        sar = ep; // 重新初始化值

        af = 0;
        ep = -100;
        isIncreasing = !isIncreasing;
      } else if (sar > lowestPriceMin) {
        sar = lowestPriceMin;
      }
    } else {
      if (ep === -100 || ep > lowestPrice) {
        // 重新初始化值
        ep = lowestPrice;
        af = Math.min(af + 0.02, 0.2);
      }

      sar = preSar + af * (ep - preSar);
      var highestPriceMax = Math.max(data[Math.max(1, i) - 1].high, highestPrice);

      if (sar < data[i].high) {
        sar = ep; // 重新初始化值

        af = 0;
        ep = -100;
        isIncreasing = !isIncreasing;
      } else if (sar < highestPriceMax) {
        sar = highestPriceMax;
      }
    }

    data[i].sar = {
      sar: sar
    };
  }

  return data;
}
/**
 * 计算布林指标中的标准差
 *
 * @param list
 * @param ma
 * @return
 */

function getBollMd(list, ma) {
  var sum = 0;

  for (var i = 0; i < list.length; i++) {
    var closeMa = list[i].close - ma;
    sum += closeMa * closeMa;
  }

  var b = sum > 0;
  sum = Math.abs(sum);
  var md = Math.sqrt(sum / list.length);
  return b ? md : -1 * md;
}
/**
 * 获取list中的最大的最高价
 *
 * @param list
 * @return
 */


function getHigh(list) {
  var high = 0;

  if (list && list.length > 0) {
    var size = list.length;
    high = list[0].high;

    for (var i = 1; i < size; i++) {
      high = Math.max(list[i].high, high);
    }
  }

  return high;
}
/**
 * 获取list中的最小的最低价
 *
 * @param list
 * @return
 */


function getLow(list) {
  var low = 0;

  if (list && list.length > 0) {
    var size = list.length;
    low = list[0].low;

    for (var i = 1; i < size; i++) {
      low = Math.min(list[i].low, low);
    }
  }

  return low;
}

var FRESHEN_ALL = "all";
var FRESHEN_TOOLTIP = "tooltip";
var FRESHEN_CHART = "chart";
var FRESHEN_CANDLE_CHART = "candle_chart";
var FRESHEN_VOL_CHART = "vol_chart";
var FRESHEN_INDICATOR_CHART = "indicator_chart";
var FRESHEN_DRAW_LINE_CHART = "draw_line_chart";

var KLineChart =
/*#__PURE__*/
function () {
  function KLineChart(dom) {
    _classCallCheck(this, KLineChart);

    this.rootDom = dom;
    this.chartCanvasDom = null;
    this.chartCanvas = null;
    this.tooltipCanvasDom = null;
    this.tooltipCanvas = null;
    this.markCanvasDom = null;
    this.markCanvas = null;
    this.viewPortHandler = new ViewPortHandler();
    this.dataBounds = new DataBounds(this.viewPortHandler);
    this.grid = new Grid();
    this.yAxis = new YAxis();
    this.xAxis = new XAxis();
    this.candle = new Candle();
    this.indicator = new Indicator();
    this.tooltip = new Tooltip();
    this.gridChart = new GridChart(this.grid, this.dataBounds, this.viewPortHandler);
    this.candleChart = new CandleChart(this.candle, this.indicator, this.yAxis, this.dataBounds, this.viewPortHandler);
    this.volChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler, IndicatorType.VOL);
    this.indicatorChart = new IndicatorChart(this.indicator, this.xAxis, this.yAxis, this.dataBounds, this.viewPortHandler, IndicatorType.NO);
    this.xAxisChart = new XAxisChart(this.xAxis, this.dataBounds, this.viewPortHandler);
    this.tooltipChart = new TooltipChart(this.tooltip, this.candle, this.indicator, this.xAxis, this.yAxis, this.candleChart, this.volChart, this.indicatorChart, this.dataBounds, this.viewPortHandler);
    this.mark = new DrawLine();
    this.markData = new MarkData();
    this.markChart = new MarkChart(this.mark, this.markData, this.dataBounds, this.viewPortHandler); // 是否需要计算整个绘图区域的尺寸

    this.isShouldCalcOffset = true; // 是否需要计算图的高度

    this.isShouldCalcChartHeight = true;
    this.init();
  }
  /**
   * 初始化
   */


  _createClass(KLineChart, [{
    key: "init",
    value: function init() {
      this.chartCanvasDom = document.createElement("canvas");
      this.initCanvas(this.chartCanvasDom);
      this.chartCanvas = this.chartCanvasDom.getContext("2d");
      this.markCanvasDom = document.createElement("canvas");
      this.initCanvas(this.markCanvasDom);
      this.markCanvas = this.markCanvasDom.getContext("2d");
      this.tooltipCanvasDom = document.createElement("canvas");
      this.initCanvas(this.tooltipCanvasDom);
      this.tooltipCanvas = this.tooltipCanvasDom.getContext("2d");
      this.initEvent();
      this.resize();
    }
    /**
     * 初始化画布
     */

  }, {
    key: "initCanvas",
    value: function initCanvas(canvasDom) {
      canvasDom.style.position = "absolute";
      canvasDom.style.top = "0";
      canvasDom.style.right = "0";
      canvasDom.style.bottom = "0";
      canvasDom.style.left = "0";
      this.rootDom.appendChild(canvasDom);
    }
    /**
     * 初始化事件
     */

  }, {
    key: "initEvent",
    value: function initEvent() {
      var _this = this;

      try {
        var isMobile = /Android|webOS|iPhone|iPod|BlackBerry|UCBrowser/i.test(navigator.userAgent);

        if (isMobile) {
          var motionEvent = new TouchEvent(this, this.dataBounds, this.viewPortHandler);

          this.tooltipCanvasDom.ontouchstart = function (e) {
            motionEvent.touchStart(e);
          };

          this.tooltipCanvasDom.ontouchmove = function (e) {
            motionEvent.touchMove(e);
          };

          this.tooltipCanvasDom.ontouchend = function (e) {
            motionEvent.touchEnd(e);
          };
        } else {
          var _motionEvent = new MouseEvent(this, this.dataBounds, this.viewPortHandler);

          this.markEvent = new MarkEvent(this, this.markData, this.dataBounds, this.viewPortHandler);

          this.tooltipCanvasDom.onmousedown = function (e) {
            _motionEvent.mouseDown(e);

            _this.markEvent.mouseDown(e);
          };

          this.tooltipCanvasDom.onmouseup = function (e) {
            _motionEvent.mouseUp(e);
          };

          this.tooltipCanvasDom.onmousemove = function (e) {
            _motionEvent.mouseMove(e);

            _this.markEvent.mouseMove(e);
          };

          this.tooltipCanvasDom.onmouseleave = function (e) {
            _motionEvent.mouseLeave(e);
          };

          this.tooltipCanvasDom.onwheel = function (e) {
            _motionEvent.mouseWheel(e);
          };

          this.tooltipCanvasDom.oncontextmenu = function () {
            return false;
          };

          this.markCanvasDom.onmousedown = function (e) {
            _this.markEvent.mouseDown(e);
          };

          this.markCanvasDom.onmouseup = function (e) {
            _this.markEvent.mouseUp(e);
          };

          this.markCanvasDom.onmousemove = function (e) {
            _this.markEvent.mouseMove(e);
          };

          this.markCanvasDom.onmouseleave = function (e) {
            _this.markEvent.mouseLeave(e);
          };

          this.markCanvasDom.onwheel = function (e) {
            _this.markEvent.mouseWheel(e);
          };

          this.markCanvasDom.oncontextmenu = function () {
            return false;
          };
        }
      } catch (e) {
        return e;
      }
    }
    /**
     * 计算图表高度
     */

  }, {
    key: "calcChartHeight",
    value: function calcChartHeight(domHeight) {
      var chartHeight = domHeight;
      var isDisplayVolChart = this.volChart.isDisplayChart();
      var isDisplayIndicatorChart = this.indicatorChart.isDisplayChart();
      var volChartHeight = 0;
      var indicatorChartHeight = 0;

      if (isDisplayVolChart && isDisplayIndicatorChart) {
        var height = parseInt(chartHeight * 0.25);
        volChartHeight = height;
        indicatorChartHeight = height;
      } else if (isDisplayVolChart && !isDisplayIndicatorChart) {
        volChartHeight = parseInt(chartHeight * 0.25);
      } else if (!isDisplayVolChart && isDisplayIndicatorChart) {
        indicatorChartHeight = parseInt(chartHeight * 0.25);
      }

      var candleChartHeight = chartHeight - volChartHeight - indicatorChartHeight - 25;
      var contentTop = 0;
      this.candleChart.setChartDimens(candleChartHeight, contentTop);
      this.markChart.setChartDimens(candleChartHeight, contentTop);
      contentTop += candleChartHeight;
      this.volChart.setChartDimens(volChartHeight, contentTop);
      contentTop += volChartHeight;
    }
    /**
     * 计算不包括x轴y轴的绘制区域的尺寸
     */

  }, {
    key: "calcOffsets",
    value: function calcOffsets() {
      var offsetLeft = 0;
      var offsetRight = 0;
      var offsetTop = 0;
      var offsetBottom = 0;

      if (this.yAxis.needsOffset()) {
        // 计算y轴最大宽度
        var yAxisRequireWidthSpace = this.yAxis.getRequiredWidthSpace();

        if (this.yAxis.yAxisPosition === YAxisPosition.LEFT) {
          offsetLeft += yAxisRequireWidthSpace;
        } else {
          offsetRight += yAxisRequireWidthSpace;
        }
      }

      offsetBottom += this.xAxis.getRequiredHeightSpace() - 12;
      this.viewPortHandler.restrainViewPort(offsetLeft, offsetTop, offsetRight, offsetBottom);
    }
    /**
     * 设置canvas尺寸
     * @param dom
     * @param rootDomWidth
     * @param rootDomHeight
     */

  }, {
    key: "setCanvasDomSize",
    value: function setCanvasDomSize(dom, rootDomWidth, rootDomHeight) {
      dom.width = rootDomWidth * 2;
      dom.height = rootDomHeight * 2;
      dom.style.width = rootDomWidth + "px";
      dom.style.height = rootDomHeight + "px";
    }
    /**
     * 清空canvas
     * @param freshenType
     * @param rootDomWidth
     * @param rootDomHeight
     */

  }, {
    key: "clearCanvasRect",
    value: function clearCanvasRect(freshenType, rootDomWidth, rootDomHeight) {
      // 根据刷新类型来清空画布区域
      switch (freshenType) {
        case FRESHEN_CHART:
          {
            this.chartCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
            break;
          }

        case FRESHEN_TOOLTIP:
          {
            this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
            break;
          }

        case FRESHEN_ALL:
          {
            this.chartCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
            this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
            break;
          }

        case FRESHEN_CANDLE_CHART:
          {
            this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
            this.chartCanvas.clearRect(0, this.candleChart.chartTop, rootDomWidth * 2, this.candleChart.chartHeight);
            break;
          }

        case FRESHEN_VOL_CHART:
          {
            if (this.volChart.isDisplayChart()) {
              this.chartCanvas.clearRect(0, this.volChart.chartTop, rootDomWidth * 2, this.volChart.chartHeight);
            }

            break;
          }

        case FRESHEN_INDICATOR_CHART:
          {
            if (this.indicatorChart.isDisplayChart()) {
              this.tooltipCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
              this.chartCanvas.clearRect(0, this.indicatorChart.chartTop, rootDomWidth * 2, this.indicatorChart.chartHeight);
            }

            break;
          }

        case FRESHEN_DRAW_LINE_CHART:
          {
            this.markCanvas.clearRect(0, 0, rootDomWidth * 2, rootDomHeight * 2);
          }
      }
    }
    /**
     * 刷新
     * @param freshenType 刷新类型
     */

  }, {
    key: "freshen",
    value: function freshen() {
      var freshenType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : FRESHEN_ALL;
      var rootDomWidth = this.rootDom.offsetWidth;
      var rootDomHeight = this.rootDom.offsetHeight;
      this.clearCanvasRect(freshenType, rootDomWidth, rootDomHeight);

      if (this.isShouldCalcChartHeight) {
        this.calcChartHeight(rootDomHeight * 2);
        this.isShouldCalcChartHeight = false;
      }

      if (this.isShouldCalcOffset) {
        this.setCanvasDomSize(this.chartCanvasDom, rootDomWidth, rootDomHeight);
        this.setCanvasDomSize(this.markCanvasDom, rootDomWidth, rootDomHeight);
        this.setCanvasDomSize(this.tooltipCanvasDom, rootDomWidth, rootDomHeight);
        this.viewPortHandler.setChartDimens(rootDomWidth * 2, rootDomHeight * 2);
        this.calcOffsets();
        this.isShouldCalcOffset = false;
      }

      this.draw(freshenType);
    }
    /**
     * 绘制图
     */

  }, {
    key: "draw",
    value: function draw(freshenType) {
      this.dataBounds.space();

      if (freshenType === FRESHEN_VOL_CHART) {
        this.volChart.draw(this.chartCanvas);
      } else if (freshenType === FRESHEN_INDICATOR_CHART) {
        this.indicatorChart.draw(this.chartCanvas);
        this.tooltipChart.draw(this.tooltipCanvas);
      } else if (freshenType === FRESHEN_CANDLE_CHART) {
        this.candleChart.draw(this.chartCanvas);
        this.tooltipChart.draw(this.tooltipCanvas);
      } else if (freshenType === FRESHEN_DRAW_LINE_CHART) {
        this.markChart.draw(this.markCanvas);
      } else {
        if (freshenType === FRESHEN_CHART || freshenType === FRESHEN_ALL) {
          this.gridChart.draw(this.chartCanvas);
          this.xAxisChart.draw(this.chartCanvas);
          this.candleChart.draw(this.chartCanvas);
          this.volChart.draw(this.chartCanvas);
          this.indicatorChart.draw(this.chartCanvas);
        }

        if (freshenType === FRESHEN_TOOLTIP || freshenType === FRESHEN_ALL) {
          this.tooltipChart.draw(this.tooltipCanvas);
        }
      }
    }
    /**
     * 计算指标数据
     * @param indicatorType
     * @param freshenType
     * @returns {Promise<void>}
     */

  }, {
    key: "calcIndicator",
    value: function calcIndicator(indicatorType) {
      var _this2 = this;

      var freshenType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FRESHEN_CHART;
      Promise.resolve().then(function () {
        try {
          switch (indicatorType) {
            case IndicatorType.MA:
              {
                _this2.dataBounds.dataList = calculationMa(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.MACD:
              {
                _this2.dataBounds.dataList = calculationMacd(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.VOL:
              {
                _this2.dataBounds.dataList = calculationVol(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.BOLL:
              {
                _this2.dataBounds.dataList = calculationBoll(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.BIAS:
              {
                _this2.dataBounds.dataList = calculationBias(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.BRAR:
              {
                _this2.dataBounds.dataList = calculationBrar(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.CCI:
              {
                _this2.dataBounds.dataList = calculationCci(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.CR:
              {
                _this2.dataBounds.dataList = calculationCr(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.DMA:
              {
                _this2.dataBounds.dataList = calculationDma(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.DMI:
              {
                _this2.dataBounds.dataList = calculationDmi(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.KDJ:
              {
                _this2.dataBounds.dataList = calculationKdj(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.KD:
              {
                _this2.dataBounds.dataList = calculationKdj(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.RSI:
              {
                _this2.dataBounds.dataList = calculationRsi(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.PSY:
              {
                _this2.dataBounds.dataList = calculationPsy(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.TRIX:
              {
                _this2.dataBounds.dataList = calculationTrix(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.OBV:
              {
                _this2.dataBounds.dataList = calculationObv(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.VR:
              {
                _this2.dataBounds.dataList = calculationVr(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.WR:
              {
                _this2.dataBounds.dataList = calculationWr(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.MTM:
              {
                _this2.dataBounds.dataList = calculationMtm(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.EMV:
              {
                _this2.dataBounds.dataList = calculationEmv(_this2.dataBounds.dataList);
                break;
              }

            case IndicatorType.SAR:
              {
                _this2.dataBounds.dataList = calculationSar(_this2.dataBounds.dataList);
                break;
              }
          }

          _this2.freshen(freshenType);
        } catch (e) {
          return e;
        }
      });
    }
    /**
     * 计算各图指标
     */

  }, {
    key: "calcChartIndicator",
    value: function calcChartIndicator() {
      var isDisplayCandleIndicator = this.candleChart.isDisplayChart();
      var isDisplayVol = this.volChart.isDisplayChart();
      var isDisplayIndicator = this.indicatorChart.isDisplayChart();
      this.dataBounds.dataList = calculationChange(this.dataBounds.dataList);

      if (isDisplayCandleIndicator) {
        this.calcIndicator(this.candleChart.indicatorType);
      }

      if (isDisplayVol) {
        this.calcIndicator(IndicatorType.VOL);
      }

      if (isDisplayIndicator) {
        this.calcIndicator(this.indicatorChart.indicatorType);
      }
    }
    /**
     * 检查数据是否合法
     * @param data
     */

  }, {
    key: "checkData",
    value: function checkData(data) {
      if (_typeof(data) !== "object" || data.open === null || data.open === undefined || data.close === null || data.close === undefined || data.high === null || data.high === undefined || data.low === null || data.low === undefined || data.timestamp === null || data.timestamp === undefined || data.volume === null || data.volume === undefined || data.turnover === null || data.turnover === undefined) {
        throw new Error("The data must be object and need to contain open, close, high, low, timestamp, volume, and turnover fields");
      }
    }
    /**
     * 改变尺寸
     */

  }, {
    key: "resize",
    value: function resize() {
      this.isShouldCalcOffset = true;
      this.freshen();
    }
    /**
     * 设置配置
     * @param config
     */

  }, {
    key: "setConfig",
    value: function setConfig(config) {
      if (config) {
        var common = config.common;

        if (common) {
          if (common.minVisibleRange > 0) {
            this.dataBounds.minRange = common.minVisibleRange;
          }

          if (common.maxVisibleRange > 0 && common.maxVisibleRange > this.dataBounds.minRange) {
            this.dataBounds.maxRange = common.maxVisibleRange;
          }

          if (common.defaultVisibleRange > 0 && common.defaultVisibleRange > this.dataBounds.minRange - 1 && common.defaultVisibleRange < this.dataBounds.maxRange + 1) {
            this.dataBounds.range = common.defaultVisibleRange;
          }
        }

        var grid = config.grid;

        if (grid) {
          if (grid.display !== undefined) {
            this.grid.display = grid.display;
          }

          if (grid.lineSize > 0) {
            this.grid.lineSize = grid.lineSize;
          }

          if (grid.lineColor) {
            this.grid.lineColor = grid.lineColor;
          }
        }

        var candle = config.candle;

        if (candle) {
          if (candle.chartType) {
            this.candle.chartStyle = candle.chartType;
          }

          if (candle.timeChart) {
            this.candle.timeChart = _objectSpread2({}, this.candle.timeChart, {}, candle.timeChart);
          }

          if (candle.candleChart) {
            this.candle.candleChart = _objectSpread2({}, this.candle.candleChart, {}, candle.candleChart);
          }

          if (candle.lowestHighestPriceMarkTextColor) {
            this.candle.lowestHighestPriceMarkTextColor = candle.lowestHighestPriceMarkTextColor;
          }

          if (candle.lowestHighestPriceMarkTextSize > 0) {
            this.candle.lowestHighestPriceMarkTextSize = candle.lowestHighestPriceMarkTextSize;
          }

          this.candle.lowestHighestValueFormatter = candle.lowestHighestValueFormatter;

          if (candle.highestPriceMark) {
            this.candle.highestPriceMark = _objectSpread2({}, this.candle.highestPriceMark, {}, candle.highestPriceMark);
          }

          if (candle.lowestPriceMark) {
            this.candle.lowestPriceMark = _objectSpread2({}, this.candle.lowestPriceMark, {}, candle.lowestPriceMark);
          }

          if (candle.lastPriceMark) {
            this.candle.lastPriceMark = _objectSpread2({}, this.candle.lastPriceMark, {}, candle.lastPriceMark);
          }
        }

        var indicator = config.indicator;

        if (indicator) {
          if (indicator.lineSize > 0) {
            this.indicator.lineSize = indicator.lineSize;
          }

          if (indicator.increasingColor) {
            this.indicator.increasingColor = indicator.increasingColor;
          }

          if (indicator.decreasingColor) {
            this.indicator.decreasingColor = indicator.decreasingColor;
          }

          if (indicator.lineColors && indicator.lineColors.length > 4) {
            this.indicator.lineColors = indicator.lineColors;
          }
        }

        var xAxis = config.xAxis;

        if (xAxis) {
          if (xAxis.display !== null && xAxis.display !== undefined) {
            this.xAxis.display = xAxis.display;
          }

          if (this.xAxis.color) {
            this.xAxis.color = xAxis.color;
          }

          if (xAxis.minHeight >= 0) {
            this.xAxis.xAxisMinHeight = xAxis.minHeight;
          }

          if (xAxis.maxHeight >= 0 && xAxis.maxHeight >= this.xAxis.xAxisMinHeight) {
            this.xAxis.xAxisMaxHeight = xAxis.maxHeight;
          }

          if (xAxis.axisLine) {
            this.xAxis.axisLine = _objectSpread2({}, this.xAxis.axisLine, {}, xAxis.axisLine);
          }

          if (xAxis.tickText) {
            this.xAxis.tickText = _objectSpread2({}, this.xAxis.tickText, {}, xAxis.tickText);
          }

          if (xAxis.tickLine) {
            this.xAxis.tickLine = _objectSpread2({}, this.xAxis.tickLine, {}, xAxis.tickLine);
          }

          if (xAxis.separatorLine) {
            this.xAxis.separatorLine = _objectSpread2({}, this.xAxis.separatorLine, {}, xAxis.separatorLine);
          }
        }

        var yAxis = config.yAxis;

        if (yAxis) {
          if (yAxis.display !== null && yAxis.display !== undefined) {
            this.yAxis.display = yAxis.display;
          }

          if (yAxis.position) {
            this.yAxis.yAxisPosition = yAxis.position;
            this.isShouldCalcOffset = true;
          }

          if (this.yAxis.color) {
            this.yAxis.color = yAxis.color;
          }

          if (yAxis.minWidth >= 0) {
            this.yAxis.yAxisMinWidth = yAxis.minWidth;
          }

          if (yAxis.maxWidth >= 0 && yAxis.maxWidth >= this.yAxis.yAxisMinWidth) {
            this.yAxis.yAxisMaxWidth = yAxis.maxWidth;
          }

          if (yAxis.axisLine) {
            this.yAxis.axisLine = _objectSpread2({}, this.yAxis.axisLine, {}, yAxis.axisLine);
          }

          if (yAxis.tickText) {
            this.yAxis.tickText = _objectSpread2({}, this.yAxis.tickText, {}, yAxis.tickText);
            this.isShouldCalcOffset = true;
          }

          if (yAxis.tickLine) {
            this.yAxis.tickLine = _objectSpread2({}, this.yAxis.tickLine, {}, yAxis.tickLine);
          }

          if (yAxis.separatorLine) {
            this.yAxis.separatorLine = _objectSpread2({}, this.yAxis.separatorLine, {}, yAxis.separatorLine);
          }
        }

        var tooltip = config.tooltip;

        if (tooltip) {
          if (tooltip.textSize > 0) {
            this.tooltip.textSize = tooltip.textSize;
          }

          if (tooltip.crossLine) {
            if (tooltip.crossLine.display !== null && tooltip.crossLine.display !== undefined) {
              this.tooltip.crossLine.display = yAxis.display;
            }

            if (tooltip.crossLine.text) {
              tooltip.crossLine.text = _objectSpread2({}, this.tooltip.crossLine.text, {}, tooltip.crossLine.text);
            }

            this.tooltip.crossLine = _objectSpread2({}, this.tooltip.crossLine, {}, tooltip.crossLine);
          }

          if (tooltip.generalData) {
            if (tooltip.generalData.text) {
              tooltip.generalData.text = _objectSpread2({}, this.tooltip.generalData.text, {}, tooltip.generalData.text);
            }

            this.tooltip.generalData = _objectSpread2({}, this.tooltip.generalData, {}, tooltip.generalData);
          }

          if (tooltip.indicatorData) {
            if (tooltip.indicatorData.text) {
              tooltip.indicatorData.text = _objectSpread2({}, this.tooltip.indicatorData.text, {}, tooltip.indicatorData.text);
            }

            this.tooltip.indicatorData = _objectSpread2({}, this.tooltip.indicatorData, {}, tooltip.indicatorData);
          }
        }

        var mark = config.mark;

        if (mark) {
          if (mark.line) {
            if (mark.line.highlight) {
              mark.line.highlight = _objectSpread2({}, this.mark.line.highlight, {}, mark.line.highlight);
            }

            this.mark.line = _objectSpread2({}, this.mark.line, {}, mark.line);
          }

          if (mark.point) {
            if (mark.point.highlight) {
              mark.point.highlight = _objectSpread2({}, this.mark.point.highlight, {}, mark.point.highlight);
            }

            this.mark.point = _objectSpread2({}, this.mark.point, {}, mark.point);
          }
        }

        this.freshen();
      }
    }
    /**
     * 设置数据
     * @param dataList
     */

  }, {
    key: "setDataList",
    value: function setDataList(dataList) {
      if (dataList && Array.isArray(dataList)) {
        for (var i = 0; i < dataList.length; i++) {
          this.checkData(dataList[i]);
        }

        this.dataBounds.dataList = dataList;
        this.dataBounds.moveToLast();
        this.calcChartIndicator();
      }
    }
    /**
     * 添加数据
     * @param data
     * @param index
     */

  }, {
    key: "addOrUpdateData",
    value: function addOrUpdateData(data) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.dataBounds.dataList.length;
      var indexScan = this.dataBounds.dataList.findIndex(function (row) {
        return row.timestamp === data.timestamp;
      });

      if (indexScan >= 0) {
        index = indexScan;
      }

      this.checkData(data);
      this.dataBounds.dataList[index] = data;

      if (this.dataBounds.min + this.dataBounds.range >= this.dataBounds.dataList.length - 1 && indexScan < 0) {
        this.dataBounds.moveToLast();
      }

      this.calcChartIndicator();
    }
  }, {
    key: "getLastBar",
    value: function getLastBar() {
      var index = this.dataBounds.dataList.length;
      return this.dataBounds.dataList[index - 1];
    }
    /**
     * 设置主指标类型
     * @param indicatorType
     */

  }, {
    key: "setMainIndicatorType",
    value: function setMainIndicatorType(indicatorType) {
      if (this.candleChart.indicatorType !== indicatorType) {
        this.candleChart.indicatorType = indicatorType;
        this.calcIndicator(indicatorType, FRESHEN_CANDLE_CHART);
      }
    }
    /**
     * 设置副指标类型
     * @param indicatorType
     */

  }, {
    key: "setSubIndicatorType",
    value: function setSubIndicatorType(indicatorType) {
      if (this.indicatorChart.indicatorType !== indicatorType) {
        var shouldCalcChartHeight = this.indicatorChart.isDisplayChart() && indicatorType === IndicatorType.NO || !this.indicatorChart.isDisplayChart() && indicatorType !== IndicatorType.NO;
        this.indicatorChart.indicatorType = indicatorType;

        if (shouldCalcChartHeight) {
          this.isShouldCalcChartHeight = true;
        }

        this.calcIndicator(indicatorType);
        this.freshen(this.isShouldCalcChartHeight ? FRESHEN_ALL : FRESHEN_INDICATOR_CHART);
      }
    }
    /**
     * 设置是否显示vol指标
     * @param isShow Boolean
     */

  }, {
    key: "setShowVolIndicatorChart",
    value: function setShowVolIndicatorChart(isShow) {
      if (this.volChart.isDisplayChart() !== isShow) {
        if (isShow) {
          this.volChart.indicatorType = IndicatorType.VOL;
          this.calcIndicator(IndicatorType.VOL);
        } else {
          this.volChart.indicatorType = IndicatorType.NO;
        }

        this.isShouldCalcChartHeight = true;
        this.freshen(FRESHEN_VOL_CHART);
      }
    }
    /**
     * 绘制线
     * @param markingType
     */

  }, {
    key: "markLine",
    value: function markLine(markingType) {
      this.markEvent.drawLineStart(markingType);
    }
  }]);

  return KLineChart;
}();

var klinecharts = {
  IndicatorType: IndicatorType,
  LineStyle: LineStyle,
  YAxisTextPosition: YAxisTextPosition,
  YAxisPosition: YAxisPosition,
  CandleStyle: CandleStyle,
  ChartStyle: ChartStyle,
  IndicatorDisplayRule: IndicatorDisplayRule,
  init: function init(dom) {
    return new KLineChart(dom);
  },
  version: function version() {
    return process.env.K_LINE_CHARTS_VERSION;
  }
};

var tradingview = {
  props: ["showing"],
  data: function data() {
    return {
      startInterval: null,
      chartType: Number(localStorage.getItem("tradingview.chartType") || "1"),
      widgetOptions: {
        debug: false,
        symbol: "".concat(helpers.isAskSymbol().toUpperCase(), "/").concat(helpers.isBidSymbol().toUpperCase()),
        datafeed: new DataFeeds(this.$store),
        interval: localStorage.getItem("tradingview.resolution") || "15",
        container_id: "tv_chart_container",
        library_path: "/charting_library/",
        timezone: config.timeZone,
        locale: "en",
        disabled_features: ["symbol_search_hot_key", "compare_symbol", "display_market_status", "go_to_date", "header_chart_type", "header_compare", "header_toolbar_save_load", "header_interval_dialog_button", "header_resolutions", "header_screenshot", "header_symbol_search", "header_undo_redo", "legend_context_menu", "show_hide_button_in_legend", "show_interval_dialog_on_key_press", "snapshot_trading_drawings", "symbol_info", "timeframes_toolbar", "use_localstorage_for_settings", "volume_force_overlay"],
        enabled_features: ["dont_show_boolean_study_arguments", "hide_last_na_study_output", "move_logo_to_main_pane", "side_toolbar_in_fullscreen_mode", "keep_left_toolbar_visible_on_small_screens", "disable_resolution_rebuild"],
        charts_storage_url: "https://saveload.tradingview.com",
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        toolbar_bg: "transparent",
        fullscreen: false,
        autosize: true,
        studies_overrides: helpers.getStudiesOverrides(this.$store.state.exchange.theme),
        overrides: helpers.getOverrides(this.$store.state.exchange.theme)
      },
      studies: [],
      tvWidget: null
    };
  },
  mounted: function mounted() {
    this.renderChart();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.tvWidget !== null && document.querySelector(this.tvWidget._id)) this.tvWidget = null;
  },
  methods: {
    iframe: function iframe() {
      return document.querySelector("#tv_chart_container iframe").contentWindow;
    },
    stopInterval: function stopInterval() {
      clearInterval(this.startInterval);
    },
    renderChart: function renderChart() {
      var _this = this;

      ZSmartModel.emit("tradingview-rending");
      var TradingView = Model;
      var buttons = [{
        title: "Realtime",
        resolution: "1",
        chartType: 3
      }, {
        title: "1min",
        resolution: "1",
        chartType: 1
      }, {
        title: "5min",
        resolution: "5",
        chartType: 1
      }, {
        title: "15min",
        resolution: "15",
        chartType: 1
      }, {
        title: "30min",
        resolution: "30",
        chartType: 1
      }, {
        title: "1hour",
        resolution: "60",
        chartType: 1
      }, {
        title: "1day",
        resolution: "1D",
        chartType: 1
      }, {
        title: "1week",
        resolution: "1W",
        chartType: 1
      }];
      var tvWidget = window.tvWidget = new TradingView(this.widgetOptions);
      this.tvWidget = tvWidget;
      this.tvWidget.onChartReady(function () {
        if (!_this.tvWidget) return;

        _this.headerReady(buttons);

        _this.createStudy();

        _this.tvWidget.chart().setChartType(_this.chartType);

        _this.toggleStudy(_this.chartType);

        _this.appendStyle();

        ZSmartModel.emit("tradingview-ready");
      });
    },
    appendStyle: function appendStyle() {
      var css = new cssjson().toCSS(night_theme);
      var iframe_document = this.iframe().document;
      var iframe_head = iframe_document.head;
      var style_element = iframe_document.createElement("style");
      style_element.setAttribute("type", "text/css");
      style_element.innerHTML = css;
      iframe_head.appendChild(style_element);
    },
    headerReady: function headerReady(buttons) {
      var _this2 = this;

      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

      return regeneratorRuntime.async(function headerReady$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.tvWidget.headerReady());

            case 2:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 5;

              _loop = function _loop() {
                var config = _step.value;

                var button = _this2.tvWidget.createButton();

                button.setAttribute("title", config.title);
                button.textContent = config.title;
                button.addEventListener("click", function () {
                  if (button.parentElement.classList.contains("actived")) {
                    return false;
                  }

                  var actived_button = _this2.iframe().document.querySelector(".actived");

                  if (actived_button) {
                    _this2.iframe().document.querySelector(".actived").classList.remove("actived");
                  }

                  if (config.chartType != _this2.tvWidget.chart().chartType()) {
                    _this2.tvWidget.chart().setChartType(config.chartType);

                    _this2.toggleStudy(config.chartType);
                  }

                  _this2.tvWidget.chart().setResolution(config.resolution);

                  store$1.commit("exchange/UPDATE_RESOLUTION", config.resolution);
                  localStorage.setItem("tradingview.chartType", config.chartType);
                  button.parentElement.classList.add("actived");
                });
                button.parentElement.classList.remove("actived");

                if (config.resolution === _this2.widgetOptions.interval && config.chartType == _this2.chartType) {
                  button.parentElement.classList.add("actived");
                }
              };

              for (_iterator = buttons[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                _loop();
              }

              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](5);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 14:
              _context.prev = 14;
              _context.prev = 15;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 17:
              _context.prev = 17;

              if (!_didIteratorError) {
                _context.next = 20;
                break;
              }

              throw _iteratorError;

            case 20:
              return _context.finish(17);

            case 21:
              return _context.finish(14);

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[5, 10, 14, 22], [15,, 17, 21]]);
    },
    createStudy: function createStudy() {
      var studies = [{
        name: "Moving Average",
        length: [5],
        data: {
          "Plot.color": "rgb(132, 170, 213)"
        }
      }, {
        name: "Moving Average",
        length: [10],
        data: {
          "Plot.color": "rgb(132, 170, 213)"
        }
      }, {
        name: "Moving Average",
        length: [30],
        data: {
          "Plot.color": "rgb(85, 178, 99)"
        }
      }, {
        name: "Moving Average",
        length: [60],
        data: {
          "Plot.color": "rgb(183, 36, 138)"
        }
      }];

      for (var _i = 0, _studies = studies; _i < _studies.length; _i++) {
        var study = _studies[_i];
        var id = this.tvWidget.chart().createStudy(study.name, false, false, study.length, null, study.data);
        this.studies.push(id);
      }
    },
    toggleStudy: function toggleStudy(chartType) {
      var state = chartType == 3 ? 0 : 1;

      for (var i = 0; i < this.studies.length; i++) {
        this.tvWidget.chart().getStudyById(this.studies[i]).setVisible(state);
      }
    }
  }
};



var index = /*#__PURE__*/Object.freeze({
__proto__: null,
balance: balance,
tradingview: tradingview
});



var index$1 = /*#__PURE__*/Object.freeze({
__proto__: null,
canvas: canvas,
charting_library: Model,
cssjson: cssjson,
sparkline: sparkline,
klinecharts: klinecharts
});

var setTheme =
/*#__PURE__*/
function () {
  function setTheme() {
    _classCallCheck(this, setTheme);

    this.element = document.getElementsByTagName("BODY")[0];
  }

  _createClass(setTheme, [{
    key: "set",
    value: function set(prop, val) {
      return this.element.style.setProperty(prop, val);
    }
  }, {
    key: "get",
    value: function get(val) {
      return getComputedStyle(this.element).getPropertyValue(val);
    }
  }, {
    key: "setTheme",
    value: function setTheme(theme) {
      var _this = this;

      return Object.keys(theme).forEach(function (key) {
        return _this.set("--" + key, theme[key]);
      });
    }
  }]);

  return setTheme;
}();

export { ApiClient, index$1 as assets, index as logic, setTheme };
