# Wenaox

[![NPM version][npm-image]][npm-url]

[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/wenaox.svg?style=flat-square
[npm-url]: https://npmjs.org/package/wenaox
[download-image]: https://img.shields.io/npm/dm/wenaox.svg?style=flat-square
[download-url]: https://npmjs.org/package/wenaox
[renaox-url]: https://github.com/cnyballk/renaox
[miniprogram-url]: https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?search-key=npm

一个轻量性能好的微信小程序的状态管理库（已有多个线上项目）

- [前言](#前言)
- [特点](#特点)
- [性能](#性能)
- [开始](#开始)
  - [安装](#安装)
  - [实例化 store](#实例化-store)
  - [在中大型小程序中的实践](#在中大型小程序中的实践)
  - [在 app 中初始化](#在-app-中初始化)
  - [创建页面](#创建页面)
  - [在自定义组件中使用](#在自定义组件中使用)
  - [跨页面同步数据](#跨页面同步数据)
  - [支持 async await 以及 laoding](#支持-async-await-以及-laoding)
  - [支持中间件](#支持中间件)
  - [支持小程序自定义的 tabbar 的数据更新](#支持小程序自定义的-tabbar-的数据更新)
- [例子](#例子)
- [联系我](#联系我)
- [Change Log](#change-log)
- [开源协议](#开源协议)

## 前言

工作中在开发小程序的时候，发现组件间通讯或跨页通讯会把程序搞得混乱不堪，变得极难维护和扩展，setData 的性能不是很好，浪费很多的资源，所以封装了一个 wenaox 作为使用，后决定开源出来给大家使用
如果觉得有什么问题或者建议，欢迎提 issue 和 pr，觉得不错，可以给个 star，鼓励一下 2333

## 特点

- 支持中间件
- 中大型项目可多个 contro 区分模块
- asyncs 自带 loading
- 轻量、性能好

## 性能

- 每次更新数据确保后台态页面停止刷新数据而在重新进入前台的时候开始
- 采取 diff 新旧数据，保证一次只更新最少量的数据

## 开始

#### 安装

虽然可以直接引入，但是建议使用 npm 安装开发，将会很方便

```bash
npm i -S wenaox
or
yarn add wenaox
```

> 关于小程序如何[构建 npm][miniprogram-url]

#### 实例化 store

新建一个 store.js

```js
import { Store } from 'wenaox';
//数据
const state = {
  count: 0,
};
//方法
const methods = {
  //修改state的方法(只允许通过syncs的方法进行修改)
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
//注册store
const store = new Store({ state, methods });
```

store 中的 state 和 methods 打印如下:

```js
{
  "state": { "count": 0 },
  "methods": { "addCount": fn, "asyncAddCount": fn }
  //略
}
```

#### 在中大型小程序中的实践

在中大型小程序中的实践中，共享的状态和方法将会很多，如果全部都定义在一起会很混乱，所以提供一个多 contro 的机制，可以根据页面或者功能来进行划分

```JS
// 下面是多 contro 的注册写法

 const store = new Store({ controA: { state, methods } });

```

将会 Store 对 store 的 state 和 methods 通过 contro 的变量名进行一个细化区分:

```js
{
  "state": { "controA": { "count": 0 } },
  "methods": { "controA": { "addCount": fn, "asyncAddCount": fn } }
  //略
}
```

#### 在 app 中初始化

```js
//app.js
import { Provider } from 'wenaox';
import store from 'xxx路径/store';

const appConfig = {
  //some config
};
App(Provider(store)(appConfig));
```

#### 创建页面

-在 page.js 中连接 state 和 methods

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

- 在 page.wxml 中使用

```html
<view class="count">count</view>
<button bindtap="addCount">count + 1</button>
<button bindtap="asyncAddCount">async count + 1</button>
```

点击按钮就会发生变化！一个简单的计数器！

#### 在自定义组件中使用

由于小程序中的属性没有分辨组件还是 page 页面所以我另外写了一个对 自定义组件 的方法就是 ormComp

所以在自定义组件中使用的话仅仅只需要 js 中的 orm 替换成 ormComp 就可以了

```js
Component(ormComp(mapState, mapMethods)(compConfig));
```

#### 跨页面同步数据

使用 wenaox 你不用关心跨页数据同步，任何地方的修改，都会同步到使用到的地方［仅限于正在显示的页面/组建］

这是因为 wenaox 在页面栈中 hide 的页面不执行更新，而是等待 onshow 事件才重新进行更新，这是为了更好的**性能**！

#### 支持 async await 以及 laoding

在头部引入 regeneratorRuntime 即可使用 async/await

```
import { regeneratorRuntime } from  'wenaox'

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

保证流动完所有的中间件才进行更新数据

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

## 例子

[计数器](https://github.com/phonycode/wenaox/tree/master/example/count)

## 联系我

<img width="200" src="https://raw.githubusercontent.com/phonycode/wenaox/master/assets/WechatIMG2.jpeg">

## Change Log

- v1.2.1
  - [修复] 当进入页面时不触发 mapState 判断
- v1.2.0
  - [修复] 旧 data 不初始化
- v1.1.1
  - [修复] 页面返回不更新数据
- v1.1.0
  - [重构] data 直接绑定，增快速度
  - [不兼容] page 页中初始化 mapState 将不再提供 options 参数
- v1.0.0
  - [兼容] 自定义 tabbar 的 custom-tab-bar 组件的数据绑定
  - [修复] 由于 newState 导致的生命周期的重复

## 开源协议

[MIT](https://github.com/phonycode/wenaox/blob/master/LICENSE)
