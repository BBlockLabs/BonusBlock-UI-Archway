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
  border-radius: 16px;
  box-shadow: -8px 40px 70px -20px rgba(0, 0, 0, 0.2);
}
</style>
