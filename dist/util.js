//////////////////// util
const { assign, keys } = Object;
const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};
const isArray = x => {
  return toType(x) === 'array';
};
export const isEmptyArray = arr => {
  return isArray(arr) ? arr.length === 0 : true;
};
export const isPromise = (x = {}) => {
  return x.then && toType(x.then) === 'function';
};
export const breakUpContros = c => {
  if (c.state) {
    return assign(c, {
      state: assign({}, c.state, { loading: {} }),
    });
  }
  const state = {},
    methods = {};
  keys(c).forEach(i => {
    state[i] = assign(c[i].state, { loading: {} });
    methods[i] = {};
    methods[i].syncs = c[i].syncs || {};
    methods[i].asyncs = c[i].asyncs || {};
  });
  return { state, methods };
};
////////////////////////////////////////////////////////////////
