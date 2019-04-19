import equal from './equal.js';

const { assign } = Object;
const deleteEquleKey = (oldState, newState) => {
  const deleteKeys = {};
  for (let i in oldState) {
    if (equal(oldState[i], newState[i])) {
      deleteKeys[i] = newState[i];
      delete newState[i];
    }
  }
  return deleteKeys;
};
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
      if (!__isHide__) {
        const state = store.state;
        const newState = mapState(state, options);
        function callback() {
          cb && cb(options);
          if (!__isLoad__) {
            __isLoad__ = true;
            _onShow.call(this);
          }
        }
        const deleteKeys = deleteEquleKey(oldState, newState);
        if (JSON.stringify(newState) !== '{}') {
          this.setData(newState, callback);
          oldState = assign(newState, deleteKeys);
        } else {
          callback();
        }
      }
    }.bind(this, options);
    update.call(this, _onLoad.bind(this, options));
  }

  function onShow() {
    __isHide__ = false;
    store.listen(update);
    __isLoad__ && update.call(this, _onShow.bind(this));
  }

  function onHide() {
    __isHide__ = true;
    _onHide.call(this);
    store.unListen(update);
  }
  function onUnload() {
    __isLoad__ = false;
    __isHide__ = false;
    _onUnload.call(this);
    store.unListen(update);
    oldState = {};
  }
  return assign({}, pageConfig, mapMethods(app.store.methods), {
    onLoad,
    onShow,
    onHide,
    onUnload,
  });
};

////////////////////////////////////////////////////////////////
//////////////// ormComp   用于Componet 映射methods以及state
export const ormComp = (mapState, mapMethods) => compConfig => {
  const app = getApp();
  const store = app.store;
  let __isHide__ = false;
  let update;
  let oldState;
  const {
    detached: _detached1 = () => {},
    lifetimes: { detached: _detached2 } = {},
    pageLifetimes: { show: _onShow = () => {}, hide: _onHide = () => {} } = {},
  } = compConfig;
  const _detached = _detached1 || _detached2;
  function show() {
    update = function(cb) {
      if (!__isHide__) {
        const state = store.state;
        const newState = mapState(state);
        const deleteKeys = deleteEquleKey(oldState, newState);
        if (JSON.stringify(newState) !== '{}') {
          this.setData(newState, () => cb && cb());
          oldState = assign(newState, deleteKeys);
        } else {
          cb && cb();
        }
      }
    }.bind(this);
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
    __isHide__ = false;
    _detached.call(this);
    store.unListen(update);
    oldState = {};
  }
  return assign({}, compConfig, {
    methods: assign(compConfig.methods || {}, mapMethods(app.store.methods)),
    pageLifetimes: assign(compConfig.pageLifetimes || {}, {
      show,
      hide,
    }),
    lifetimes: assign(compConfig.lifetimes || {}, {
      detached,
    }),
  });
};
////////////////////////////////////////////////////////////////
//////////////// Provider
export const Provider = store => appConfig => assign({}, appConfig, { store });
////////////////////////////////////////////////////////////////
