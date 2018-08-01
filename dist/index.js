import produce from './immer.js';
//////////////////// util
const breakUpContros = contros => {
  if (contros.state) {
    return contros;
  }
  const state = {},
    methods = {};
  Object.keys(contros).forEach(i => {
    state[i] = contros[i].state || {};
    methods[i] = {};
    methods[i].syncs = contros[i].syncs || {};
    methods[i].asyncs = contros[i].asyncs || {};
  });
  return { state, methods };
};
////////////////////////////////////////////////////////////////

//////////////// Store
export class Store {
  constructor(contros) {
    const { state, methods } = breakUpContros(contros);
    console.log(state, methods);
    this.state = state;
    this.methods = this.notify(methods);
    this.listeners = [];
  }
  listen(listener) {
    return this.listeners.push(listener);
  }
  unListen(listener) {
    return this.listeners.filter(fn => fn !== listener);
  }
  getState() {
    return this.state;
  }
  bindMethods(methods, method) {
    const c = {};
    const that = this;
    for (const syncs in methods.syncs) {
      c[syncs] = payload => {
        const newState = produce(methods.syncs[syncs]).bind(
          this,
          method ? that.state[method] : that.state
        )(payload);
        method ? (that.state[method] = newState) : (this.state = newState);
        this.listeners.forEach(fn => fn());
      };
    }
    for (const async in methods.asyncs) {
      c[async] = payload => {
        methods.asyncs[async].bind(
          method ? this.methods[method] : this.methods,
          payload,
          this.state
        )();
        this.listeners.forEach(fn => fn());
      };
    }
    return c;
  }
  notify(methods) {
    let c = {};
    if (methods.syncs) {
      c = this.bindMethods(methods);
    } else {
      for (const method in methods) {
        c[method] = this.bindMethods(methods[method], method);
      }
    }
    return c;
  }
}
////////////////////////////////////////////////////////////////
//////////////// orm  映射methods以及state
export const orm = (mapState, mapMethods) => pageConfig => {
  const app = getApp();
  const store = app.store;

  function update(options) {
    const state = store.state;
    const mappedState = mapState(state, options);
    this.setData(mappedState);
  }

  const {
    onLoad: _onLoad = () => {},
    onUnload: _onUnload = () => {},
  } = pageConfig;

  function onLoad(options) {
    store.listen(update.bind(this, options));
    update.call(this, options);
    _onLoad.call(this, options);
  }

  function onUnload(options) {
    _onUnload.call(this);
    store.unListen(update);
  }

  return Object.assign({}, pageConfig, mapMethods(app.store.methods), {
    onLoad,
    onUnload,
  });
};

////////////////////////////////////////////////////////////////
//////////////// Provider
export const Provider = store => appConfig =>
  Object.assign({}, appConfig, { store });
////////////////////////////////////////////////////////////////
