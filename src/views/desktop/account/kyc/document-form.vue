<template>
  <form class="document-form" @submit.prevent="onSubmit">
    <form-row
      label="Type of certificate"
      type="select"
      :rows="TYPES"
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
        <button type="submit" :disabled="button_disabled">
          Submit
          <a-icon v-if="loading" type="loading" />
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Mixins, Component } from "vue-property-decorator";
import { DocumentMixins } from "@/mixins/kyc";

@Component({
  components: {
    "form-row": () => import("./form-row.vue"),
    "auto-complete": () => import("@/components/desktop/AutoComplete.vue"),
  }
})
export default class DocumentForm extends Mixins(DocumentMixins) {}
</script>
