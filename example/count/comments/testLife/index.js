// comments/testLife/index.js
Component({
  data: {},
  ready() {
    console.log('ready1')
  },
  detached() {
    console.log('detached1')
  },
  lifetimes: {
    ready() {
      console.log('ready3')
    },
    detached() {
      console.log('detached3')
    },
  },
  pageLifetimes: {
    show() {
      console.log('show3')
    },
    hide() {
      console.log('hide3')
    }
  }
})
