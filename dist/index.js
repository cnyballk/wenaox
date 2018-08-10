import produce from './immer.js';
//////////////////// util
const isEmptyArray = arr => {
  return isArray(arr) ? arr.length === 0 : true;
};
const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
const isArray = x => {
  return toType(x) === 'array';
};
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
  constructor(contros, middlewares) {
    const { state, methods } = breakUpContros(contros);
    this.state = state;
    this.middlewares = isEmptyArray(middlewares) ? false : middlewares;
    //绑定中间件
    this.bindMiddlewares =
      this.middlewares &&
      this.middlewares.map(fn => fn(this)).reduce((a, b) => p => a(b(p)));
    // 绑定方法
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
      // 留存next函数
      const next = payload => {
        const newState = produce(methods.syncs[syncs]).bind(
          this,
          method ? that.state[method] : that.state
        )(payload);
        method ? (that.state[method] = newState) : (this.state = newState);

        this.listeners.forEach(fn => fn());
      };
      // 使用中间件
      c[syncs] = this.bindMiddlewares ? this.bindMiddlewares(next) : next;
    }
    for (const async in methods.asyncs) {
      return c[async] = payload => {
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
//////////////// orm  用于page 映射methods以及state
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
//////////////// ormComp   用于Componet 映射methods以及state
export const ormComp = (mapState, mapMethods) => compConfig => {
  const app = getApp();
  const store = app.store;

  function update() {
    const state = store.state;
    const mappedState = mapState(state);
    this.setData(mappedState);
  }

  const {
    ready: _ready = () => {},
    detached: _detached = () => {},
  } = compConfig;

  function ready() {
    store.listen(update.bind(this));
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
