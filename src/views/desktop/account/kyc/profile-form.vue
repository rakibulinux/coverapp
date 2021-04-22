<template>
  <form class="profile-form" @submit.prevent="update_profile">
    <form-row
      label="Country / Region"
      type="select"
      :rows="COUNTRY"
      v-model="country"
    />
    <form-row
      label="First name"
      type="input"
      placeholder="Please enter your first name"
      v-model="first_name"
    />
    <form-row
      label="Last name"
      type="input"
      placeholder="Please enter your last name"
      v-model="last_name"
    />

    <div class="form-row">
      <div class="form-label">Birthday:</div>
      <div class="form-control">
        <a-date-picker
          @change="onDatePickerChange"
          placeholder="Your birthday"
        />
      </div>
    </div>

    <form-row
      label="Address"
      type="input"
      placeholder="Please enter your address"
      v-model="address"
    />
    <div class="flex-form-row">
      <form-row
        label="Postcode"
        type="input"
        placeholder="Postcode"
        v-model="postcode"
      />
      <form-row label="City" type="input" placeholder="City" v-model="city" />
    </div>

    <div class="form-row">
      <div class="form-label"></div>
      <div class="form-control">
        <button type="submit" :disabled="button_disabled">
          Submit
          <a-icon v-if="loading" type="loading" />
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "form-row": () => import("./form-row.vue"),
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue")
  }
})
export default class ProfileForm extends Vue {
  loading = false;
  first_name = "";
  last_name = "";
  dob = "";
  address = "";
  postcode = "";
  city = "";
  country = this.COUNTRY[0];

  get COUNTRY() {
    return helpers.getAllRegion().map(country => country.name);
  }

  get button_disabled() {
    if (this.loading) return true;

    return !(
      this.first_name &&
      this.last_name &&
      this.dob &&
      this.address &&
      this.postcode &&
      this.city &&
      this.country
    );
  }

  onDatePickerChange(m_date) {
    this.dob = m_date.toISOString();
  }

  async update_profile() {
    this.loading = true;

    await this.UserController.update_profile(
      this.first_name,
      this.last_name,
      this.dob,
      this.address,
      this.postcode,
      this.city,
      helpers.getAllRegion().find(country => country.name == this.country).code
    );

    this.loading = false;
  }
}
</script>
