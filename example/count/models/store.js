import { Store, regeneratorRuntime } from 'wenaox';
const state = {
  count: 0,
  count2: 2,
  abbarList: [
    {
      pagePath: '/pages/index/index',
      text: 'index1',
      iconPath: 'test.jpg',
      selectedIconPath: 'test.jpg',
    },
    {
      pagePath: '/pages/index2/index',
      text: 'index2',
      iconPath: 'test.jpg',
      selectedIconPath: 'test.jpg',
    },
  ],
};
const methods = {
  syncs: {
    addCount(state, payload) {
      state.count = state.count + 1;
    },
    subtractCount(state, payload) {
      state.count = state.count - 1;
    },
    addCount2(state, payload) {
      state.count2 = state.count2 + 1;
    },
    /**
     * @param {*} payload booolean
     */
    changeList(state, payload) {
      state.abbarList = payload
        ? [
            {
              pagePath: '/pages/index/index',
              text: 'index1',
              iconPath: 'test.jpg',
              selectedIconPath: 'test.jpg',
            },
            {
              pagePath: '/pages/index2/index',
              text: 'index2',
              iconPath: 'test.jpg',
              selectedIconPath: 'test.jpg',
            },
          ]
        : [
            {
              pagePath: '/pages/index/index',
              text: 'index1',
              iconPath: 'test.jpg',
              selectedIconPath: 'test.jpg',
            },
            {
              pagePath: '/pages/index3/index',
              text: 'index3',
              iconPath: 'test.jpg',
              selectedIconPath: 'test.jpg',
            },
          ];
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
const log = store => next => (fn, payload) => {
  console.group('改变前：', store.state);
  next(fn, payload);
  console.log('改变后：', store.state);
  console.groupEnd();
};
//使用Store注册store  第一个参数为控制器对象，第二个参数为中间件数组
const store = new Store({ state, methods }, [log]);

export default store;
