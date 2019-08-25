import { orm } from 'wenaox';

const mapState = (state, options) => ({
  count: state.count,
  count2: state.count2,
  //v0.3.2 增加了自带async的方法的loading
  loading: state.loading.asyncAddCount || false, //当使用async后自动生成的loading   loading.xxxName
});
const mapMethods = methods => ({
  addCount: methods.addCount,
  addCount2: methods.addCount2,
  subtractCount: methods.subtractCount,
  asyncAddCount: methods.asyncAddCount,
  changeList: methods.changeList,
});
const pageConfig = {
  _boolean: true,
  //some config
  onLoad(options) {
    console.log(options);
    console.log('pageLoad');
    console.log(this.data.count);
    var pages = getCurrentPages();
    console.log(pages, pages[pages.length - 1]);
  },
  onShow() {
    console.log('pageShow');
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }
  },
  _changeList() {
    this._boolean = !this._boolean;
    this.changeList(this._boolean);
  },
};

Page(orm(mapState, mapMethods)(pageConfig));
