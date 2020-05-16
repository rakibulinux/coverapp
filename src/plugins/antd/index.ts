import Vue from "vue";
import zContent from "@/layouts/desktop/z-content.vue";
import {
  Icon,
  Layout,
  Menu,
  Button,
  Card,
  AutoComplete,
  Select,
  Dropdown,
  Checkbox,
  Input,
  DatePicker,
  Pagination,
  Modal,
  Tooltip,
  Spin,
  Switch
} from "ant-design-vue";

Vue.use(Icon);
Vue.use(Layout);
Vue.use(Checkbox);
Vue.use(Menu);
Vue.use(Button);
Vue.use(Card);
Vue.use(AutoComplete);
Vue.use(Select);
Vue.use(Dropdown);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Pagination);
Vue.use(Modal);
Vue.use(Tooltip);
Vue.use(Spin);
Vue.use(Switch);
Vue.component("z-content", zContent);
