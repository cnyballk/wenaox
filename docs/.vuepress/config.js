module.exports = {
  title: 'Wenaox',
  description: 'WeChat state management',
  base: '/wenaox/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速上手', link: '/quickstart' },
      { text: 'GitHub', link: 'https://github.com/cnyballk/wenaox' },
    ],
    sidebar: [
      {
        title: '开发指南',
        collapsable: false,
        children: [
          ['/', '介绍'],
          ['/quickstart', '快速上手'],
          ['/CHANGELOG', '更新日志'],
        ],
      },
    ],
  },
};
