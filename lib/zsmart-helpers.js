/*!
 * zsmart-components v1.1
 * 
 * © 2020 @huuhait(https://github.com/huuhait)
 * MIT License.
 */
import store from '@/store';
import colors from '@/colors';
import { message, notification } from '@/plugins/antd/custom';
import { i18n } from '@/plugins';

var copyText = function copyText(text) {
  var el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style = {
    position: "absolute",
    left: "-9999px"
  };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

var MARKET = function MARKET() {
  var MARKET = store.getters["public/getAllMarkets"];
  return MARKET.map(function (market) {
    return market.name;
  });
};

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

/**
 * @param {String | Object | Array} name - The name of ticker with lower case; eg: ethusdt | []
 */

var getTicker = function getTicker(name) {
  var market = null;
  var tickers = store.state["public"].tickers;

  if (Array.isArray(name)) {
    market = name.join("").toLowerCase();
  } else if (_typeof(name) === "object") {
    market = getTicker([name.asks, name.bids]);
  } else {
    name = name.replace(" ", "");
    name = name.replace("/", "");
    market = name.toLowerCase();
  }

  return tickers[market];
};

var getTickerPriceUSD = function getTickerPriceUSD(market, price) {
  var priceFiat = "0.00";
  var selectedFiat = "USD".toUpperCase();
  var GlobalPrice = store.getters["public/getGlobalPrice"];
  var isBid = getTickerBidSymbol(market);
  var isAsk = getTickerAskSymbol(market);
  var allToCheck = ["btc", "eth", "ltc", "usdt"];

  if (["USD", "USDT"].includes(isBid.toUpperCase())) {
    priceFiat = Number(price * GlobalPrice[isBid.toUpperCase()][selectedFiat]);
  } else {
    var index_check = allToCheck.findIndex(function (row) {
      return row === isBid;
    });
    var tickerCurrency = {
      asks: getTicker(isAsk + isBid),
      bids: getTicker(isBid + "usdt")
    };

    if (index_check >= 0 && tickerCurrency.asks && tickerCurrency.bids) {
      priceFiat = Number(price * tickerCurrency.bids.last * GlobalPrice["USDT"]["USD"] * GlobalPrice["USD"][selectedFiat]);
    } else {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = allToCheck[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var currency = _step.value;
          var _tickerCurrency = {
            asks: getTicker(isAsk + currency),
            bids: getTicker(currency + "usdt")
          };

          if (_tickerCurrency.asks && _tickerCurrency.bids) {
            // For the end way
            priceFiat = Number(_tickerCurrency.asks.last * getTickerPriceUSD(_tickerCurrency.bids.id, _tickerCurrency.bids.last) * GlobalPrice["USDT"]["USD"] * GlobalPrice["USD"][selectedFiat]);
          } else if (_tickerCurrency.asks && currency === "usdt") {
            priceFiat = Number(price * _tickerCurrency.asks.last * GlobalPrice["USDT"][selectedFiat]);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }

  return Number(priceFiat).toFixed(2);
};

var CURRENCY = function CURRENCY() {
  var currencies = store.getters["public/getAllCurrencies"];
  return currencies.map(function (currency) {
    return currency.id;
  }); //["ETH", "BTC", "ETC", "BZX"]
};
var Currency =
/*#__PURE__*/
function () {
  function Currency(currency) {
    _classCallCheck(this, Currency);

    this.DATA = store.getters["public/getAllCurrencies"];
    this.currency = currency;
  }

  _createClass(Currency, [{
    key: "get",
    value: function get() {
      var DATA = this.DATA;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = DATA[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var row = _step.value;
          if (row.id === this.currency) return row;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "getAllName",
    value: function getAllName() {
      var DATA = this.DATA;
      return DATA.map(function (currency) {
        return currency.id.toUpperCase();
      }); //["ETH", "BTC", "ETC", "BZX"]
    }
  }, {
    key: "getPrice",
    value: function getPrice(toCurrency) {
      var Currency_Convert = ["BTC", "USDT", "USD"];
      if (!Currency_Convert.includes(toCurrency)) return;
      return this["getPriceBy".concat(toCurrency)];
    }
  }, {
    key: "getPriceByUSDT",
    value: function getPriceByUSDT() {
      //step 1
      if (this.currency === "usdt") {
        return 1;
      } else if (this.currency === "usd") {
        var price = store.getters["public/getGlobalPrice"].USD;
        return Number(price.USDT);
      } //step 2


      var priceUSD = this.getPriceByUSD();
      var GlobalPrice = store.getters["public/getGlobalPrice"];
      return Number(priceUSD * GlobalPrice.USD.USDT).toFixed(2);
    }
  }, {
    key: "getPriceByBTC",
    value: function getPriceByBTC() {
      //step 1
      if (this.currency === "btc") {
        return 1;
      } //step 2


      var market_find_btc = getTicker(this.currency + "btc");
      if (market_find_btc) return Number(market_find_btc.last).toFixed(8); //step 3

      var BTCUSDT = getTicker("btcusdt");
      var priceUSDT = this.getPriceByUSDT();
      return Number(priceUSDT / BTCUSDT).toFixed(8);
    }
  }, {
    key: "getPriceByUSD",
    value: function getPriceByUSD() {
      //step 1
      if (this.currency === "usd") {
        return 1;
      } else if (this.currency === "usdt") {
        var price = store.getters["public/getGlobalPrice"].USD;
        return Number(price.USDT);
      } //step 2


      var allToCheck = ["usd", "usdt", "btc", "eth", "ltc", "xrp"];
      var isAsk = this.currency;

      for (var _i = 0, _allToCheck = allToCheck; _i < _allToCheck.length; _i++) {
        var isBid = _allToCheck[_i];
        var market_found = getTicker(isAsk + isBid);

        if (market_found) {
          return getTickerPriceUSD(market_found.id, market_found.last);
        }
      }
    }
  }]);

  return Currency;
}();

var Balance =
/*#__PURE__*/
function () {
  function Balance(currency) {
    _classCallCheck(this, Balance);

    this.currency = currency.toLowerCase();
  }

  _createClass(Balance, [{
    key: "getAvailable",
    value: function getAvailable() {
      var assets = this.assets;
      return Number(assets.balance).toFixed(8);
    }
  }, {
    key: "getLocked",
    value: function getLocked() {
      var assets = this.assets;
      return Number(assets.locked).toFixed(8);
    }
  }, {
    key: "getTotal",
    value: function getTotal() {
      var assets = this.assets;
      return Number(assets.balance * 1 + assets.locked * 1).toFixed(8);
    }
  }, {
    key: "getTotalUSDT",
    value: function getTotalUSDT() {
      var balance = this.getTotal();
      var priceUSDT = new Currency(this.currency).getPriceByUSDT();
      return Number(balance * priceUSDT).toFixed(2);
    }
  }, {
    key: "getTotalBTC",
    value: function getTotalBTC() {
      var balance = this.getTotal();
      var priceBTC = new Currency(this.currency).getPriceByBTC();
      return Number(balance * priceBTC).toFixed(8);
    }
  }, {
    key: "getTotalUSD",
    value: function getTotalUSD() {
      var balance = this.getTotal();
      var priceUSD = new Currency(this.currency).getPriceByUSD();
      return Number(balance * priceUSD).toFixed(2);
    }
  }, {
    key: "assets",
    get: function get() {
      var _this = this;

      var balances = store.state.user.balance;
      return balances.find(function (record) {
        return record.currency === _this.currency;
      });
    }
  }]);

  return Balance;
}();

var emailEncode = function emailEncode(email) {
  var reEmail = email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
    for (var i = 0; i < gp3.length; i++) {
      if (gp2.length <= 4) {
        gp2 += "*";
      }
    }

    return gp2;
  });
  return reEmail.replace("@", "");
};

var fixTime = function fixTime(time) {
  return ("00" + time).slice(-2);
};

var checkDate = function checkDate(time) {
  var date = new Date(time);
  return date.getFullYear() === 1970 ? new Date(time * 1000) : new Date(time);
};

var getDate = function getDate(time) {
  var allowyear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var date = checkDate(time);
  var Year = allowyear ? date.getFullYear() + "-" : "";
  var Months = fixTime(date.getMonth() + 1);
  var Dates = fixTime(date.getDate());
  var Hours = fixTime(date.getHours());
  var Minutes = fixTime(date.getMinutes());
  var Seconds = fixTime(date.getSeconds());
  return "".concat(Year).concat(Months, "-").concat(Dates, " ").concat(Hours, ":").concat(Minutes, ":").concat(Seconds);
};

var isMarket = function isMarket() {
  var hash = store.state["public"].market.split("_"); //ETH_USD

  return hash.join("").toLowerCase(); //ethusd
};

var pricePrecision = function pricePrecision() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  market = market.toLowerCase();
  var all_market = store.state["public"].markets;

  for (var i in all_market) {
    if (all_market[i].id === market) return all_market[i].price_precision;
  }
};

var getMarketLastPrice = function getMarketLastPrice() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  var ticker = store.getters["public/getAllTickers"][market];
  return Number(ticker.last).toFixed(pricePrecision(market));
};

var getMarketLastUSD = function getMarketLastUSD() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  return getTickerPriceUSD(market, getMarketLastPrice(market));
};

var getMarketPriceChange = function getMarketPriceChange() {
  var ticker = store.getters["public/getAllTickers"][isMarket()];

  if (ticker) {
    var change = ticker.price_change_percent;
    var payload = change.replace("%", "") * 1;
    return payload;
  } else return 0;
};

var getOverrides = function getOverrides(theme) {
  var themes = {
    light: {
      up: colors["up-color"],
      down: colors["down-color"],
      bg: colors["bg-card-color"],
      grid: "#f7f8fa",
      cross: "#23283D",
      border: "#9194a4",
      text: "#9194a4",
      areatop: "rgba(71, 78, 112, 0.1)",
      areadown: "rgba(71, 78, 112, 0.02)",
      line: "#737375"
    },
    night: {
      up: colors["up-color"],
      down: colors["down-color"],
      bg: colors["bg-card-color"],
      grid: "#272c48",
      cross: "#9194A3",
      border: "#4e5b85",
      text: colors["color-gray"],
      areatop: "rgba(122, 152, 247, .1)",
      areadown: "rgba(122, 152, 247, .02)",
      line: "#737375"
    }
  };
  var t = themes[theme];
  return {
    volumePaneSize: "medium",
    "scalesProperties.lineColor": t.text,
    "scalesProperties.textColor": t.text,
    "paneProperties.background": t.bg,
    "paneProperties.vertGridProperties.color": t.grid,
    "paneProperties.horzGridProperties.color": t.grid,
    "paneProperties.crossHairProperties.color": t.cross,
    "paneProperties.legendProperties.showLegend": !!t.showLegend,
    "paneProperties.legendProperties.showStudyArguments": !0,
    "paneProperties.legendProperties.showStudyTitles": !0,
    "paneProperties.legendProperties.showStudyValues": !0,
    "paneProperties.legendProperties.showSeriesTitle": !0,
    "paneProperties.legendProperties.showSeriesOHLC": !0,
    "mainSeriesProperties.candleStyle.upColor": t.up,
    "mainSeriesProperties.candleStyle.downColor": t.down,
    "mainSeriesProperties.candleStyle.drawWick": !0,
    "mainSeriesProperties.candleStyle.drawBorder": !0,
    "mainSeriesProperties.candleStyle.borderColor": t.border,
    "mainSeriesProperties.candleStyle.borderUpColor": t.up,
    "mainSeriesProperties.candleStyle.borderDownColor": t.down,
    "mainSeriesProperties.candleStyle.wickUpColor": t.up,
    "mainSeriesProperties.candleStyle.wickDownColor": t.down,
    "mainSeriesProperties.candleStyle.barColorsOnPrevClose": !1,
    "mainSeriesProperties.hollowCandleStyle.upColor": t.up,
    "mainSeriesProperties.hollowCandleStyle.downColor": t.down,
    "mainSeriesProperties.hollowCandleStyle.drawWick": !0,
    "mainSeriesProperties.hollowCandleStyle.drawBorder": !0,
    "mainSeriesProperties.hollowCandleStyle.borderColor": t.border,
    "mainSeriesProperties.hollowCandleStyle.borderUpColor": t.up,
    "mainSeriesProperties.hollowCandleStyle.borderDownColor": t.down,
    "mainSeriesProperties.hollowCandleStyle.wickColor": t.line,
    "mainSeriesProperties.haStyle.upColor": t.up,
    "mainSeriesProperties.haStyle.downColor": t.down,
    "mainSeriesProperties.haStyle.drawWick": !0,
    "mainSeriesProperties.haStyle.drawBorder": !0,
    "mainSeriesProperties.haStyle.borderColor": t.border,
    "mainSeriesProperties.haStyle.borderUpColor": t.up,
    "mainSeriesProperties.haStyle.borderDownColor": t.down,
    "mainSeriesProperties.haStyle.wickColor": t.border,
    "mainSeriesProperties.haStyle.barColorsOnPrevClose": !1,
    "mainSeriesProperties.barStyle.upColor": t.up,
    "mainSeriesProperties.barStyle.downColor": t.down,
    "mainSeriesProperties.barStyle.barColorsOnPrevClose": !1,
    "mainSeriesProperties.barStyle.dontDrawOpen": !1,
    "mainSeriesProperties.lineStyle.color": t.border,
    "mainSeriesProperties.lineStyle.linewidth": 1,
    "mainSeriesProperties.lineStyle.priceSource": "close",
    "mainSeriesProperties.areaStyle.color1": t.areatop,
    "mainSeriesProperties.areaStyle.color2": t.areadown,
    "mainSeriesProperties.areaStyle.linecolor": t.border,
    "mainSeriesProperties.areaStyle.linewidth": 1,
    "mainSeriesProperties.areaStyle.priceSource": "close"
  };
};

var getStudiesOverrides = function getStudiesOverrides(theme) {
  var themes = {
    light: {
      c0: colors["color-down"],
      c1: colors["color-up"],
      t: 70,
      v: !1
    },
    night: {
      c0: colors["color-down"],
      c1: colors["color-up"],
      t: 70,
      v: !1
    }
  };
  var t = themes[theme];
  return {
    "volume.volume.color.0": t.c0,
    "volume.volume.color.1": t.c1,
    "volume.volume.transparency": t.t
  };
};

var buyType = ["buy", "bid", "bids"];
var getType = function getType(type) {
  return buyType.includes(type) ? "Buy" : "Sell";
};

var isAskSymbol = function isAskSymbol() {
  var hash = store.state["public"].market.split("_"); //ETH_USD

  return hash[0].toLowerCase(); //eth
};

var isBidSymbol = function isBidSymbol() {
  var hash = store.state["public"].market.split("_"); //ETH_USD

  return hash[1].toLowerCase(); //usd
};

var minAmount = function minAmount() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  var markets = store.getters["public/getAllMarkets"];

  for (var i in markets) {
    if (markets[i].id === market) return Number(markets[i].min_amount);
  }
};

