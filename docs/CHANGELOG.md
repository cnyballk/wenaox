# wenaox 更新记录

- v0.4.4
  修复更换场景值没有触发到 load、show 生命周期

- v0.4.3
  优化生命周期

- v0.4.2
  优化生命周期

- v0.4.1
  修复 page 初始化 show 调用问题

* v0.4.0
  修复不使用中间导致 next 的函数错误
  增加 ormCom 的生命周期兼容以及监听父页面的 show 和 hide

- v0.3.7

  修复 loading 在失败没有取消的问题

- v0.3.6

  修复多个中间件导致的参数传递错误

- v0.3.5
  修复 [#1](https://github.com/cnyballk/wenaox/issues/1)由于 breakUpContros 导致的 issue

  引入 regeneratorRuntime

  增加 [example](https://github.com/cnyballk/wenaox/tree/master/example)

* 0.3.4
  修复了 onload 在 orm 注入 state 之前加载的 bug

- v0.3.3
  修复 onload 在注入 state 之前执行出现的 bug

* v0.3.2
  继续优化了 orm 和 ormComp 的性能，以及加入 loading

- v0.2.0
  增加了映射到 Component 的方法 ormComp
