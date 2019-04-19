import { orm } from 'wenaox';

const mapState = state => ({
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
});
const pageConfig = {
  //some config
  onLoad(options) {
    console.log(options);
    console.log('pageLoad');
    console.log(this.data.count);
  },
  onShow() {
    console.log('pageShow');
  },
};

Page(orm(mapState, mapMethods)(pageConfig));
