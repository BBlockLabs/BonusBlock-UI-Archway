<template>
  <colored-card type="warning">
    <el-row justify="center">
      <el-col :span="-1"> Until Launch </el-col>
    </el-row>

    <el-row justify="center">
      <el-col :span="-1" class="title">
        <b> {{ launchDate.diff(moment(), "days") }} Days </b>
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col :span="-1">
        {{ dateDifference.format("k") }} hours |
        {{ dateDifference.format("m") }} minutes |
        {{ dateDifference.format("s") }} seconds
      </el-col>
    </el-row>
  </colored-card>
</template>

<script setup lang="ts">
import ColoredCard from "@/components/ColoredCard.vue";
import { Ref, ref, computed, ComputedRef } from "vue";
import moment from "moment";

const launchDate: moment.Moment = moment(import.meta.env.VITE_LAUNCH_DATE);
let now: Ref<moment.Moment> = ref(moment());

setInterval(() => {
  now.value = moment();
}, 1000);

const dateDifference: ComputedRef<moment.Moment> = computed(() =>
  moment(launchDate.diff(now.value))
);
</script>

<style scoped lang="scss">
.title {
  font-size: 48px;
}
</style>
