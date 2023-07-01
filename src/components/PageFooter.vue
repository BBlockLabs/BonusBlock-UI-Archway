<template>
  <el-footer class="px-large py-medium" :class="classesList">
    <el-row
      justify="space-between"
      class="is-align-middle d-flex gap-small"
      align="middle"
    >
      <el-col span="-1" class="fs-extra-small">
        <span>
          The ARCH tokens will not be offered in the United States or to U.S.
          persons or to residents of certain other prohibited jurisdictions.
          <a class="archway-link" href="http://example.com">Learn more.</a>
        </span>
      </el-col>
      <el-col :span="-1">
        <social-links
          :twitter="LinkTwitter"
          :reddit="LinkReddit"
          :telegram="LinkTelegram"
        />
      </el-col>

      <el-col :span="-1" class="d-flex gap-small">
        <b style="align-self: center"> Powered by </b>
        <SvgBonusBlockLogo class="icon-medium" />
      </el-col>
    </el-row>
  </el-footer>
</template>

<script setup lang="ts">
import SocialLinks from "@/components/ExternalLinks.vue";
import SvgBonusBlockLogo from "@/assets/logo/white-bg/full.svg";
import { normalizeClass, unref } from "vue";
import { useNamespace } from "element-plus";

const LinkTwitter: string = import.meta.env.VITE_LINK_TWITTER;
const LinkTelegram: string = import.meta.env.VITE_LINK_TELEGRAM;
const LinkReddit: string = import.meta.env.VITE_LINK_REDDIT;

export interface Props {
  colored?: boolean;
}

const props: Props = withDefaults(defineProps<Props>(), {
  colored: false,
});

const ns = useNamespace("footer");

const classesList = normalizeClass([unref(ns).is("colored", props.colored)]);
</script>
