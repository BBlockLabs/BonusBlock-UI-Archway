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
          {{ campaign.name }}
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
        <interactions-chart />
      </div>
      <div class="py-base d-flex flex-column campaign-details">
        <h2>Campaign Details</h2>
        <el-card
          shadow="never"
          class="campaign-image"
          :class="campaign.image ? '' : 'random-cube'"
          :style="{ backgroundImage: 'url(' + (campaign.image ?? randomCube(campaign.id)) + ')', backgroundColor: randomBackgroundColor(campaign.id) }"
        ></el-card>
        <el-card shadow="never">
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
        </el-card>
        <el-card shadow="never">
          <el-row align="middle">
            <div>Network</div>
            <svg-eth class="icon ml-auto mr-extra-small" />
            <div>Ethereum</div>
          </el-row>
          <el-row align="middle" class="mt-base">
            <div>Reward pool</div>
            <svg-uni class="icon ml-auto mr-extra-small" />
            <div>UniSwap</div>
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
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import PageWrapper from "@/components/PageWrapper.vue";
import InteractionsChart from "@/components/InteractionsChart.vue";
import AnnouncementList from "@/components/AnnouncementList.vue";
import SvgChevronLeft from "@/assets/icons/nav-arrow-left.svg?component";
import RawCubeLeft from "@/assets/icons/cube-left.svg?raw";
import RawCubeRight from "@/assets/icons/cube-right.svg?raw";
import RawCubeTop from "@/assets/icons/cube-top.svg?raw";
import SvgEth from "@/assets/currencies/eth.svg?component";
import SvgUni from "@/assets/currencies/uni.svg?component";
import router from "@/router";
import moment from "moment";

let localTimeOffsetMs: number = 0;
const now = ref(Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000));
const timer = setInterval(() => {
  now.value = Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000);
}, 1000);

onMounted(() => {
});

onUnmounted(() => {
  clearInterval(timer);
});

const route = useRoute();
const todayInteractions = ref(null as number | null);
todayInteractions.value = 42;
const campaign = {
  image: null,
  id: "a",
  name: "Campaign name",
  tags: ["DeFi", "DEX"],
  periodTillParsed: moment()
    .add(16, "days")
    .add(4, "hours")
    .add(11, "minutes")
    .add(35, "seconds"),
};

const campaignTimeLeft = computed(() => {
  if (!campaign.periodTillParsed) {
    return {
      d: "",
      h: "",
      m: "",
      s: "",
    };
  }
  let diff = campaign.periodTillParsed.diff(moment.unix(now.value), "seconds");
  return {
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

console.log(route.params.id);
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
