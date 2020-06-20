<template>
  <div class="setting-main kyc">
    <div class="setting-head">
      KYC Account verification
    </div>
    <div class="setting-body">
      <form @submit.prevent="onSubmit">
        <div class="form-row">
          <label class="form-label">Country / Region：</label>
          <div class="form-control">
            <auto-complete
              :rows="getAllRegion"
              :default_value="country"
              event="region"
              type="big"
            />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">First name：</label>
          <div class="form-control">
            <input
              v-model="first_name"
              type="text"
              placeholder="Please enter your first name"
            />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">Last name：</label>
          <div class="form-control">
            <input
              v-model="last_name"
              type="text"
              placeholder="Please enter your last name"
            />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">Type of certificate：</label>
          <div class="form-control">
            <auto-complete
              :rows="[
                'Passport',
                'Identity card',
                'Driver license',
                'Utility Bill'
              ]"
              :default_value="doc_type"
              event="doc_type"
              type="big"
            />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">ID Number：</label>
          <div class="form-control">
            <input
              v-model="doc_number"
              type="text"
              placeholder="Please enter your ID Number"
            />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">ID photo：</label>
          <div class="form-control upload-photos">
            <ul class="photos-list">
              <li class="front">
                <div class="upload-box">
                  <input
                    ref="front_file"
                    type="file"
                    name="front_file"
                    accept="image/*"
                    @change="onFileChange($event, 'front')"
                  />
                  <div class="img-uploaded">
                    <img
                      v-if="uploaded_front_side"
                      :src="uploaded_front_side"
                      class="preview"
                    />
                  </div>
                  <div class="upload-area">
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
                    ref="back_file"
                    type="file"
                    name="back_file"
                    accept="image/*"
                    @change="onFileChange($event, 'back')"
                  />
                  <div class="img-uploaded">
                    <img
                      v-if="uploaded_back_side"
                      :src="uploaded_back_side"
                      class="preview"
                    />
                  </div>
                  <div class="upload-area">
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
                    ref="hand_file"
                    type="file"
                    name="hand_file"
                    accept="image/*"
                    @change="onFileChange($event, 'hand')"
                  />
                  <div class="img-uploaded">
                    <img
                      v-if="uploaded_hand_held"
                      :src="uploaded_hand_held"
                      class="preview"
                    />
                  </div>
                  <div class="upload-area">
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
            <button type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
//TODO fix KYC page
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import AutoComplete from "@/components/desktop/AutoComplete.vue";

export default {
  name: "",
  components: {
    "auto-complete": AutoComplete
  },
  data() {
    return {
      first_name: "",
      last_name: "",
      country: { code: "CN", name: "China" },
      doc_type: "Passport",
      doc_number: "",
      upload_front_side: null,
      upload_back_side: null,
      upload_hand_held: null,
      uploaded_front_side: null,
      uploaded_back_side: null,
      uploaded_hand_held: null
    };
  },
  computed: {
    getAllRegion() {
      return helpers.getAllRegion();
    }
  },
  mounted() {
    ZSmartModel.on("region", country => (this.country = country));
    ZSmartModel.on("doc_type", doc_type => (this.doc_type = doc_type));
  },
  methods: {
    onFileChange($event, type) {
      const fileName = $event.target.name;
      const file = $event.target.files;
      if (!file.length) return;
      const formData = new FormData();
      const reader = new FileReader();
      //let imageURL = URL.createObjectURL(file[0]);

      if (type === "front") {
        this.upload_front_side = file[0];
        reader.onload = e => (this.uploaded_front_side = e.target.result);
      } else if (type === "back") {
        this.upload_back_side = file[0];
        reader.onload = e => (this.uploaded_back_side = e.target.result);
      } else if (type === "hand") {
        this.upload_hand_held = file[0];
        reader.onload = e => (this.uploaded_hand_held = e.target.result);
      }
      reader.readAsDataURL(file[0]);
      formData.append(fileName, file);
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("first_name", this.first_name);
      formData.append("last_name", this.last_name);
      formData.append("country", this.country.code);
      formData.append("doc_type", this.doc_type);
      formData.append("doc_number", this.doc_number);
      formData.append("upload_front_side", this.upload_front_side);
      formData.append("upload_back_side", this.upload_back_side);
      formData.append("upload_hand_held", this.upload_hand_held);
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      try {
        await new ApiClient("auth").post(
          "resource/documents",
          formData,
          config
        );
        helpers.runNotice("success", "Documents upload was successful");
        this.afterUpload();
      } catch (error) {
        return error;
      }
    },
    afterUpload() {
      this.uploaded_front_side = this.uploaded_back_side = this.uploaded_hand_held = this.upload_front_side = this.upload_back_side = this.upload_hand_held = null;
      this.first_name = this.last_name = this.doc_number = "";
    }
  }
};
</script>