var minPrice = function minPrice() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  var markets = store.getters["public/getAllMarkets"];

  for (var i in markets) {
    if (markets[i].id === market) return Number(markets[i].min_price);
  }
};

var amountPrecision = function amountPrecision() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  market = market.toLowerCase();
  var all_market = store.state["public"].markets;

  for (var i in all_market) {
    if (all_market[i].id === market) return all_market[i].amount_precision;
  }
};

var totalPrecision = function totalPrecision() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  market = market.toLowerCase();
  var all_market = store.state["public"].markets;

  for (var i in all_market) {
    if (all_market[i].id === market) return all_market[i].total_precision;
  }
};

var buyType$1 = ["buy", "bid", "bids"];
var trendType = function trendType(taker_type) {
  var bg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!bg) return buyType$1.includes(taker_type) ? "text-up" : "text-down";else return buyType$1.includes(taker_type) ? "bg-up" : "bg-down";
};

var getTime = function getTime(time) {
  return new Date(time).toTimeString().slice(0, 8);
};

var TYPE_BUY = ["buy", "bid", "bids"];
var TYPE_SELL = ["sell", "ask", "asks"];
var TYPE = [].concat(TYPE_BUY, TYPE_SELL);
var getBestPrice = function getBestPrice() {
  var market = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : isMarket();
  var side = arguments.length > 1 ? arguments[1] : undefined;
  if (!TYPE.includes(side)) return;
  var ticker = store.getters["public/getAllTickers"][market];
  return ticker[side];
};

