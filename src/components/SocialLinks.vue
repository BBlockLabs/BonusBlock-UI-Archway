<template>
  <el-space class="social-links">
    <el-link
      v-if="props.github"
      :href="props.github"
      target="_blank"
      :underline="false"
    >
      <svg-github />
    </el-link>

    <el-link
      v-if="props.twitter"
      :href="props.twitter"
      target="_blank"
      :underline="false"
    >
      <svg-twitter />
    </el-link>

    <el-link
      v-if="props.telegram"
      :href="props.telegram"
      target="_blank"
      :underline="false"
    >
      <svg-telegram />
    </el-link>

    <el-link
      v-if="props.reddit"
      :href="props.reddit"
      target="_blank"
      :underline="false"
    >
      <svg-reddit />
    </el-link>

    <el-link
      v-if="props.discord"
      :href="props.discord"
      target="_blank"
      :underline="false"
      class="icon-discord"
    >
      <svg-discord />
    </el-link>

    <el-link
      v-if="props.youtube"
      :href="props.youtube"
      target="_blank"
      :underline="false"
      class="icon-youtube"
    >
      <svg-youtube />
    </el-link>
    <el-link
      v-if="props.website"
      :href="props.website"
      target="_blank"
      :underline="false"
      class="icon-website"
    >
      <svg-website />
    </el-link>
    <el-link
      v-if="props.newsletter"
      :href="props.newsletter"
      target="_blank"
      :underline="false"
      class="icon-newsletter"
    >
      <svg-newsletter />
    </el-link>
    <el-link
      v-if="props.blog"
      :href="props.blog"
      target="_blank"
      :underline="false"
      class="icon-blog"
    >
      <svg-blog />
    </el-link>
  </el-space>
</template>

<script setup lang="ts">
import SvgGithub from "@/assets/icons/github.svg?component";
import SvgTwitter from "@/assets/icons/twitter.svg?component";
import SvgTelegram from "@/assets/icons/telegram.svg?component";
import SvgReddit from "@/assets/icons/reddit.svg?component";
import SvgDiscord from "@/assets/icons/discord.svg?component";
import SvgYoutube from "@/assets/icons/youtube.svg?component";
import SvgWebsite from "@/assets/icons/website.svg?component";
import SvgNewsletter from "@/assets/icons/newsletter.svg?component";
import SvgBlog from "@/assets/icons/blog.svg?component";

export interface Props {
  github?: string;
  twitter?: string;
  telegram?: string;
  reddit?: string;
  discord?: string;
  youtube?: string;
  website?: string;
  newsletter?: string;
  blog?: string;
}

const props = defineProps<Props>();
</script>

<style lang="scss">
.social-links {
  svg {
    height: 1.714em;
  }

  .icon-discord {
    position: relative;
    top: 0.15em;
  }

  .icon-youtube {
    position: relative;
    top: 0.15em;
  }
}
</style>
