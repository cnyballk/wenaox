import equal from './equal.js';

//////////////// orm  用于page 映射methods以及state
export const orm = (mapState, mapMethods) => pageConfig => {
  const app = getApp();
  const store = app.store;
  let __isHide__ = false;
  let update;
  let oldState;
  const {
    onLoad: _onLoad = () => {},
    onUnload: _onUnload = () => {},
    onShow: _onShow = () => {},
    onHide: _onHide = () => {},
  } = pageConfig;

  function onLoad(options) {
    update = function(options) {
      const state = store.state;
      const newState = mapState(state, options);
      if (!equal(oldState, newState)) {
        this.setData(newState);
        oldState = newState;
      }
    }.bind(this, options);

    store.listen(update);
    update.call(this, options);
    _onLoad.call(this, options);
  }

  function onShow() {
    if (!__isHide__) return;

    __isHide__ = false;
    store.listen(update);
    update.call(this);
    _onShow.call(this);
  }

  function onHide() {
    __isHide__ = true;
    _onHide.call(this);
    store.unListen(update);
  }

  function onUnload() {
    _onUnload.call(this);
    store.unListen(update);
  }

  return Object.assign({}, pageConfig, mapMethods(app.store.methods), {
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
  let update;
  let oldState;

  const {
    ready: _ready = () => {},
    detached: _detached = () => {},
  } = compConfig;

  function ready() {
    update = function() {
      const state = store.state;
      const newState = mapState(state);
      if (!equal(oldState, newState)) {
        this.setData(newState);
        oldState = newState;
      }
    }.bind(this);

    store.listen(update);
    update.call(this);
    _ready.call(this);
  }

  function detached() {
    _detached.call(this);
    store.unListen(update);
  }
  return Object.assign({}, compConfig, {
    methods: Object.assign(compConfig.methods, mapMethods(app.store.methods)),
    ready,
    detached,
  });
};

////////////////////////////////////////////////////////////////
//////////////// Provider
export const Provider = store => appConfig =>
  Object.assign({}, appConfig, { store });
////////////////////////////////////////////////////////////////
