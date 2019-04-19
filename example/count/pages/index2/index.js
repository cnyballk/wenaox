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
  },
};

Page(orm(mapState, mapMethods)(pageConfig));
