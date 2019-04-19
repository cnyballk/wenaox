import { orm } from 'wenaox';
const mapState = state => ({
  count: state.count,
});
const mapMethods = methods => ({});
const pageConfig = {
  //some config
  onLoad() {
    console.log('onLoad');
  },
  onShow() {
    console.log('onShow');
  },
};

Page(orm(mapState, mapMethods)(pageConfig));
