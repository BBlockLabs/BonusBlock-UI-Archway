<template>
  <colored-card v-bind="$props">
    <el-row justify="center" class="mb-large">
      <el-col :span="-1" class="dot" />
    </el-row>

    <slot />
  </colored-card>
</template>

<script setup lang="ts">
import ColoredCard from "@/components/ColoredCard.vue";
</script>

<style lang="scss" scoped>
@use "@/design/vars.scss" as v;
.dot {
  box-sizing: border-box;
  width: 64px;
  height: 16px;
  background: v.$archway-warm-grey;
  border-radius: 8px;
}
</style>
