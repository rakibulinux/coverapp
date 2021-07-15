<template>
  <div class="ant-layout-footer">
    <div class="menu-footer">
      <ul>
        <li class="title">
          <img src="@/assets/img/logo.png" />
        </li>
        <li class="l">
          <a href="#" class="icon-link">
            <i class="zicon-telegram" />
          </a>
          <a href="#" class="icon-link">
            <i class="zicon-twitter" />
          </a>
        </li>
      </ul>
      <ul>
        <li class="title">
          About Us
        </li>
        <li class="m">
          <router-link to="/desclaimer">
          Desclaimer
          </router-link>
        </li>
        <!-- <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li> -->
      <!-- </ul>
      <ul>
        <li class="title">
          Example
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li>
        <li class="m">
          <a>Example</a>
        </li> -->
      </ul>
      <ul class="contact">
        <li class="title">
          Contact Us
        </li>
        <li class="m" v-text="`Service: ${contactus.service}`" />
        <li class="m" v-text="`Business: ${contactus.business}`" />
        <li class="m">
          Facebook:
          <!-- <a :href="contactus.facebook" target="_blank">XUM exchange</a> -->
          XUM Exchange
        </li>
      </ul>
    </div>
    <div class="bottom-footer">
      &copy; 2019-2021
      <a :href="copyright.link" target="_blank" v-text="copyright.name" />. All
      rights reserved.
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  public contactus = {
     service: "service@xumexchange.com",
    business: "business@xumexchange.com",
    facebook: "https://fb.com/xumexchange"
  };

  public copyright = {
    name: "XUM Exchange",
    link: "https://www.xumexchange.com/"
  };
}
</script>
