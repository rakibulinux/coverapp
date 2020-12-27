import { Vue, Component } from "vue-property-decorator";

@Component
export default class Helpers extends Vue {
  $refs!: {
    [key: string]: any;
  }

  onClick(modal: string) {
    this.$refs[modal].create();
  }
};
