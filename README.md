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

> [renaox][renaox-url] 的小程序版本

## Install

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
  asyncs: {
    asyncAddCount(payload, rootState) {
      setTimeout(this.addCount, 1e3);
    },
  },
};
//一个打印state改变前后的log中间件
const log = store => next => payload => {
  console.group('state改变前：', store.state);
  next(payload);
  console.log('state改变后：', store.state);
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
});
const pageConfig = {
  //some config
};

Page(orm(mapState, mapMethods)(pageConfig));
```

#### 在 page/index.wxml 中

```html
<view>{{count}}</view>
<view bindtap="addCount">count + 1</view>
<view bindtap="asyncAddCount">async count + 1</view>
<view bindtap="subtractCount">count - 1</view>
```

v0.2.0 增加了映射到 Component 的方法 ormComp

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
