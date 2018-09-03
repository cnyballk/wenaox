# Wenaox

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/wenaox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/wenaox
[download-image]: https://img.shields.io/npm/dm/wenaox.svg?style=flat-square
[download-url]: https://npmjs.org/package/wenaox
[renaox-url]: https://github.com/cnyballk/renaox
[miniprogram-url]: https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?search-key=npm

wechat state management

### 特点

- 支持中间件
- 中大型项目可多个 contro 区分模块
- asyncs 自带 loading
- 轻量、性能好

### 安装

```bash
npm i -S wenaox
or
yarn add wenaox
```

> 小程序如何[构建 npm][miniprogram-url]

## Example

> 简单说说怎么使用,多个 Contro 可以去[renaox][renaox-url]看看，构造 Store 是一样的

#### 在 app.js 中

> 使用 Provider 注入 store

```js
import { Store, Provider } from 'wenaox';

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
  async asyncAddCount(payload, rootState) {
    const c = await new Promise(resolve => {
      setTimeout(() => {
        resolve(1);
      }, 2e3);
    });
    this.addCount(c);
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
```

#### 在 page/index.js 中

> 使用 orm 往 page 中注入 state 以及 methods

```js
import { orm } from 'wenaox';

const mapState = state => ({
  count: state.count,
});
const mapMethods = methods => ({
  addCount: methods.addCount,
  subtractCount: methods.subtractCount,
  asyncAddCount: methods.asyncAddCount,
  //自带async的方法的loading
  loading: state.loading.asyncAddCount || false, //当使用async后自动生成的loading   loading.xxxName
});
const pageConfig = {
  //some config
};

Page(orm(mapState, mapMethods)(pageConfig));
```

#### 在 page/index.wxml 中

```html
<view>{{loading ? "loading..." : count}}</view>
<view bindtap="addCount">count + 1</view>
<view bindtap="asyncAddCount">async count + 1</view>
<view bindtap="subtractCount">count - 1</view>
```

#### 在 一个 components 的 js 文件中

> 使用 ormComp 往 page 中注入 state 以及 methods 使用方法一样

```js
import { ormComp } from 'wenaox';

const mapState = state => ({
  count: state.count,
});
const mapMethods = methods => ({
  addCount: methods.addCount,
  subtractCount: methods.subtractCount,
  asyncAddCount: methods.asyncAddCount,
});
const compConfig = {
  //some config
};

Component(ormComp(mapState, mapMethods)(compConfig));
```

## 开源协议

MIT
