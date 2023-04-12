<template>
  <el-button link type="info" @click="showDialog">
    <svg-info class="icon-normal mr-extra-small" />
    How it works
  </el-button>
</template>

<script setup lang="ts">
import { normalizeClass, unref } from "vue";
import SvgInfo from "@/assets/icons/info.svg?component";
import { ElMessageBox } from "element-plus";
import { useNamespace } from "element-plus";

const ns = useNamespace("message-box");

const classes = normalizeClass([
  unref(ns).is("wide"),
  unref(ns).is("non-center"),
]);

function showDialog(): void {
  ElMessageBox.alert(
    "The signed request contains a one time use token that is used to verify if the add wallet request is sent from the same connection.<br/><br/> The signed data is only used to verify the wallet owner is the one sending the request. It does not contain any personal or other private information.",
    "How it works",
    {
      center: true,
      customClass: classes,
      dangerouslyUseHTMLString: true,
    }
  );
}
</script>
