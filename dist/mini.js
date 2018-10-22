import equal from './equal.js';

const { assign } = Object;
//////////////// orm  用于page 映射methods以及state
export const orm = (mapState, mapMethods) => pageConfig => {
  const app = getApp();
  const store = app.store;
  let __isHide__ = false;
  let __isLoad__ = false;
  let update;
  let oldState;
  const {
    onLoad: _onLoad = () => {},
    onUnload: _onUnload = () => {},
    onShow: _onShow = () => {},
    onHide: _onHide = () => {},
  } = pageConfig;

  function onLoad(options) {
    update = function(options, cb) {
      const state = store.state;
      const newState = mapState(state, options);
      if (!equal(oldState, newState) || (!__isLoad__ || !__isHide__)) {
        this.setData(newState, () => {
          if (cb) {
            cb(options);
            __isLoad__ = true;
          }
        });
        oldState = newState;
      }
    }.bind(this, options);

    store.listen(update);
    update.call(this, _onLoad.bind(this));
  }

  function onShow() {
    if (!__isHide__) return;

    __isHide__ = false;
    store.listen(update);
    update.call(this, _onShow.bind(this));
  }

  function onHide() {
    __isHide__ = true;
    _onHide.call(this);
    store.unListen(update);
  }

  function onUnload() {
    _onUnload.call(this);
    __isLoad__ = false;
    store.unListen(update);
  }

  return assign({}, pageConfig, mapMethods(app.store.methods), {
    onLoad,
    onUnload,
    onShow,
    onHide,
  });
};

////////////////////////////////////////////////////////////////
//////////////// ormComp   用于Componet 映射methods以及state
export const ormComp = (mapState, mapMethods) => compConfig => {
  const app = getApp();
  const store = app.store;
  let __isReady__ = false;
  let __isHide__ = false;
  let update;
  let oldState;
  const {
    ready: _ready1,
    detached: _detached1,
    lifetimes: {
      ready: _ready2 = () => {},
      detached: _detached2 = () => {},
    } = {},
    pageLifetimes: { show: _onShow = () => {}, hide: _onHide = () => {} } = {},
  } = compConfig;
  const _ready = _ready1 || _ready2;
  const _detached = _detached1 || _detached2;

  function ready() {
    update = function(cb) {
      const state = store.state;
      const newState = mapState(state);
      if (!equal(oldState, newState) || !__isReady__ || __isHide__) {
        this.setData(newState, () => {
          if (cb) {
            cb();
            __isReady__ = true;
          }
        });
        oldState = newState;
      }
    }.bind(this);
    store.listen(update);
    update.call(this, _ready.bind(this));
  }
  function show() {
    if (!__isHide__) return;
    __isHide__ = false;
    store.listen(update);
    update.call(this, _onShow.bind(this));
  }

  function hide() {
    __isHide__ = true;
    _onHide.call(this);
    store.unListen(update);
  }

  function detached() {
    _detached.call(this);
    __isReady__ = false;
    store.unListen(update);
  }
  return assign({}, compConfig, {
    methods: assign(compConfig.methods || {}, mapMethods(app.store.methods)),
    pageLifetimes: assign(compConfig.pageLifetimes || {}, {
      show,
      hide,
    }),
    lifetimes: assign(compConfig.lifetimes || {}, {
      ready,
      detached,
    }),
  });
};

////////////////////////////////////////////////////////////////
//////////////// Provider
export const Provider = store => appConfig => assign({}, appConfig, { store });
////////////////////////////////////////////////////////////////
