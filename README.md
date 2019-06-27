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

   一切特性均在例子中展示

[计数器](https://github.com/phonycode/wenaox/tree/master/example/count)

### Change Log
- v1.0.0
  [兼容]自定义tabbar的custom-tab-bar组件的数据绑定
  [修复]由于 newState 导致的生命周期的重复

### 开源协议

[MIT](https://github.com/phonycode/wenaox/blob/master/LICENSE)
