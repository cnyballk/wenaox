import { orm } from 'wenaox';
const mapState = state => ({
  // count: state.count,
});
const mapMethods = methods => ({});
const pageConfig = {
  //some config
  onLoad() {
    console.log('index2---onLoad');
  },
  onShow() {
    console.log('index2---onShow');
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      });
    }
  },
};

Page(orm(mapState, mapMethods)(pageConfig));
