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
      if (!__isHide__) {
        const state = store.state;
        const newState = mapState(state, options);
        if (!equal(oldState, newState)) {
          this.setData(newState, () => {
            cb && cb(options);
            if (!__isLoad__) {
              __isLoad__ = true;
              _onShow.call(this);
            }
          });
        } else {
          cb && cb(options);
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
    _onUnload.call(this);
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
    pageLifetimes: { show: _onShow = () => {}, hide: _onHide = () => {} } = {},
  } = compConfig;
  function show() {
    update = function(cb) {
      if (!__isHide__) {
        const state = store.state;
        const newState = mapState(state);
        if (!equal(oldState, newState)) {
          this.setData(newState, () => cb && cb());
          oldState = newState;
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
  return assign({}, compConfig, {
    methods: assign(compConfig.methods || {}, mapMethods(app.store.methods)),
    pageLifetimes: assign(compConfig.pageLifetimes || {}, {
      show,
      hide,
    }),
  });
};
////////////////////////////////////////////////////////////////
//////////////// Provider
export const Provider = store => appConfig => assign({}, appConfig, { store });
////////////////////////////////////////////////////////////////
