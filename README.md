# Wenaox

[![NPM version][npm-image]][npm-url]

[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/wenaox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/wenaox
[download-image]: https://img.shields.io/npm/dm/wenaox.svg?style=flat-square
[download-url]: https://npmjs.org/package/wenaox
[renaox-url]: https://github.com/cnyballk/renaox
[miniprogram-url]: https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?search-key=npm

一个微信小程序的共享数据的库（已有多个线上项目）

### 特点

- 支持中间件
- 中大型项目可多个 contro 区分模块
- asyncs 自带 loading
- 轻量、性能好

### 性能方面

- setData 确保后台态页面停止而在重新进入前台的时候刷新数据
- 采取 diff 新旧数据，保证一次只更新最少量的数据

## 开始

#### 安装

虽然可以直接引入，但是我建议使用 npm 安装开发，将会很方便

```bash
npm i -S wenaox
or
yarn add wenaox
```

> 关于小程序如何[构建 npm][miniprogram-url]

#### 实例化 Store

新建一个 store.js

```js
import { Store, regeneratorRuntime } from 'wenaox';
//数据
const state = {
  count: 0,
};
//方法
const methods = {
  //修改state的方法(只允许通过syncs的犯法代码进行修改)
  syncs: {
    addCount(state, payload) {
      state.count = state.count + 1;
    },
  },
  //包含副作用的方法
  asyncs: {
    asyncAddCount(payload, rootState) {
      setTimeout(() => {
        this.addCount(c);
      });
    },
  },
};
//使用Store注册store
// 单 contro 得时候
const store = new Store({ state, methods });
```

store 中的 state 和 methods 打印如下:

```json
{
  "state": { "count": 0 },
  "methods": { "addCount": fn, "asyncAddCount": fn }
  //略
}
```

但是如果很多页面的时候，共享的状态和方法将会很多，会很混乱，所以提供一个多 contro 的机制，可以根据页面或者功能来进行划分

```JS
// 多 contro 得时候

 const store = new Store({ controA: { state, methods } });

```

将会 Store 对 store 的 state 和 methods 通过 contro 的变量名进行一个细化区分:

```json
{
  "state": { "controA": { "count": 0 } },
  "methods": { "controA": { "addCount": fn, "asyncAddCount": fn } }
  //略
}
```

#### 在 app.js 中初始化

```js
//app.js
import { Provider } from 'wenaox';
import store from 'xxx路径/store';

const appConfig = {
  //some config
};
App(Provider(store)(appConfig));
```

#### 在 page 中使用

在 page.js 中连接 state 和 methods

```JS
import { orm } from 'wenaox';

// 返回需要的state和methods
const mapState = state => ({
  count: state.count,
});
const mapMethods = methods => ({
  addCount: methods.addCount,
  asyncAddCount: methods.asyncAddCount,
});
const pageConfig = {
  //some config
};
// 使用orm连接
Page(orm(mapState, mapMethods)(pageConfig));

```

在 page.wxml 中使用

```html
<view class="count">count</view>
<button bindtap="addCount">count + 1</button>
<button bindtap="asyncAddCount">async count + 1</button>
```

#### 在自定义组件中使用

由于小程序中的属性没有分辨组件还是 page 页面所以我另外写了一个对 自定义组件 的方法就是 ormComp

所以在自定义组件中使用的话仅仅只需要 js 中的 orm 替换成 ormComp 就可以了

#### 支持 async/await 以及 laoding

```js
const methods = {
  // ...略
  asyncs: {
    async asyncAddCount(payload, rootState) {
      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
      this.addCount(1);
    },
  },
};
```

而在使用 async/await 之后自动会生成一个 loading 变量

```js
{
  "loading": state.loading.asyncAddCount
}
```

可以在 mapState 中引入,**再也不用手动写 loading 了!!**
当然你不用的话,你不引入 对应的 loading 变量的话,wenaox 也不会再对 对应的 loading 进行更新,**避免性能损失**

#### 支持中间件

wenaox 为了方便,提供了中间件的一个开发和使用,下面是一个 wenaox 的一个 log 的中间件

```js
const log = store => next => (fn, payload) => {
  console.group('改变前：', store.state);
  next(fn, payload);
  console.log('改变后：', store.state);
  console.groupEnd();
};
```

#### 支持小程序自定义的 tabbar 的数据更新

小程序是可以自定义 tabbar 的,通过 wenaox 可以随时更改底部的 tab 的数量以及跳转的方法

所有的具体在下面的例子中也有展示

## Example

[计数器](https://github.com/phonycode/wenaox/tree/master/example/count)

### Concat

<img width="200" src="https://raw.githubusercontent.com/phonycode/wenaox/master/assets/WechatIMG2.jpeg">

### Change Log

- v1.0.0
  [兼容]自定义 tabbar 的 custom-tab-bar 组件的数据绑定
  [修复]由于 newState 导致的生命周期的重复

### 开源协议

[MIT](https://github.com/phonycode/wenaox/blob/master/LICENSE)
