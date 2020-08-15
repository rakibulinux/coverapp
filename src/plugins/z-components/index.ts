import ZTable from "@/components/desktop/z-table.vue";
import FixI18n from "@/components/fix-i18n.vue";
import ZEmpty from "@/components/z-empty.vue";
import VueRippler from "@/library/vue-rippler";
import Vue from "vue";

Vue.use(VueRippler);
Vue.component("fix-i18n", FixI18n);
Vue.component("z-empty", ZEmpty);
Vue.component("z-table", ZTable);
