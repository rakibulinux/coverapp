const extend = (o, add) => {
  const out = Object.assign({}, o);
  for (const name in add) {
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
