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
const store = new Store({ state, methods });

const appConfig = {
  //some config
};
App(Provider(store)(appConfig));
```

#### 在 page/index.js 中

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
