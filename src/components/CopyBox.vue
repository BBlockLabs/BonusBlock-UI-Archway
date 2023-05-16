<template>
  <box-wrapper type="primary" class="px-base py-small">
    <el-row justify="space-between" class="flex-row">
      <el-col :span="-1" class="of-hidden">
        {{ props.text }}
      </el-col>

      <el-col :span="-1" class="flex-noshrink">
        <el-button type="info" link @click="copyToClipboard(props.text)">
          <svg-copy class="icon-small mr-extra-small" />
        </el-button>
      </el-col>
    </el-row>
  </box-wrapper>
</template>

<script setup lang="ts">
import SvgCopy from "@/assets/icons/copy.svg?component";
import BoxWrapper from "@/components/BoxWrapper.vue";

interface Props {
  text: string;
}

const props: Props = defineProps<Props>();
</script>
