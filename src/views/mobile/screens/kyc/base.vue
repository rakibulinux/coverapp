<template>
  <panel-view class="kyc-screen">
    <head-bar title="KYC" @back="destroy" />
    <z-step :steps="KYCStep" />

    <form class="kyc-form">
      <div class="flex-row">
        <auth-input v-model="first_name" type="text" title="First Name" />
        <auth-input v-model="last_name" type="text" title="Last Name" />
      </div>
      <auth-input
        type="select"
        title="Country"
        placeholder="Select Country"
        :value="country_name"
        :list="countries()"
        :filter_keys="['name']"
        @change="onCountryChange"
      />
      <auth-input v-model="address" type="text" title="Address" />
      <div class="flex-row">
        <auth-input v-model="postcode" type="text" title="Postcode" />
        <auth-input v-model="city" type="text" title="City" />
      </div>

      <div @click="showBirthdayPicker">alo</div>

      <auth-button>
        Submit
      </auth-button>
    </form>
  </panel-view>
</template>

<script lang="ts">
import CountriesList from "countries-list";
import { DatePicker } from "cube-ui";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "z-step": () => import("@/components/mobile/z-step.vue"),
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class KYCScreen extends Mixins(ScreenMixin) {
  first_name = "";
  last_name = "";
  country = "US";
  address = "";
  postcode = "";
  city = "";

  birthday_picker?: DatePicker = null;

  get KYCStep() {
    return [
      {
        text: "Basic verification",
        done: true,
        loading: ["pending", "submitted"].includes(this.profile_label?.value)
      },
      {
        text: "ID Face verification",
        done: this.profile_label?.value == "verified",
        loading: ["pending", "submitted"].includes(this.profile_label?.value)
      },
      {
        text: "Done",
        done: this.document_label?.value == "verified",
        loading: this.document_label?.value == "pending"
      }
    ];
  }

  countries() {
    return CountriesList.countries;
  }

  showBirthdayPicker() {
    if (!this.birthday_picker) {
      this.birthday_picker = this.$createDatePicker({
        title: "Choose your birthday",
        min: new Date(1970, 1, 1),
        max: new Date(),
        value: new Date(),
        columnOrder: ["date", "month", "year"],
        onSelect: this.onBirthdayPickerSelect
      });
    }

    this.birthday_picker.show();
  }

  get country_name() {
    return CountriesList.countries[this.country].name;
  }

  get profile_label() {
    return this.UserController.labels.find(label => label.key == "profile");
  }

  get document_label() {
    return this.UserController.labels.find(label => label.key == "document");
  }

  onCountryChange(country_code: string) {
    this.country = country_code;
  }

  onBirthdayPickerSelect(_) {
    console.log(_);
  }
}
</script>

<style lang="less">
.kyc-form {
  margin-top: 12px;
  padding: 0 12px;

  .flex-row {
    display: flex;

    > * {
      flex: 1;
      padding: 0 8px;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }

  .z-auth-input {
    margin-top: 4px;
  }

  button {
    position: absolute;
    width: calc(100% - 12px * 2);
    left: 12px;
    bottom: 12px;
  }
}
</style>
