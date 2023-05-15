<template>
  <PageWrapper>
    <el-row>
      <h2>Collect Rewards</h2>
    </el-row>
    <div class="campaign-container">
      <div
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="campaign-card"
      >
        <div class="top-half">
          <el-row justify="space-between" align="middle">
            <h3 class="fs-slightly-larger">{{ campaign.name }}</h3>
            <svg-link class="card-link" @click="openCampaignDetails(campaign)"/>
          </el-row>
          <el-progress
            :percentage="getCampaignProgressPercent(campaign)"
            :status="elProgressStatusFromTimeRemaining(campaign.expiring - now)"
            stroke-width="5"
          >
            <svg-clock />&nbsp;<b class="fs-extra-small">{{
              now > campaign.expiring
                ? "Ended"
                : humanTimeLeft(campaign.expiring - now) + " left"
            }}</b>
          </el-progress>
        </div>
        <div class="bottom-half">
          <el-row justify="space-between" align="middle" class="pt-medium pb-medium">
            <b>Your Reward</b>
            <div class="text-link text-muted" @click="openCampaignDetails(campaign)">
              See more <svg-chevron-right />
            </div>
          </el-row>
          <el-row justify="space-between" align="middle">
            <div>{{ campaign.amount }} {{ campaign.currency }}</div>
            <button :disabled="now > campaign.expiring" @click="claimCampaign(campaign)">
              <svg-lock v-if="now > campaign.expiring" />
              Claim
            </button>
          </el-row>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import PageWrapper from "@/components/PageWrapper.vue";
import SvgLock from "@/assets/icons/lock.svg?component";
import SvgLink from "@/assets/icons/open-new-window.svg?component";
import SvgClock from "@/assets/icons/clock.svg?component";
import SvgChevronRight from "@/assets/icons/nav-arrow-right.svg?component";

const now = ref(Math.ceil(new Date().valueOf() / 1000));
const timer = setInterval(() => {
  now.value = Math.ceil(new Date().valueOf() / 1000);
}, 1000);
onUnmounted(() => {
  clearInterval(timer);
});

type Campaign = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  started: number;
  expiring: number;
};

let campaigns: Array<Campaign> = [
  {
    id: 1,
    name: "UniSwap Amazing Campaign",
    amount: 35,
    currency: "UNI",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 2 * 7 * 24 * 60 * 60,
  },
  {
    id: 2,
    name: "Power 404",
    amount: 938.98,
    currency: "POWR",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 6 * 24 * 60 * 60,
  },
  {
    id: 3,
    name: "ETH Campaign",
    amount: 2,
    currency: "ETH",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 3 * 7 * 24 * 60 * 60,
  },
  {
    id: 4,
    name: "Random Campaign",
    amount: 7,
    currency: "ARY",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 2 * 7 * 24 * 60 * 60,
  },
  {
    id: 5,
    name: "Luna campaign",
    amount: 80,
    currency: "LUNA",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 13 * 60 * 60,
  },
  {
    id: 6,
    name: "Yet Another Campaign",
    amount: 8.38,
    currency: "BAB",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 3 * 24 * 60 * 60,
  },
  {
    id: 7,
    name: "BEAM BEANS",
    amount: 5342.53,
    currency: "BEAM",
    started: now.value - 60,
    expiring: now.value + 60,
  },
  {
    id: 8,
    name: "Get rich as hecc boi",
    amount: 93939494,
    currency: "EVX",
    started: now.value - 24 * 60 * 60,
    expiring: now.value + 0,
  },
];

function openCampaignDetails(campaign: Campaign): void {
  ElMessageBox.alert("openCampaignDetails " + campaign.id, "Todo");
}

function claimCampaign(campaign: Campaign): void {
  ElMessageBox.alert("claimCampaign " + campaign.id, "Todo");
}

function getCampaignProgressPercent(campaign: Campaign): number {
  return Math.round(Math.min(Math.max((now.value - campaign.started) / (campaign.expiring - campaign.started), 0), 1) * 1000) / 10;
}

