<template>
  <box-wrapper class="py-medium pl-large pr-medium round">
    <div class="d-flex flex-row">
      <div class="mx-0 my-auto">
        <h3 class="fs-base m-0">
          Share to your community about joining BonusBlock so others would know!
        </h3>
      </div>

      <a :href="link" target="_blank" class="my-auto">
        <box-wrapper
          circular
          type="warning"
          class="ml-medium my-auto tweet-circle d-flex"
        >
          <svg-twitter class="icon-base m-auto" />
        </box-wrapper>
      </a>
    </div>
  </box-wrapper>
</template>

<script setup lang="ts">
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgTwitter from "@/assets/icons/twitter.svg?component";
import type { ComputedRef } from "vue";
import { useStore, StoreType } from "@/store";
import { computed } from "vue";

const store: StoreType = useStore();

const link: ComputedRef<string> = computed((): string => {
  const referral: string = store.getters["UserModule/refLink"];

  const message: string = `I have joined as a Blocktopian on @bonus_block! Visit ${referral} to start earning rewards for on-chain activity across Web3!`;

  const plainLink: string = `https://twitter.com/intent/tweet?text=${message}`;

  return encodeURI(plainLink);
});
</script>

<style scoped lang="scss">
.round {
  border-radius: 77px;
}

.tweet-circle {
  $size: 3.78571428571em; //53px
  height: $size;
  width: $size;
  flex-shrink: 0;
}
</style>
