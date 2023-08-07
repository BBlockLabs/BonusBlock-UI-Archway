<template>
  <el-row class="mt-medium mb-large info-container" justify="space-between">
    <el-col class="info-element" :span="-1">
      <box-wrapper type="white" round class="archway-orange-bg">
        <el-row class="mb-large">
          <el-col :span="-1">
            <SvgChatBubbleEmpty />
          </el-col>
        </el-row>
        <el-row class="mb-large">
          <el-col class="fs-large bold mb-small" :span="-1">
            Reach out
          </el-col>
        </el-row>
        <el-row class="mb-large">
          Want to partner up or build a Dapp?
          Get in touch with our core contributors.
        </el-row>
        <el-row class="mt-auto">
          <el-link
            target="_blank"
            :href="LinkGetInTouch"
            :underline="false"
          >
            <el-button style="box-shadow: none" type="secondary"> Get in touch</el-button>
          </el-link>
        </el-row>
      </box-wrapper>
    </el-col>

    <el-col class="info-element" :span="-1">
      <box-wrapper type="white" round>
        <el-row class="mb-large">
          <el-col :span="-1">
            <SvgGroup />
          </el-col>
        </el-row>
        <el-row class="mb-large">
          <el-col class="fs-large bold mb-small" :span="-1">
            Start building
          </el-col>
        </el-row>
        <el-row class="mb-small">
          Find everything you need to start
          building on archway today.
        </el-row>
        <el-row class="mt-auto">
          <el-link
            target="_blank"
            :href="LinkDocs"
            :underline="false"
          >
            <el-button class="is-link" type="primary"> View Documentation</el-button>
          </el-link>
        </el-row>
      </box-wrapper>
    </el-col>

    <el-col class="info-element" :span="-1">
      <box-wrapper type="white" round>
        <el-row class="mb-large">
          <el-col :span="-1">
            <SvgOpenBook />
          </el-col>
        </el-row>
        <el-row class="mb-large">
          <el-col class="fs-large bold mb-small" :span="-1">
            Join the community
          </el-col>
        </el-row>
        <el-row class="mb-small">
          Connect with people from across the
          ecosystem, Build and grow together.
          Access the community hub
        </el-row>
        <el-row class="mt-auto">
          <el-link
            target="_blank"
            :href="LinkCommunity"
            :underline="false"
          >
            <el-button class="is-link" type="primary"> Access the community hub</el-button>
          </el-link>
        </el-row>
      </box-wrapper>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import SvgOpenBook from "@/assets/icons/open-book.svg";
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgChatBubbleEmpty from "@/assets/icons/chat-bubble-empty.svg";
import SvgGroup from "@/assets/icons/group.svg";

const LinkGetInTouch: string = import.meta.env.VITE_LINK_GET_IN_TOUCH;
const LinkDocs: string = import.meta.env.VITE_LINK_DOCS;
const LinkCommunity: string = import.meta.env.VITE_LINK_COMMUNITY;
</script>

<style scoped lang="scss"></style>
