import router from "@/router";
import store from "@/store";

export default payload => {
  switch (Object.keys(payload)[0]) {
    case "confirmation_email": {
      const token = payload.confirmation_email;
      store.dispatch("user/CONFIRM_EMAIL", token);
      break;
    }
    case "confirmation_reset": {
      const token = payload.confirmation_reset;
      store.dispatch("user/CHECK_RESET_TOKEN", token);
      break;
    }
    default: {
      router.push("/signin");
    }
  }
};
