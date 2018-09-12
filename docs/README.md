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

[简单的加减](https://github.com/cnyballk/wenaox/tree/master/example/count)

### Change Log

- v0.3.5
  修复 [#1](https://github.com/cnyballk/wenaox/issues/1)由于 breakUpContros 导致的 issue

  引入 regeneratorRuntime

  增加 [example](https://github.com/cnyballk/wenaox/tree/master/example)

* [更多](https://github.com/cnyballk/wenaox/blob/master/CHANGELOG.md)

### 开源协议

[MIT](https://github.com/cnyballk/wenaox/blob/master/LICENSE)
