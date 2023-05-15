<template>
  <el-avatar class="w-100 qr" shape="square" :src="url" :alt="$props.text" />
</template>

<script setup lang="ts">
import { ref, watch, Ref } from "vue";
import { AwesomeQR } from "awesome-qr";
import Logo from "@/assets/logo/logo.png";
import type Buffer from "buffer";

export interface Props {
  text: string;
}

const props: Props = defineProps<Props>();

let url: Ref<string | Buffer | ArrayBuffer | undefined | null> = ref(null);

const generate = async (): Promise<void> => {
  url.value = await new AwesomeQR({
    colorDark: "#1E1C4E",
    correctLevel: 3,
    logoImage: Logo,
    margin: 15, //px
    size: 500, // px
    text: props.text,
    whiteMargin: false,
    // ...this.options,
  }).draw();
};

watch(props, generate);

generate();
</script>
<style lang="scss">
.qr.el-avatar {
  height: 100%;
  img {
    width: 100%;
  }
}
</style>
