<template>
  <div class="trade-action-part">
    <trade-action-balance :currency="currency" />
    <trade-action-input
      class="price"
      v-model="price"
      :prefix="$t('page.global.table.price').toUpperCase()"
      :suffix="currency_by_side('buy').toUpperCase()"
      :limit-length-after-dot="price_precision"
      :estimate-value="
        amount_to_usd(currency_by_side('buy'), Number(this.price)).toFixed(2)
      "
      :ord_type="ord_type"
      :disabled="ord_type == 'market'"
      :error="price_error"
    />
    <trade-action-input
      class="amount"
      v-model="amount"
      :prefix="$t('page.global.table.amount').toUpperCase()"
      :suffix="currency_by_side('sell').toUpperCase()"
      :limit-length-after-dot="amount_precision"
      :ord_type="ord_type"
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
      {{ $t('page.global.table.total') }}:
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
    "trade-action-balance": () => import("./trade-action-balance.vue"),
    "trade-action-input": () => import("./trade-action-input.vue")
  }
})
export default class TradeActionPart extends Mixins(TradeActionMixin) {
  @Prop() readonly side!: ZTypes.OrderSide;
  @Prop() readonly ord_type!: ZTypes.OrdType;

  get slider_disabled() {
    return !this.assets.available;
  }

  class_by_side(class_name: string) {
    return class_name + " " + class_name + "-" + this.side;
  }
}
</script>
