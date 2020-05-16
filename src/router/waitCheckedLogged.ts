import * as helpers from "@zsmartex/z-helpers";

const waitCheckedLogged = callback => {
  if (helpers.authStatus() !== "loading") {
    callback();
  } else {
    setTimeout(() => {
      waitCheckedLogged(callback);
    }, 10);
  }
};

export default waitCheckedLogged;
