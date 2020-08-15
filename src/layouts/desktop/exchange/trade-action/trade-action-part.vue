<template>
  <div class="trade-action-part">
    <action-balance :currency="currency" />
    <action-input
      class="price"
      v-model="price"
      :prefix="translation('price')"
      :suffix="currency_by_side('buy').toUpperCase()"
      :limit-length-after-dot="price_precision"
      :estimate-value="
        amount_to_usd(currency_by_side('buy'), Number(this.price)).toFixed(2)
      "
      :error="price_error"
    />
    <action-input
      class="amount"
      v-model="amount"
      :prefix="translation('amount')"
      :suffix="currency_by_side('sell').toUpperCase()"
      :limit-length-after-dot="amount_precision"
      :error="amount_error"
    />
    <a-slider
      v-model="slider_percent"
      :class="class_by_side('trade-action-slider')"
      :marks="marks_slider"
      :step="1"
      :default-value="0"
      :disabled="slider_disabled"
      @change="onSliderPercentChange"
    />
    <div class="total">
      {{ translation("total") }}:
      <span class="value">
        {{ (total || 0).toFixed(total_precision) }}
        {{ currency_by_side("buy").toUpperCase() }}
      </span>
      ≈ ${{ amount_to_usd(currency_by_side("sell"), total).toFixed(2) }}
    </div>
    <button
      :class="class_by_side('trade-action-button')"
      :disabled="button_disabled"
      @click="create_order"
    >
      {{
        translation(side, {
          currency: currency_by_side("sell").toUpperCase()
        })
      }}
    </button>
  </div>
</template>

<script lang="ts">
import { TradeActionMixin } from "@/mixins";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "action-balance": () => import("./trade-action-balance.vue"),
    "action-input": () => import("./trade-action-input.vue")
  }
})
export default class App extends Mixins(TradeActionMixin) {
  @Prop() readonly side!: ZTypes.OrderSide;

  get slider_disabled() {
    return !this.assets.available;
  }

  class_by_side(class_name: string) {
    return class_name + " " + class_name + "-" + this.side;
  }
}
</script>
