<template>
  <el-footer class="px-large py-medium" :class="classesList">
    <el-row
      justify="center"
      class="is-align-middle d-flex gap-small"
      align="middle"
    >
      <el-link href="https://bonusblock.io/" target="_blank">
        <el-col :span="-1" class="d-flex gap-small">
          <b style="align-self: center; text-wrap: nowrap"> Powered by </b>
          <SvgBonusBlockLogo class="icon-medium" />
        </el-col>
      </el-link>

    </el-row>
  </el-footer>
</template>

<script setup lang="ts">
import SvgBonusBlockLogo from "@/assets/logo/white-bg/full.svg";
import { normalizeClass, unref } from "vue";
import { useNamespace } from "element-plus";

export interface Props {
  colored?: boolean;
}

const props: Props = withDefaults(defineProps<Props>(), {
  colored: false,
});

const ns = useNamespace("footer");

const classesList = normalizeClass([unref(ns).is("colored", props.colored)]);
</script>
