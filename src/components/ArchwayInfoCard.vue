<template>
  <el-row class="mt-medium info-container" justify="space-between">
    <el-col class="info-element" span="-1">
      <box-wrapper type="white" round class="d-flex flex-grow flex-column archway-orange-bg py-extra-large px-extra-large">
        <el-row class="mb-large">
          <SvgChatBubbleEmpty />
        </el-row>
        <el-row class="fs-large bold mb-large">
          Reach out
        </el-row>
        <el-row class="mb-large">
          Want to partner up or build a Dapp?
          Get in touch with our core contributors.
        </el-row>
        <el-row class="mt-auto">
          <el-link
            class="ml-auto"
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfJL3E12uD0kmivVHF4Naxab7DR4CYdYKXf7ouQJznOlmUn9Q/viewform"
            :underline="false"
          >
            <el-button type="primary" > Get in touch</el-button>
          </el-link>
        </el-row>
      </box-wrapper>
    </el-col>

    <el-col class="info-element" span="-1">
      <box-wrapper type="white" round class="d-flex flex-grow flex-column py-extra-large px-extra-large">
        <el-row class="mb-large">
          <SvgGroup />
        </el-row>
        <el-row class="fs-large bold mb-large">
          Start building
        </el-row>
        <el-row class="">
          Find everything you need to start
          building on archway today.
        </el-row>
        <el-row class="mt-auto">
          <el-link
            class="ml-auto"
            target="_blank"
            href="https://archway.io/community"
            :underline="false"
          >
            <el-button class="is-link" type="primary"> View Documentation</el-button>
          </el-link>
        </el-row>
      </box-wrapper>
    </el-col>

    <el-col class="info-element" span="-1">
      <box-wrapper type="white" round class="flex-grow d-flex flex-column py-extra-large px-extra-large">
        <el-row class="mb-large">
          <SvgOpenBook />
        </el-row>
        <el-row class="fs-large bold mb-large">
          Join the community
        </el-row>
        <el-row>
          Connect with people from across the
          ecosystem, Build and grow together.
          Access the community hub
        </el-row>
        <el-row class="mt-auto">
          <el-link
            class="ml-auto"
            target="_blank"
            href="https://docs.archway.io/"
            :underline="false"
          >
            <el-button class="is-link" type="primary"> Access the community hub</el-button>
          </el-link>
        </el-row>
      </box-wrapper>
    </el-col>
  </el-row>
</template>

<script>

import {defineComponent} from "vue";
import SvgKeplr from "@/assets/icons/keplr.svg";
import SvgInfo from "@/assets/icons/info.svg";
import SvgOpenBook from "@/assets/icons/open-book.svg";
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgChatBubbleEmpty from "@/assets/icons/chat-bubble-empty.svg";
import SvgGroup from "@/assets/icons/group.svg";

export default defineComponent({
  components: {SvgGroup, SvgChatBubbleEmpty, BoxWrapper, SvgOpenBook}
})
</script>

<style scoped lang="scss">

</style>
