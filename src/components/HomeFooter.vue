<template>
  <el-footer class="py-small px-large" :class="classesList">
    <el-row
      justify="space-between"
      class="mb-small is-align-middle d-flex gap-small"
      align="middle"
    >
      <el-col :span="-1">
        <social-links
          :twitter="LinkTwitter"
          :reddit="LinkReddit"
          :telegram="LinkTelegram"
        />
      </el-col>

      <el-col :span="-1" class="d-flex gap-small">
        <b style="align-self: center"> Provided by BonusBlock</b>
      </el-col>
    </el-row>
    <el-row>
      <el-col span="-1" class="fs-extra-small">
        <span>
          The information on this website is intended solely for general
          informational purposes and should not be regarded as a formal offer to
          buy or sell any securities in any jurisdiction, legal or investment
          advice, or tax advice. If you require legal, investment, or tax
          advice, please seek the guidance of a professional advisor. The
          BonusBlock is presently under development and may be subject to
          modification. As a result, the protocol documentation and website
          content may not accurately reflect the current state of the network at
          any given time. The network documentation and website content are not
          final and are subject to change.
        </span>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script setup lang="ts">
import SocialLinks from "@/components/ExternalLinks.vue";
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
