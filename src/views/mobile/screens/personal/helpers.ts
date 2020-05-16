import methods from "../methods";
import { _setting_group, _setting_row } from "@/components/mobile/settings";

export default {
  mixins: [methods],
  methods: {},
  components: {
    "setting-group": _setting_group,
    "setting-row": _setting_row
  }
};
