import "@/assets/css/layouts/desktop/base.less";
import "@/assets/css/themes/custom/index.less";
import zCard from "@/layouts/desktop/z-card.vue";
import zContent from "@/layouts/desktop/z-content.vue";
import {
  AutoComplete,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Dropdown,
  Icon,
  Input,
  Layout,
  Menu,
  Modal,
  Pagination,
  Progress,
  Select,
  Slider,
  Spin,
  Switch,
  Tabs,
  Tooltip
} from "ant-design-vue";
import Vue from "vue";

Vue.use(Icon);
Vue.use(Layout);
Vue.use(Checkbox);
Vue.use(Menu);
Vue.use(Button);
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
Vue.use(Tabs);
Vue.use(Slider);
Vue.use(Drawer);
Vue.use(Progress);
Vue.component("z-content", zContent);
Vue.component("z-card", zCard);