var getTickerBidSymbol = function getTickerBidSymbol(ticker) {
  var tickers = store.getters["public/getAllTickers"];
  return tickers[ticker].quote_unit;
};

var removeURLParam = function removeURLParam(url, param) {
  var reg = new RegExp("((&)*" + param + "=([^&]*))", "g");
  return url.replace(reg, "");
};

var getURLParam = function getURLParam(url, param) {
  return new URL(url).searchParams.get(param);
};

var toUTF8String = function toUTF8String(str) {
  var utf8Str = "";

  for (var i = 0; i < str.length; i++) {
    var charCode = str.charCodeAt(i);

    if (charCode < 0x0080) {
      utf8Str += String.fromCharCode(charCode);
    } else if (charCode < 0x0800) {
      utf8Str += String.fromCharCode(0xc0 | charCode >> 6);
      utf8Str += String.fromCharCode(0x80 | charCode & 0x3f);
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8Str += String.fromCharCode(0xe0 | charCode >> 12);
      utf8Str += String.fromCharCode(0x80 | charCode >> 6 & 0x3f);
      utf8Str += String.fromCharCode(0x80 | charCode & 0x3f);
    } else {
      i++;
      charCode = 0x10000 + ((charCode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff);
      utf8Str += String.fromCharCode(0xf0 | charCode >> 18);
      utf8Str += String.fromCharCode(0x80 | charCode >> 12 & 0x3f);
      utf8Str += String.fromCharCode(0x80 | charCode >> 6 & 0x3f);
      utf8Str += String.fromCharCode(0x80 | charCode & 0x3f);
    }
  }

  return utf8Str;
};

var TYPE$1 = ["info", "success", "error", "warning"];
var runMessage = function runMessage(type, text) {
  if (TYPE$1.indexOf(type) < 0 || isMobile() && !text) return;
  message[type](text);
};

var TYPE$2 = ["info", "success", "error", "warning"];
var prefixClass = "ant";
var runNotice = function runNotice(type, text) {
  if (TYPE$2.indexOf(type) < 0 || isMobile() && !text) return;
  notification[type]({
    message: text,
    "class": "".concat(prefixClass, "-notification-").concat(type)
  });
};

var getAllRegion = function getAllRegion() {
  return [{
    code: "AF",
    name: "Afghanistan"
  }, {
    code: "AX",
    name: "\xC5land Islands"
  }, {
    code: "AL",
    name: "Albania"
  }, {
    code: "DZ",
    name: "Algeria"
  }, {
    code: "AS",
    name: "American Samoa"
  }, {
    code: "AD",
    name: "Andorra"
  }, {
    code: "AO",
    name: "Angola"
  }, {
    code: "AI",
    name: "Anguilla"
  }, {
    code: "AQ",
    name: "Antarctica"
  }, {
    code: "AG",
    name: "Antigua and Barbuda"
  }, {
    code: "AR",
    name: "Argentina"
  }, {
    code: "AM",
    name: "Armenia"
  }, {
    code: "AW",
    name: "Aruba"
  }, {
    code: "AU",
    name: "Australia"
  }, {
    code: "AT",
    name: "Austria"
  }, {
    code: "AZ",
    name: "Azerbaijan"
  }, {
    code: "BS",
    name: "Bahamas"
  }, {
    code: "BH",
    name: "Bahrain"
  }, {
    code: "BD",
    name: "Bangladesh"
  }, {
    code: "BB",
    name: "Barbados"
  }, {
    code: "BY",
    name: "Belarus"
  }, {
    code: "BE",
    name: "Belgium"
  }, {
    code: "BZ",
    name: "Belize"
  }, {
    code: "BJ",
    name: "Benin"
  }, {
    code: "BM",
    name: "Bermuda"
  }, {
    code: "BT",
    name: "Bhutan"
  }, {
    code: "BO",
    name: "Bolivia, Plurinational State of"
  }, {
    code: "BQ",
    name: "Bonaire, Sint Eustatius and Saba"
  }, {
    code: "BA",
    name: "Bosnia and Herzegovina"
  }, {
    code: "BW",
    name: "Botswana"
  }, {
    code: "BV",
    name: "Bouvet Island"
  }, {
    code: "BR",
    name: "Brazil"
  }, {
    code: "IO",
    name: "British Indian Ocean Territory"
  }, {
    code: "BN",
    name: "Brunei Darussalam"
  }, {
    code: "BG",
    name: "Bulgaria"
  }, {
    code: "BF",
    name: "Burkina Faso"
  }, {
    code: "BI",
    name: "Burundi"
  }, {
    code: "KH",
    name: "Cambodia"
  }, {
    code: "CM",
    name: "Cameroon"
  }, {
    code: "CA",
    name: "Canada"
  }, {
    code: "CV",
    name: "Cape Verde"
  }, {
    code: "KY",
    name: "Cayman Islands"
  }, {
    code: "CF",
    name: "Central African Republic"
  }, {
    code: "TD",
    name: "Chad"
  }, {
    code: "CL",
    name: "Chile"
  }, {
    code: "CN",
    name: "China"
  }, {
    code: "CX",
    name: "Christmas Island"
  }, {
    code: "CC",
    name: "Cocos (Keeling) Islands"
  }, {
    code: "CO",
    name: "Colombia"
  }, {
    code: "KM",
    name: "Comoros"
  }, {
    code: "CG",
    name: "Congo"
  }, {
    code: "CD",
    name: "Congo, the Democratic Republic of the"
  }, {
    code: "CK",
    name: "Cook Islands"
  }, {
    code: "CR",
    name: "Costa Rica"
  }, {
    code: "CI",
    name: "C\xF4te d'Ivoire"
  }, {
    code: "HR",
    name: "Croatia"
  }, {
    code: "CU",
    name: "Cuba"
  }, {
    code: "CW",
    name: "Cura\xE7ao"
  }, {
    code: "CY",
    name: "Cyprus"
  }, {
    code: "CZ",
    name: "Czech Republic"
  }, {
    code: "DK",
    name: "Denmark"
  }, {
    code: "DJ",
    name: "Djibouti"
  }, {
    code: "DM",
    name: "Dominica"
  }, {
    code: "DO",
    name: "Dominican Republic"
  }, {
    code: "EC",
    name: "Ecuador"
  }, {
    code: "EG",
    name: "Egypt"
  }, {
    code: "SV",
    name: "El Salvador"
  }, {
    code: "GQ",
    name: "Equatorial Guinea"
  }, {
    code: "ER",
    name: "Eritrea"
  }, {
    code: "EE",
    name: "Estonia"
  }, {
    code: "ET",
    name: "Ethiopia"
  }, {
    code: "FK",
    name: "Falkland Islands (Malvinas)"
  }, {
    code: "FO",
    name: "Faroe Islands"
  }, {
    code: "FJ",
    name: "Fiji"
  }, {
    code: "FI",
    name: "Finland"
  }, {
    code: "FR",
    name: "France"
  }, {
    code: "GF",
    name: "French Guiana"
  }, {
    code: "PF",
    name: "French Polynesia"
  }, {
    code: "TF",
    name: "French Southern Territories"
  }, {
    code: "GA",
    name: "Gabon"
  }, {
    code: "GM",
    name: "Gambia"
  }, {
    code: "GE",
    name: "Georgia"
  }, {
    code: "DE",
    name: "Germany"
  }, {
    code: "GH",
    name: "Ghana"
  }, {
    code: "GI",
    name: "Gibraltar"
  }, {
    code: "GR",
    name: "Greece"
  }, {
    code: "GL",
    name: "Greenland"
  }, {
    code: "GD",
    name: "Grenada"
  }, {
    code: "GP",
    name: "Guadeloupe"
  }, {
    code: "GU",
    name: "Guam"
  }, {
    code: "GT",
    name: "Guatemala"
  }, {
    code: "GG",
    name: "Guernsey"
  }, {
    code: "GN",
    name: "Guinea"
  }, {
    code: "GW",
    name: "Guinea-Bissau"
  }, {
    code: "GY",
    name: "Guyana"
  }, {
    code: "HT",
    name: "Haiti"
  }, {
    code: "HM",
    name: "Heard Island and McDonald Islands"
  }, {
    code: "VA",
    name: "Holy See (Vatican City State)"
  }, {
    code: "HN",
    name: "Honduras"
  }, {
    code: "HK",
    name: "Hong Kong"
  }, {
    code: "HU",
    name: "Hungary"
  }, {
    code: "IS",
    name: "Iceland"
  }, {
    code: "IN",
    name: "India"
  }, {
    code: "ID",
    name: "Indonesia"
  }, {
    code: "IR",
    name: "Iran, Islamic Republic of"
  }, {
    code: "IQ",
    name: "Iraq"
  }, {
    code: "IE",
    name: "Ireland"
  }, {
    code: "IM",
    name: "Isle of Man"
  }, {
    code: "IL",
    name: "Israel"
  }, {
    code: "IT",
    name: "Italy"
  }, {
    code: "JM",
    name: "Jamaica"
  }, {
    code: "JP",
    name: "Japan"
  }, {
    code: "JE",
    name: "Jersey"
  }, {
    code: "JO",
    name: "Jordan"
  }, {
    code: "KZ",
    name: "Kazakhstan"
  }, {
    code: "KE",
    name: "Kenya"
  }, {
    code: "KI",
    name: "Kiribati"
  }, {
    code: "KP",
    name: "Korea, Democratic People's Republic of"
  }, {
    code: "KR",
    name: "Korea, Republic of"
  }, {
    code: "KW",
    name: "Kuwait"
  }, {
    code: "KG",
    name: "Kyrgyzstan"
  }, {
    code: "LA",
    name: "Lao People's Democratic Republic"
  }, {
    code: "LV",
    name: "Latvia"
  }, {
    code: "LB",
    name: "Lebanon"
  }, {
    code: "LS",
    name: "Lesotho"
  }, {
    code: "LR",
    name: "Liberia"
  }, {
    code: "LY",
    name: "Libya"
  }, {
    code: "LI",
    name: "Liechtenstein"
  }, {
    code: "LT",
    name: "Lithuania"
  }, {
    code: "LU",
    name: "Luxembourg"
  }, {
    code: "MO",
    name: "Macao"
  }, {
    code: "MK",
    name: "Macedonia, the Former Yugoslav Republic of"
  }, {
    code: "MG",
    name: "Madagascar"
  }, {
    code: "MW",
    name: "Malawi"
  }, {
    code: "MY",
    name: "Malaysia"
  }, {
    code: "MV",
    name: "Maldives"
  }, {
    code: "ML",
    name: "Mali"
  }, {
    code: "MT",
    name: "Malta"
  }, {
    code: "MH",
    name: "Marshall Islands"
  }, {
    code: "MQ",
    name: "Martinique"
  }, {
    code: "MR",
    name: "Mauritania"
  }, {
    code: "MU",
    name: "Mauritius"
  }, {
    code: "YT",
    name: "Mayotte"
  }, {
    code: "MX",
    name: "Mexico"
  }, {
    code: "FM",
    name: "Micronesia, Federated States of"
  }, {
    code: "MD",
    name: "Moldova, Republic of"
  }, {
    code: "MC",
    name: "Monaco"
  }, {
    code: "MN",
    name: "Mongolia"
  }, {
    code: "ME",
    name: "Montenegro"
  }, {
    code: "MS",
    name: "Montserrat"
  }, {
    code: "MA",
    name: "Morocco"
  }, {
    code: "MZ",
    name: "Mozambique"
  }, {
    code: "MM",
    name: "Myanmar"
  }, {
    code: "NA",
    name: "Namibia"
  }, {
    code: "NR",
    name: "Nauru"
  }, {
    code: "NP",
    name: "Nepal"
  }, {
    code: "NL",
    name: "Netherlands"
  }, {
    code: "NC",
    name: "New Caledonia"
  }, {
    code: "NZ",
    name: "New Zealand"
  }, {
    code: "NI",
    name: "Nicaragua"
  }, {
    code: "NE",
    name: "Niger"
  }, {
    code: "NG",
    name: "Nigeria"
  }, {
    code: "NU",
    name: "Niue"
  }, {
    code: "NF",
    name: "Norfolk Island"
  }, {
    code: "MP",
    name: "Northern Mariana Islands"
  }, {
    code: "NO",
    name: "Norway"
  }, {
    code: "OM",
    name: "Oman"
  }, {
    code: "PK",
    name: "Pakistan"
  }, {
    code: "PW",
    name: "Palau"
  }, {
    code: "PS",
    name: "Palestine, State of"
  }, {
    code: "PA",
    name: "Panama"
  }, {
    code: "PG",
    name: "Papua New Guinea"
  }, {
    code: "PY",
    name: "Paraguay"
  }, {
    code: "PE",
    name: "Peru"
  }, {
    code: "PH",
    name: "Philippines"
  }, {
    code: "PN",
    name: "Pitcairn"
  }, {
    code: "PL",
    name: "Poland"
  }, {
    code: "PT",
    name: "Portugal"
  }, {
    code: "PR",
    name: "Puerto Rico"
  }, {
    code: "QA",
    name: "Qatar"
  }, {
    code: "RE",
    name: "R\xE9union"
  }, {
    code: "RO",
    name: "Romania"
  }, {
    code: "RU",
    name: "Russian Federation"
  }, {
    code: "RW",
    name: "Rwanda"
  }, {
    code: "BL",
    name: "Saint Barth\xE9lemy"
  }, {
    code: "SH",
    name: "Saint Helena, Ascension and Tristan da Cunha"
  }, {
    code: "KN",
    name: "Saint Kitts and Nevis"
  }, {
    code: "LC",
    name: "Saint Lucia"
  }, {
    code: "MF",
    name: "Saint Martin (French part)"
  }, {
    code: "PM",
    name: "Saint Pierre and Miquelon"
  }, {
    code: "VC",
    name: "Saint Vincent and the Grenadines"
  }, {
    code: "WS",
    name: "Samoa"
  }, {
    code: "SM",
    name: "San Marino"
  }, {
    code: "ST",
    name: "Sao Tome and Principe"
  }, {
    code: "SA",
    name: "Saudi Arabia"
  }, {
    code: "SN",
    name: "Senegal"
  }, {
    code: "RS",
    name: "Serbia"
  }, {
    code: "SC",
    name: "Seychelles"
  }, {
    code: "SL",
    name: "Sierra Leone"
  }, {
    code: "SG",
    name: "Singapore"
  }, {
    code: "SX",
    name: "Sint Maarten (Dutch part)"
  }, {
    code: "SK",
    name: "Slovakia"
  }, {
    code: "SI",
    name: "Slovenia"
  }, {
    code: "SB",
    name: "Solomon Islands"
  }, {
    code: "SO",
    name: "Somalia"
  }, {
    code: "ZA",
    name: "South Africa"
  }, {
    code: "GS",
    name: "South Georgia and the South Sandwich Islands"
  }, {
    code: "SS",
    name: "South Sudan"
  }, {
    code: "ES",
    name: "Spain"
  }, {
    code: "LK",
    name: "Sri Lanka"
  }, {
    code: "SD",
    name: "Sudan"
  }, {
    code: "SR",
    name: "Suriname"
  }, {
    code: "SJ",
    name: "Svalbard and Jan Mayen"
  }, {
    code: "SZ",
    name: "Swaziland"
  }, {
    code: "SE",
    name: "Sweden"
  }, {
    code: "CH",
    name: "Switzerland"
  }, {
    code: "SY",
    name: "Syrian Arab Republic"
  }, {
    code: "TW",
    name: "Taiwan, Province of China"
  }, {
    code: "TJ",
    name: "Tajikistan"
  }, {
    code: "TZ",
    name: "Tanzania, United Republic of"
  }, {
    code: "TH",
    name: "Thailand"
  }, {
    code: "TL",
    name: "Timor-Leste"
  }, {
    code: "TG",
    name: "Togo"
  }, {
    code: "TK",
    name: "Tokelau"
  }, {
    code: "TO",
    name: "Tonga"
  }, {
    code: "TT",
    name: "Trinidad and Tobago"
  }, {
    code: "TN",
    name: "Tunisia"
  }, {
    code: "TR",
    name: "Turkey"
  }, {
    code: "TM",
    name: "Turkmenistan"
  }, {
    code: "TC",
    name: "Turks and Caicos Islands"
  }, {
    code: "TV",
    name: "Tuvalu"
  }, {
    code: "UG",
    name: "Uganda"
  }, {
    code: "UA",
    name: "Ukraine"
  }, {
    code: "AE",
    name: "United Arab Emirates"
  }, {
    code: "GB",
    name: "United Kingdom"
  }, {
    code: "US",
    name: "United States"
  }, {
    code: "UM",
    name: "United States Minor Outlying Islands"
  }, {
    code: "UY",
    name: "Uruguay"
  }, {
    code: "UZ",
    name: "Uzbekistan"
  }, {
    code: "VU",
    name: "Vanuatu"
  }, {
    code: "VE",
    name: "Venezuela, Bolivarian Republic of"
  }, {
    code: "VN",
    name: "Viet Nam"
  }, {
    code: "VG",
    name: "Virgin Islands, British"
  }, {
    code: "VI",
    name: "Virgin Islands, U.S."
  }, {
    code: "WF",
    name: "Wallis and Futuna"
  }, {
    code: "EH",
    name: "Western Sahara"
  }, {
    code: "YE",
    name: "Yemen"
  }, {
    code: "ZM",
    name: "Zambia"
  }, {
    code: "ZW",
    name: "Zimbabwe"
  }];
};

var jsonToParam = function jsonToParam(json) {
  var parts = [];

  for (var i in json) {
    if (json.hasOwnProperty(i) && json[i]) {
      parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
    }
  }

  return parts.length ? "?" + parts.join("&") : "";
};

var getTickerID = function getTickerID(name) {
  return name.split("/").join("");
};

var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var translation = function translation(message) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return i18n.t(message, data);
};

