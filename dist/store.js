import produce from './immer.js';
import { breakUpContros, isEmptyArray, isPromise } from './util';
//////////////// Store
export class Store {
  constructor(contros, middlewares) {
    const { state, methods } = breakUpContros(contros);
    this.state = state;
    this.middlewares = isEmptyArray(middlewares) ? false : middlewares;
    // 绑定方法
    this.methods = this.notify(methods);
    this.listeners = [];
  }
  listen(listener) {
    this.listeners.push(listener);
  }
  unListen(listener) {
    this.listeners = this.listeners.filter(fn => fn !== listener);
  }
  getState() {
    return this.state;
  }
  _toggleLoading(async, method, bool) {
    const newState = produce(state => {
      state['loading'][async] = bool;
    }).bind(this, method ? this.state[method] : this.state)();
    method ? (this.state[method] = newState) : (this.state = newState);
    this.listeners.forEach(fn => fn());
  }
  bindMethods(methods, method) {
    const c = {};
    const that = this;

    //同步
    for (const syncs in methods.syncs) {
      //绑定中间件
      this.bindMiddlewares =
        this.middlewares &&
        this.middlewares
          .map(fn => fn(this))
          .reduce((a, b) => (f, p) => a(b(f, p)));
      // 留存next函数
      const next = (sync, payload) => {
        const newState = produce(sync).bind(
          this,
          method ? that.state[method] : that.state
        )(payload);
        method ? (that.state[method] = newState) : (this.state = newState);

        this.listeners.forEach(fn => fn());
      };
      // 使用中间件
      c[syncs] = this.bindMiddlewares
        ? this.bindMiddlewares(next).bind(this, methods.syncs[syncs])
        : next;
    }
    //异步
    for (const async in methods.asyncs) {
      c[async] = payload => {
        const p = methods.asyncs[async].bind(
          method ? this.methods[method] : this.methods,
          payload,
          this.state
        )();

        if (isPromise(p)) {
          this._toggleLoading(async, method, true);
          p.then(() => {
            this._toggleLoading(async, method, false);
          });
        }

        return p;
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
