<template>
  <form class="document-form" @submit.prevent="onSubmit">
    <form-row
      label="Type of certificate"
      type="select"
      :rows="['Passport', 'Identity card', 'Driver license', 'Utility Bill']"
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
              Avatar, ID number, gender, address, etc. need to be clear
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
              Issuing authority, the effective date need to be clear
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
              Hand-held ID photo standards:
              <br />
              1. The character avatar is clear;
              <br />
              2. The identity document information is clear;
              <br />
              3. A paper with the words "[NAMEEXCHANGE]+ application date"
              displayed next to the ID certificate;
              <br />
              4. Does not support certificate certification for people over 60
              over 60 years old.
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-row">
      <div class="form-label" />
      <div class="form-control">
        <button type="submit" :disabled="loading">
          Submit
          <a-icon v-if="loading" type="loading" />
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import ApiClient from "@zsmartex/z-apiclient";
import { runNotice } from "@/mixins";
import { Vue, Component } from "vue-property-decorator";
import { UserController } from "@/controllers";

@Component({
  components: {
    "form-row": () => import("./form-row.vue"),
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue"),
  }
})
export default class DocumentForm extends Vue {
  loading = false;
  doc_type = "Passport";
  doc_number = "";
  front_upload_data?: string | ArrayBuffer = null;
  back_upload_data?: string | ArrayBuffer = null;
  in_hand_upload_data?: string | ArrayBuffer = null;
  front_upload?: File;
  back_upload?: File;
  in_hand_upload: File;

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
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();

    formData.set("doc_type", this.doc_type);
    formData.set("doc_number", this.doc_number);
    formData.append("upload[]", this.front_upload);
    formData.append("upload[]", this.back_upload);
    formData.append("upload[]", this.in_hand_upload);

    this.loading = true;

    try {
      await new ApiClient("auth").post("resource/documents", formData, config);
      await UserController.get_labels();
      runNotice("success", "Documents upload was successful");
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
