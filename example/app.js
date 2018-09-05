//app.js
import { Store, Provider, regeneratorRuntime } from 'wenaox';

const state = {
  count: 0,
};
const methods = {
  syncs: {
    addCount(state, payload) {
      state.count = state.count + 1;
    },
    subtractCount(state, payload) {
      state.count = state.count - 1;
    },
  },
  asyncs: {
    async asyncAddCount(payload, rootState) {
      const c = await new Promise(resolve => {
        setTimeout(() => {
          resolve(1);
        }, 2e3);
      });
      this.addCount(c);
    },
  },
};
//一个打印state改变前后的log中间件
const log = store => fn => next => payload => {
  console.group('改变前：', store.state);
  next(fn, payload);
  console.log('改变后：', store.state);
  console.groupEnd();
};
//使用Store注册store  第一个参数为控制器对象，第二个参数为中间件数组
const store = new Store({ state, methods }, [log]);

const appConfig = {
  //some config
};
App(Provider(store)(appConfig));
