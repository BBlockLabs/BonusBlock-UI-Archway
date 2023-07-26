<template>
  <PageWrapper
    style="justify-content: center"
    class="d-flex is-justify-center flex-column h-100 fs-slightly-larger"
  >
    <el-row class="mb-medium" justify="center">
      <el-col :span="-1">
        <strong style="font-size: 3em" class="archway-orange">Coming soon</strong>
      </el-col>
    </el-row>

    <el-row class="mb-large" justify="center">
      <el-col :span="-1">
        <span class="fs-medium">Check out the following articles while you wait:</span>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <ArchwayInfoCard />
      </el-col>
    </el-row>
  </PageWrapper>

</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import ArchwayInfoCard from "@/components/ArchwayInfoCard.vue";
import { store } from "@/store";
import PaginationRequest from "@/common/api/PaginationRequest";
import type ArchwayLeaderboardResponse from "@/common/api/archway/ArchwayLeaderboardResponse";

async function getLeaderboard() {
  let pagination: PaginationRequest = new PaginationRequest(1, 15);
  let leaderboardResponse: ArchwayLeaderboardResponse = await store.dispatch("ArchwayHttpModule/getLeaderboard", pagination);
  console.log(leaderboardResponse);
}
</script>

<style scoped lang="scss">
</style>
