import extend from "./extend";
import options from "./options";
import presets from "./presets";

export default class Model {
  constructor(opts) {
    if (
      ((this._id =
        "tradingview_" +
        ((1048576 * (1 + Math.random())) | 0).toString(16).substring(1)),
      (this._ready = false),
      (this._readyHandlers = []),
      (this._onWindowResize = this._autoResizeChart.bind(this)),
      !opts.datafeed)
    ) {
      throw new Error("Datafeed is not defined");
    }
    if (((this._options = extend(options, opts)), opts.preset)) {
      var p = presets[opts.preset];
      if (p) {
        if (void 0 !== this._options.disabled_features) {
          this._options.disabled_features = this._options.disabled_features.concat(
            p.disabled_features
          );
        } else {
          this._options.disabled_features = p.disabled_features;
        }
        if (void 0 !== this._options.enabled_features) {
          this._options.enabled_features = this._options.enabled_features.concat(
            p.enabled_features
          );
        } else {
          this._options.enabled_features = p.enabled_features;
        }
      } else {
        console.warn("Unknown preset: `" + opts.preset + "`");
      }
    }
    if (
      "Dark" === this._options.theme &&
      void 0 === this._options.loading_screen
    ) {
      this._options.loading_screen = {
        backgroundColor: "#131722"
      };
    }
    this._create();
  }
  onChartReady(t) {
    if (this._ready) {
      t.call(this);
    } else {
      this._readyHandlers.push(t);
    }
  }
  headerReady() {
    var t = this;
    return this._innerWindowLoaded.then(function() {
      return t._innerWindow().headerReady();
    });
  }
  onGrayedObjectClicked(isBgroundImg) {
    this._innerAPI().onGrayedObjectClicked(isBgroundImg);
  }
  onShortcut(s, e) {
    this._innerWindow().createShortcutAction(s, e);
  }
  subscribe(event, subName) {
    this._innerAPI().subscribe(event, subName);
  }
  unsubscribe(address, callback) {
    this._innerAPI().unsubscribe(address, callback);
  }
  chart(data) {
    return this._innerAPI().chart(data);
  }
  setLanguage(data) {
    this.remove();
    /** @type {string} */
    this._options.locale = data;
    this._create();
  }
  setSymbol(elem, value, settings) {
    this._innerAPI().changeSymbol(elem, value + "", settings);
  }
  remove() {
    window.removeEventListener("resize", this._onWindowResize);
    this._readyHandlers.splice(0, this._readyHandlers.length);
    delete window[this._id];
    if (this._iFrame.parentNode) {
      this._iFrame.parentNode.removeChild(this._iFrame);
    }
  }
  closePopupsAndDialogs() {
    this._innerAPI().closePopupsAndDialogs();
  }
  selectLineTool(isBgroundImg) {
    this._innerAPI().selectLineTool(isBgroundImg);
  }
  selectedLineTool() {
    return this._innerAPI().selectedLineTool();
  }
  save(refreshForm) {
    this._innerAPI().saveChart(refreshForm);
  }
  load(param, skin) {
    this._innerAPI().loadChart({
      json: param,
      extendedData: skin
    });
  }
  getSavedCharts(isBgroundImg) {
    this._innerAPI().getSavedCharts(isBgroundImg);
  }
  loadChartFromServer(isBgroundImg) {
    this._innerAPI().loadChartFromServer(isBgroundImg);
  }
  saveChartToServer(isBgroundImg, stgs, index, concurrents) {
    this._innerAPI().saveChartToServer(isBgroundImg, stgs, index, concurrents);
  }
  removeChartFromServer(preflightData, prefetch) {
    this._innerAPI().removeChartFromServer(preflightData, prefetch);
  }
  onContextMenu(e) {
    this._innerAPI().onContextMenu(e);
  }
  createButton(type) {
    return this._innerWindow().createButton(type);
  }
  showNoticeDialog(isBgroundImg) {
    this._innerAPI().showNoticeDialog(isBgroundImg);
  }
  showConfirmDialog(link) {
    this._innerAPI().showConfirmDialog(link);
  }
  showLoadChartDialog() {
    this._innerAPI().showLoadChartDialog();
  }
  showSaveAsChartDialog() {
    this._innerAPI().showSaveAsChartDialog();
  }
  symbolInterval() {
    return this._innerAPI().getSymbolInterval();
  }
  mainSeriesPriceFormatter() {
    return this._innerAPI().mainSeriesPriceFormatter();
  }
  getIntervals() {
    return this._innerAPI().getIntervals();
  }
  getStudiesList() {
    return this._innerAPI().getStudiesList();
  }
  addCustomCSSFile(isBgroundImg) {
    this._innerWindow().addCustomCSSFile(isBgroundImg);
  }
  applyOverrides(overrides) {
    this._options = extend(this._options, {
      overrides: overrides
    });
    this._innerWindow().applyOverrides(overrides);
  }
  applyStudiesOverrides(isBgroundImg) {
    this._innerWindow().applyStudiesOverrides(isBgroundImg);
  }
  watchList() {
    return this._innerAPI().watchlist();
  }
  activeChart() {
    return this._innerAPI().activeChart();
  }
  chartsCount() {
    return this._innerAPI().chartsCount();
  }
  layout() {
    return this._innerAPI().layout();
  }
  setLayout(mode) {
    this._innerAPI().setLayout(mode);
  }
  layoutName() {
    return this._innerAPI().layoutName();
  }
  changeTheme(themeid) {
    this._innerWindow().changeTheme(themeid);
  }
  takeScreenshot() {
    this._innerAPI().takeScreenshot();
  }
  lockAllDrawingTools() {
    return this._innerAPI().lockAllDrawingTools();
  }
  hideAllDrawingTools() {
    return this._innerAPI().hideAllDrawingTools();
  }
  undoRedoState() {
    return this._innerAPI().undoRedoState();
  }
  _innerAPI() {
    return this._innerWindow().tradingViewApi;
  }
  _innerWindow() {
    return this._iFrame.contentWindow;
  }
  _autoResizeChart() {
    if (this._options.fullscreen) {
      /** @type {string} */
      this._iFrame.style.height = window.innerHeight + "px";
    }
  }
  _create() {
    var _this = this;
    var html = this._render();
    /** @type {(Element|null)} */
    var e = document.getElementById(this._options.container_id);
    if (null === e) {
      throw new Error(
        "There is no such element - #" + this._options.container_id
      );
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
    this._innerWindowLoaded = new Promise(function(displayChangeFn) {
      /**
       * @return {undefined}
       */
      var listener = function() {
        img.removeEventListener("load", listener, false);
        displayChangeFn();
      };
      img.addEventListener("load", listener, false);
    });
    this._innerWindowLoaded.then(function() {
      _this._innerWindow().widgetReady(function() {
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
  _render() {
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
    var e =
      (this._options.library_path || "") +
      "static/" +
      encodeURIComponent(this._options.locale) +
      "-tv-chart.9a97ec3c5cba51244359.html#symbol=" +
      encodeURIComponent(this._options.symbol) +
      "&interval=" +
      encodeURIComponent(this._options.interval) +
      (this._options.timeframe
        ? "&timeframe=" + encodeURIComponent(this._options.timeframe)
        : "") +
      (this._options.toolbar_bg
        ? "&toolbarbg=" +
          encodeURIComponent(this._options.toolbar_bg.replace("#", ""))
        : "") +
      (this._options.studies_access
        ? "&studiesAccess=" +
          encodeURIComponent(JSON.stringify(this._options.studies_access))
        : "") +
      "&widgetbar=" +
      encodeURIComponent(JSON.stringify(this._options.widgetbar)) +
      (this._options.drawings_access
        ? "&drawingsAccess=" +
          encodeURIComponent(JSON.stringify(this._options.drawings_access))
        : "") +
      "&timeFrames=" +
      encodeURIComponent(JSON.stringify(this._options.time_frames)) +
      "&locale=" +
      encodeURIComponent(this._options.locale) +
      "&uid=" +
      encodeURIComponent(this._id) +
      "&clientId=" +
      encodeURIComponent(String(this._options.client_id)) +
      "&userId=" +
      encodeURIComponent(String(this._options.user_id)) +
      (this._options.charts_storage_url
        ? "&chartsStorageUrl=" +
          encodeURIComponent(this._options.charts_storage_url)
        : "") +
      (this._options.charts_storage_api_version
        ? "&chartsStorageVer=" +
          encodeURIComponent(this._options.charts_storage_api_version)
        : "") +
      (this._options.custom_css_url
        ? "&customCSS=" + encodeURIComponent(this._options.custom_css_url)
        : "") +
      (this._options.auto_save_delay
        ? "&autoSaveDelay=" +
          encodeURIComponent(String(this._options.auto_save_delay))
        : "") +
      "&debug=" +
      encodeURIComponent(String(this._options.debug)) +
      (this._options.snapshot_url
        ? "&snapshotUrl=" + encodeURIComponent(this._options.snapshot_url)
        : "") +
      (this._options.timezone
        ? "&timezone=" + encodeURIComponent(this._options.timezone)
        : "") +
      (this._options.study_count_limit
        ? "&studyCountLimit=" +
          encodeURIComponent(String(this._options.study_count_limit))
        : "") +
      (this._options.symbol_search_request_delay
        ? "&ssreqdelay=" +
          encodeURIComponent(String(this._options.symbol_search_request_delay))
        : "") +
      (this._options.theme
        ? "&theme=" + encodeURIComponent(String(this._options.theme))
        : "");
    return (
      '<iframe id="' +
      this._id +
      '" name="' +
      this._id +
      '"  src="' +
      e +
      '"' +
      (this._options.autosize || this._options.fullscreen
        ? ""
        : ' width="' +
          this._options.width +
          '" height="' +
          this._options.height +
          '"') +
      ' frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen style="display:block;"></iframe>'
    );
  }
}