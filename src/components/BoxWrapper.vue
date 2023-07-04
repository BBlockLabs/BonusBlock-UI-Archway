<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { normalizeClass, unref } from "vue";
import { useNamespace } from "element-plus";

export interface Props {
  type?:
    | "primary"
    | "secondary"
    | "info"
    | "warning"
    | "danger"
    | "clear"
    | "white"
    | "black";
  hoverable?: boolean;
  round?: boolean;
  circular?: boolean;
  shadow?: boolean;
  disabled?: boolean;
}

const props: Props = withDefaults(defineProps<Props>(), {
  type: "clear",
  hoverable: false,
  circular: false,
  shadow: false,
  disabled: false,
});

const ns = useNamespace("box");

const classes = normalizeClass([
  unref(ns).b(),
  unref(ns).m(unref(props.type)),
  unref(ns).is("hoverable", props.hoverable),
  unref(ns).is("round", props.round),
  unref(ns).is("circular", props.circular),
  unref(ns).is("shadow", props.shadow),
  unref(ns).is("disabled", props.disabled),
]);
</script>
