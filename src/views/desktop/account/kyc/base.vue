<template>
  <div class="setting-main kyc">
    <div class="setting-head">
      KYC Account verification
    </div>
    <div v-if="is_uploaded_documents" class="setting-body"></div>
    <div v-else class="setting-body">
      <form @submit.prevent="onSubmit">
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
        <form-row
          label="Type of certificate"
          type="select"
          :rows="[
            'Passport',
            'Identity card',
            'Driver license',
            'Utility Bill'
          ]"
          v-model="doc_type"
        />
        <form-row
          label="ID Number"
          type="input"
          placeholder="Please enter your ID Number"
          v-model="doc_number"
        />
        <div class="form-row">
          <label class="form-label">ID photo：</label>
          <div class="form-control upload-photos">
            <ul class="photos-list">
              <li class="front">
                <div class="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileChange($event, 'front')"
                  />
                  <div v-if="front_upload_data" class="img-uploaded">
                    <img :src="front_upload_data" class="preview" />
                  </div>
                  <div v-else class="upload-area">
                    <img src="@/assets/img/action_add.png" />
                    <p>Click to upload the front side of the ID photo</p>
                  </div>
                </div>
                <img src="@/assets/img/kyc_example.png" class="thumbnail-box" />
                <div class="upload-notice">
                  <p>
                    Avatar, ID number, gender, address, etc. need to be clear
                  </p>
                </div>
              </li>
              <li class="back">
                <div class="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileChange($event, 'back')"
                  />
                  <div v-if="back_upload_data" class="img-uploaded">
                    <img :src="back_upload_data" class="preview" />
                  </div>
                  <div v-else class="upload-area">
                    <img src="@/assets/img/action_add.png" />
                    <p>Click to upload the back side of the ID photo</p>
                  </div>
                </div>
                <img src="@/assets/img/kyc_example.png" class="thumbnail-box" />
                <div class="upload-notice">
                  <p>Issuing authority, the effective date need to be clear</p>
                </div>
              </li>
              <li class="in-hand">
                <div class="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileChange($event, 'in_hand')"
                  />
                  <div v-if="in_hand_upload_data" class="img-uploaded">
                    <img :src="in_hand_upload_data" class="preview" />
                  </div>
                  <div v-else class="upload-area">
                    <img src="@/assets/img/action_add.png" />
                    <p>Upload a hand-held ID photo</p>
                  </div>
                </div>
                <img src="@/assets/img/kyc_example.png" class="thumbnail-box" />
                <div class="upload-notice">
                  <p>Hand-held ID photo standards:</p>
                  <p>1. The character avatar is clear;</p>
                  <p>2. The identity document information is clear;</p>
                  <p>
                    3. A paper with the words "[NAMEEXCHANGE]+ application date"
                    is displayed next to the ID certificate;
                  </p>
                  <p>
                    4. Does not support certificate certification for people
                    over 60 years old.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label" />
          <div class="form-control">
            <button type="submit" :disabled="button_disabled">
              Submit
              <a-icon v-if="loading" type="loading" />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import UserController from "@/controllers/user";

@Component({
  components: {
    "form-row": () => import("./form-row.vue"),
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue")
  }
})
export default class AccountKYC extends Vue {
  loading = false;
  first_name = "";
  last_name = "";
  country = this.COUNTRY[0];
  doc_type = "Passport";
  doc_number = "";
  front_upload_data?: string | ArrayBuffer = null;
  back_upload_data?: string | ArrayBuffer = null;
  in_hand_upload_data?: string | ArrayBuffer = null;
  front_upload?: File;
  back_upload?: File;
  in_hand_upload: File;

  get button_disabled() {
    if (this.loading) return true;
  }

  get is_uploaded_documents() {
    return store.state.user.labels.find(
      label => label.key === "document" && label.value !== "rejected"
    );
  }

  get COUNTRY() {
    return helpers.getAllRegion().map(country => country.name);
  }

  mounted() {
    ZSmartModel.on("region", country => (this.country = country));
    ZSmartModel.on("doc_type", doc_type => (this.doc_type = doc_type));
  }

  onFileChange($event: Event, type: "front" | "back" | "in_hand") {
    const files = ($event.target as any).files as File[];
    if (!["front", "back", "in_hand"].includes(type)) return;
    if (!files.length) return;
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    this[`${type}_upload`] = file;
    reader.onload = e => (this[`${type}_upload_data`] = e.target.result);
  }
  async onSubmit() {
    this.loading = true;
    const formData = new FormData();
    formData.set("first_name", this.first_name);
    formData.set("last_name", this.last_name);
    formData.set("country", this.country);
    formData.set("doc_type", this.doc_type);
    formData.set("doc_number", this.doc_number);
    formData.set("front_upload", this.front_upload);
    formData.set("back_upload", this.back_upload);
    formData.set("in_hand_upload", this.in_hand_upload);
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    try {
      await new ApiClient("applogic").post(
        "resource/documents",
        formData,
        config
      );
      helpers.runNotice("success", "Documents upload was successful");
      await UserController.get_labels();
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
      this.first_name = "";
      this.last_name = "";
      this.country = "";
      this.doc_type = "";
      this.doc_number = "";
      this.front_upload = null;
      this.back_upload = null;
      this.in_hand_upload = null;
      this.front_upload_data = null;
      this.back_upload_data = null;
      this.in_hand_upload_data = null;
    }
  }
}
</script>
