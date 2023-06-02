<template>
  <PageWrapper :full-width="true" :no-padding="true">
    <el-row class="limit-width px-large gap-1 campaign-details-frame">
      <div class="py-base flex-grow w-100">
        <h2>
          <svg-chevron-left
            class="icon-small pointer"
            style="vertical-align: -0.15em"
            @click="goBack()"
          />
          {{ campaignLoaded ? campaign.name : "Loading..." }}
        </h2>
        <div v-if="campaign.tags && campaign.tags.length > 0">
          <el-tag v-for="tag in campaign.tags" :key="tag" effect="plain" round>
            {{ tag }}
          </el-tag>
        </div>
        <el-row align="middle" justify="space-between" class="mt-medium">
          <h2>Your stats</h2>
          <div v-if="todayInteractions !== null" style="margin-right: 2px">
            Today interactions: <strong>{{ todayInteractions }}</strong>
          </div>
        </el-row>
        <interactions-chart
          :campaign-id="route.params.id"
          :min-date="campaign?.periodFrom"
          :max-date="campaign?.periodTill"
          :parent-loading="!campaignLoaded"
        />
      </div>
      <div class="py-base d-flex flex-column campaign-details">
        <h2>Campaign Details</h2>
        <el-card
          v-loading="!campaignLoaded"
          shadow="never"
          class="campaign-image"
          :class="campaign.image ? '' : 'random-cube'"
          :style="{ backgroundImage: 'url(' + (campaign.image ?? randomCube(campaign.id)) + ')', backgroundColor: randomBackgroundColor(campaign.id) }"
        ></el-card>
        <el-card v-loading="!campaignLoaded" shadow="never">
          <template v-if="campaignTimeLeft">
            Campaign ends in:
            <el-row class="mt-extra-small fs-xxl date-flex bold">
              <div>{{ campaignTimeLeft.d }}</div>
              <div>{{ campaignTimeLeft.h }}</div>
              <div>{{ campaignTimeLeft.m }}</div>
              <div>{{ campaignTimeLeft.s }}</div>
            </el-row>
            <el-row class="mt-base fs-small date-flex">
              <div>Days</div>
              <div>Hours</div>
              <div>Minutes</div>
              <div>Seconds</div>
            </el-row>
          </template>
          <template v-else-if="campaign.periodTill">
            Campaign ended on:
            <el-row class="mt-extra-small fs-xxl bold">
              {{ campaign.periodTill.format("MMMM D, YYYY") }}
            </el-row>
          </template>
        </el-card>
        <el-card v-loading="!campaignLoaded" shadow="never">
          <el-row align="middle">
            <div>Network</div>
            <svg-eth v-if="campaignLoaded" class="icon ml-auto mr-extra-small" />
            <div>{{ campaign.networkName }}</div>
          </el-row>
          <el-row align="middle" class="mt-base">
            <div>Reward pool</div>
            <svg-eth v-if="campaignLoaded" class="icon ml-auto mr-extra-small" />
            <div>{{ campaign.rewardPoolName }}</div>
          </el-row>
        </el-card>
      </div>
    </el-row>

    <el-divider class="mt-0" />

    <div class="limit-width px-large">
      <el-row>
        <h2>Keep Earning</h2>
      </el-row>
      <announcement-list :top-three="true" />
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import PageWrapper from "@/components/PageWrapper.vue";
import InteractionsChart from "@/components/InteractionsChart.vue";
import AnnouncementList from "@/components/AnnouncementList.vue";
import SvgChevronLeft from "@/assets/icons/nav-arrow-left.svg?component";
import RawCubeLeft from "@/assets/icons/cube-left.svg?raw";
import RawCubeRight from "@/assets/icons/cube-right.svg?raw";
import RawCubeTop from "@/assets/icons/cube-top.svg?raw";
import SvgEth from "@/assets/currencies/eth.svg?component";
import router from "@/router";
import moment, { Moment } from "moment";
import { store } from "@/store";
import type CampaignDataDto from "@/common/api/dto/CampaignDataDto";

const route = useRoute();

let localTimeOffsetMs: number = 0;
const now = ref(Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000));
const timer = setInterval(() => {
  now.value = Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000);
}, 1000);

onMounted(() => {
  fetchCampaignData(route.params.id as string);
  fetchTodayInteractions(route.params.id as string);
});

onUnmounted(() => {
  clearInterval(timer);
});

const todayInteractions = ref(null as number | null);
const campaignLoaded = ref(false);
const campaign: CampaignDataDto = reactive({
  id: "",
  name: "",
  networkName: "",
  rewardPoolName: "",
  currency: "",
  tags: [],
  image: null,
  imageType: null,
  periodFrom: null,
  periodTill: null,
});

function fetchCampaignData(campaignId: string) {
  store.dispatch(
      "HttpModule/loadCampaign",
      {
        campaignId: campaignId,
      }
  ).then((result) => {
    if (result) {
      Object.assign(campaign, result);
      campaignLoaded.value = true;
    }
  }).catch((e) => {
    console.error(e);
  });
}

function fetchTodayInteractions(campaignId: string) {
  store.dispatch(
      "HttpModule/loadAnalytics",
      {
        timeZoneOffset: new Date().getTimezoneOffset() * -1,
        campaignIds: [route.params.id],
      }
  ).then((result) => {
    for (let k in result.interactions) {
      todayInteractions.value = result.interactions[k];
      break;
    }
  }).catch((e) => {
    console.error(e);
  });
}

const campaignTimeLeft = computed(() => {
  if (!campaign.periodTill) {
    return null;
  }
  let diff = campaign.periodTill.diff(moment.unix(now.value), "seconds");
  if (diff <= 0) {
    return null;
  }
  return {
    diff: diff,
    d: Math.floor(diff / 60 / 60 / 24),
    h: Math.floor(diff / 60 / 60) % 24,
    m: Math.floor(diff / 60) % 60,
    s: diff % 60,
  };
});

function goBack() {
  router.push("/collect-rewards");
}

function numberFromSeed(seed: string, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return Math.abs(hash >> 7) % (max + 1);
}

function randomCube(seed: string) {
  const cubes = [RawCubeLeft, RawCubeRight, RawCubeTop];
  const cube = cubes[numberFromSeed(seed, cubes.length - 1)];
  return "data:image/svg+xml;base64," + btoa(cube);
}

function randomBackgroundColor(seed: string) {
  const colors = [
    "#ffeac3",
    "#d4e68c",
    "#b3dbd5",
    "#c3d0ff",
    "#efbeff",
    "#ffb4b4",
  ];
  return colors[numberFromSeed(seed, colors.length - 1)];
}
</script>
<style lang="scss">
.campaign-details-frame {
  flex-wrap: nowrap;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
}

.campaign-details {
  flex-shrink: 0;
  width: 25em;
  margin-left: 2em;
  padding-left: 2em;
  border-left: 1px solid #000;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    padding-left: 0;
    border-left: none;
  }

  .el-card {
    border: 1px solid #000;
    border-radius: 0.714em;
    padding: 1em;
    overflow: hidden;
    background: transparent;
    margin-bottom: 1em;
    font-size: 1.286rem;

    .el-card__body {
      padding: 0.25em 0;
      min-height: 4em;
    }

    &.campaign-image {
      height: 14.3em;
      background-size: cover;
      background-position: center;

      &.random-cube {
        background-size: 50% 65%;
        background-repeat: no-repeat;
      }
    }

    .date-flex div {
      flex-basis: 0;
      flex-grow: 1;
      text-align: center;
    }
  }
}
</style>