var addOrRemoveFavorite = function addOrRemoveFavorite(ticker) {
  return store.dispatch("public/changeFavorites", ticker);
};

var checkFavorite = function checkFavorite(ticker) {
  var data = store.getters["public/getAllFavorites"];
  return data.includes(ticker);
};

var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var validEmail = function validEmail(email) {
  return regex.test(email);
};

var regex$1 = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
var validPassword = function validPassword(password) {
  return regex$1.test(password);
};

var inputOnlyNumber = function inputOnlyNumber(number, fixed) {
  var numberSplit = String(number).split(".", 2);

  if (numberSplit.length > 1) {
    numberSplit[1] = numberSplit[1].substring(0, fixed);
    number = [numberSplit[0], numberSplit[1]].join(".");
  }

  return number;
};

var isMobile = function isMobile() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

var isPanelView = function isPanelView() {
  return store.state["public"].isPanelView;
};

var getTrend = function getTrend(value) {
  var bg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (typeof value === "number") {
    return trendType(value >= 0 ? "buy" : "sell", bg);
  } else {
    return trendType(value ? "buy" : "sell", bg);
  }
};

var percentToNumber = function percentToNumber(percent) {
  return Number(percent.replace("%", ""));
};

var convertArrayToObject = function convertArrayToObject(array, key) {
  var initialValue = {};
  return array.reduce(function (obj, item) {
    return _objectSpread2({}, obj, _defineProperty({}, item[key], item));
  }, initialValue);
};

