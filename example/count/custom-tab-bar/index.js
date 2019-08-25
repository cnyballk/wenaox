import { ormComp } from 'wenaox';
const mapState = state => ({
  list: state.abbarList,
});
const mapMethods = () => {};
Component(
  ormComp(mapState, mapMethods)({
    data: {
      selected: 0,
      color: '#7A7E83',
      selectedColor: '#fe961c',
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset;
        const url = data.path;
        wx.switchTab({ url });
      },
    },
  })
);
