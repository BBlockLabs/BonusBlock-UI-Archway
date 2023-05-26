<template>
  <el-card v-bind="$props" :class="classes">
    <slot />
  </el-card>
</template>

<script setup lang="ts">
import { normalizeClass, unref } from "vue";
import { useNamespace } from "element-plus";

export interface Props {
  type?: "primary" | "secondary" | "info" | "warning" | "danger";
}

const props: Props = defineProps<Props>();

const ns = useNamespace("card");

const classes = normalizeClass([unref(ns).m(unref(props.type))]);
</script>
