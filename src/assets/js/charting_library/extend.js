  
const extend = (o, add) => {
  var out = Object.assign({}, o);
  for (var name in add) {
    if (
      "object" != typeof o[name] ||
      null === o[name] ||
      Array.isArray(o[name])
    ) {
      if (void 0 !== add[name]) {
        out[name] = add[name];
      }
    } else {
      out[name] = extend(o[name], add[name]);
    }
  }
  return out;
};

export default extend;