import { ormComp } from 'wenaox';

const mapState = state => ({
  count: state.count,
  //v0.3.2 增加了自带async的方法的loading
  loading: state.loading.asyncAddCount || false, //当使用async后自动生成的loading   loading.xxxName
});
const mapMethods = methods => ({
  addCount: methods.addCount,
  subtractCount: methods.subtractCount,
  asyncAddCount: methods.asyncAddCount,
});

const compConfig = {
  data: {},
  ready() {
    console.log('ready1');
  },
  detached() {
    console.log('detached1');
  },
  lifetimes: {
    ready() {
      console.log('====================================');
      console.log(this.data.count);
      console.log('====================================');
      console.log('ready2');
    },
    detached() {
      console.log('detached2');
    },
  },
  pageLifetimes: {
    show() {
      console.log('show2');
    },
    hide() {
      console.log('hide2');
    },
  },
};
Component(ormComp(mapState, mapMethods)(compConfig));
