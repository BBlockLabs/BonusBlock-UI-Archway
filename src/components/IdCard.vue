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
.dot {
  box-sizing: border-box;
  width: 64px;
  height: 16px;
  background: #ffffff;
  border: 2px solid #000000;
  box-shadow: inset 10px 10px 0 #000000;
  border-radius: 8px;
}
</style>