function elProgressStatusFromTimeRemaining(seconds: number): string {
  if (seconds > 7 * 24 * 60 * 60) {
    return "success";
  } else if (seconds > 24 * 60 * 60) {
    return "warning";
  } else if (seconds > 0) {
    return "exception";
  }
  return "";
}

function humanTimeLeft(seconds: number): string {
  if (seconds < 60) {
    return seconds + " second" + (seconds === 1 ? "" : "s");
  }
  let minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes + " minute" + (minutes === 1 ? "" : "s");
  }
  let hours = Math.floor(minutes / 60);
  if (hours < 60) {
    return hours + " hour" + (hours === 1 ? "" : "s");
  }
  let days = Math.floor(hours / 24);
  if (days < 7) {
    return days + " day" + (days === 1 ? "" : "s");
  }
  let weeks = Math.floor(days / 7);
  return weeks + " week" + (weeks === 1 ? "" : "s");
}

/*
import { onMounted, ref } from "vue";
import { StoreType, useStore } from "@/store";
import FormattedError from "@/common/errors/FormattedError";
import { ElMessageBox } from "element-plus";
import HttpUnauthorizedError from "@/common/errors/HttpUnauthorizedError";
import { Router, useRouter } from "vue-router";
import type CalculationResultDto from "@/common/api/dto/CalculationResultDto";
import SocialLinks from "@/components/SocialLinks.vue";

const store: StoreType = useStore();
const router: Router = useRouter();

let calculationResults = ref(Array<CalculationResultDto>());
let bonusBlockWallet = ref(null);

async function bonusBlockKeplrLogin(): Promise<void> {
  store.commit("setLoading", true);

  try {
    await store.dispatch("UserModule/keplrBonusBlockLogin");
    bonusBlockWallet.value = store.getters["UserModule/bonusBlockWallet"];
  } catch (error: any) {
    if (error instanceof FormattedError) {
      await ElMessageBox.alert(error.message, error.name, {});
    } else if (error instanceof HttpUnauthorizedError) {
      await store.dispatch("UserModule/removeSession");
      await router.push("/");
    } else {
      console.error(error);
      await ElMessageBox.alert(
        "There was an error connecting your wallet, please try again.",
        "Error",
        {
          center: true,
        }
      );
    }
  } finally {
    store.commit("setLoading", false);
  }
}

onMounted(async () => {
  try {
    const response: Array<CalculationResultDto> = await store.dispatch(
      "HttpModule/getCalculationResults"
    );
    calculationResults.value = response;
  } catch (e) {
    console.error(e);
  }

  bonusBlockWallet.value = store.getters["UserModule/bonusBlockWallet"];
});
*/
</script>
<style lang="scss">
.campaign-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22em, 1fr));
  gap: 1em;
}

.campaign-card {
  position: relative;

  svg {
    height: 1em;
  }

  .card-link {
    cursor: pointer;
    font-size: 1.75em;
  }

  .text-link {
    cursor: pointer;

    svg {
      font-size: 0.8em;
      vertical-align: -0.05em;
    }
  }

  .text-muted {
    opacity: 0.64;
  }

  .el-progress .el-progress-bar__outer {
    border: 1px solid #000;
  }

  .el-progress .el-progress__text svg {
    vertical-align: -0.142em;
  }

  .el-progress.is-success .el-progress__text,
  .el-progress.is-warning .el-progress__text,
  .el-progress.is-exception .el-progress__text {
    color: #000;
  }

  .top-half,
  .bottom-half {
    border: 1px solid #000;
    padding: 0 1.25em;
  }
  .top-half {
    height: 6.3em;
    border-top-left-radius: 0.75em;
    border-top-right-radius: 0.75em;
  }
  .bottom-half {
    height: 6.8em;
    background: #000;
    color: #fff;
    border-bottom-left-radius: 0.75em;
    border-bottom-right-radius: 0.75em;
  }
}
</style>