var marketFilter = function marketFilter(market_id) {
  var MARKET = convertArrayToObject(store.state["public"].markets, "id");
  return MARKET[market_id];
};

var getSearch = function getSearch(isDesktop) {
  return isDesktop ? ["base_unit"] : ["base_unit", "quote_unit"];
};

var findTickersBase = function findTickersBase(tickers, findBy, data) {
  var isDesktop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var base = {
    market: findBy === "market" && data !== "Favorites" ? "quote_unit" : "Favorites",
    search: getSearch(isDesktop)
  };
  tickers = tickers.filter(function (ticker) {
    if (base[findBy] === "Favorites") {
      return checkFavorite(ticker.name);
    } else if (findBy === "market") {
      if (data === "All") return true;
      return data.toLowerCase() === ticker[base.market];
    } else if (findBy === "search") {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = base.search[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var row = _step.value;
          if (ticker[row].includes(data.toLowerCase())) return true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return base.search.map(function (row) {
        return ticker[row];
      }).join("").includes(data);
    }
  });
  return tickers;
};

var isAuth = function isAuth() {
  return store.getters["user/isLoggedIn"];
};

var authStatus = function authStatus() {
  return store.getters["user/authStatus"];
};

var getBalance = function getBalance() {
  return store.getters["user/getBalance"];
};

var getTickerAskSymbol = function getTickerAskSymbol(ticker) {
  var tickers = store.getters["public/getAllTickers"];
  return tickers[ticker].base_unit;
};

export { Balance, CURRENCY, Currency, MARKET, addOrRemoveFavorite, amountPrecision, authStatus, capitalizeFirstLetter, checkFavorite, convertArrayToObject, copyText, emailEncode, findTickersBase, getAllRegion, getBalance, getBestPrice, getDate, getMarketLastPrice, getMarketLastUSD, getMarketPriceChange, getOverrides, getStudiesOverrides, getTicker, getTickerAskSymbol, getTickerBidSymbol, getTickerID, getTickerPriceUSD, getTime, getTrend, getType, getURLParam, inputOnlyNumber, isAskSymbol, isAuth, isBidSymbol, isMarket, isMobile, isPanelView, jsonToParam, marketFilter, minAmount, minPrice, percentToNumber, pricePrecision, removeURLParam, runMessage, runNotice, toUTF8String, totalPrecision, translation, trendType, validEmail, validPassword };
