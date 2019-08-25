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
  let __isHide__ = true;
  let update;
  let oldState = mapState(store.state);
  let newState;

  const {
    onLoad: _onLoad = () => {},
    onUnload: _onUnload = () => {},
    onShow: _onShow = () => {},
    onHide: _onHide = () => {},
  } = pageConfig;

  function onLoad(options) {
    update = function(options, cb) {
      if (!__isHide__) {
        newState = mapState(store.state, options);
        const deleteKeys = deleteEquleKey(oldState, newState);
        if (JSON.stringify(newState) !== '{}') {
          this.setData(newState, cb);
          oldState = assign(newState, deleteKeys);
        } else {
          cb && cb();
        }
      }
    }.bind(this, options);
    _onLoad.call(this, options);
  }

  function onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().__update__ && this.getTabBar().__update__();
    }
    store.listen(update);
    if (__isHide__) {
      __isHide__ = false;
      update.call(this, _onShow.bind(this));
    } else {
      _onShow.call(this);
      __isHide__ = false;
    }
  }

  function onHide() {
    __isHide__ = true;
    _onHide.call(this);
    store.unListen(update);
  }
  function onUnload() {
    __isHide__ = true;
    _onUnload.call(this);
    store.unListen(update);
    oldState = {};
  }
  return assign({}, pageConfig, mapMethods(app.store.methods), {
    data: assign(pageConfig.data || {}, oldState),
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
  let __isHide__ = true;
  let oldState = mapState(store.state);
  let update;
  const {
    attached: _attached1,
    detached: _detached1,
    lifetimes: { detached: _detached2, attached: _attached2 } = {},
    pageLifetimes: { show: _onShow = () => {}, hide: _onHide = () => {} } = {},
  } = compConfig;
  const _detached = _detached2 || _detached1 || (() => {});
  const _attached = _attached2 || _attached1 || (() => {});
  function attached() {
    this.__isHide__ = __isHide__;
    this.oldState = { ...oldState };
    if ('custom-tab-bar' === this.is.split('/')[0]) {
      show.call(this);
    }
    _attached.call(this);
  }
  function show() {
    update = function(cb) {
      if (!this.__isHide__) {
        const state = store.state;
        const newState = mapState(state);
        const deleteKeys = deleteEquleKey(this.oldState, newState);
        if (JSON.stringify(newState) !== '{}') {
          this.setData(newState, cb);
          this.oldState = assign(newState, deleteKeys);
        } else {
          cb && cb();
        }
      }
    }.bind(this);
    this.__update__ = update;
    store.listen(update);

    if (this.__isHide__) {
      this.__isHide__ = false;
      update.call(this, _onShow.bind(this));
    } else {
      _onShow.call(this);
      this.__isHide__ = false;
    }
  }

  function hide() {
    this.__isHide__ = true;
    _onHide.call(this);
    store.unListen(update);
  }
  function detached() {
    this.__isHide__ = false;
    _detached.call(this);
    store.unListen(update);
    this.oldState = {};
  }
  return assign({}, compConfig, {
    data: assign(compConfig.data || {}, oldState),
    methods: assign(compConfig.methods || {}, mapMethods(app.store.methods)),
    pageLifetimes: assign(compConfig.pageLifetimes || {}, {
      show,
      hide,
    }),
    lifetimes: assign(compConfig.lifetimes || {}, {
      detached,
      attached,
    }),
  });
};
////////////////////////////////////////////////////////////////
//////////////// Provider
export const Provider = store => appConfig => assign({}, appConfig, { store });
////////////////////////////////////////////////////////////////
