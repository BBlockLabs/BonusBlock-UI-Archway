<template>
  <PageWrapper>
    <el-dialog v-model="claimModal.open" class="claim-modal">
      <div v-if="claimModal.loading">
        <div class="el-loading-spinner mb-small">
          <svg class="circular" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
          </svg>
        </div>
        Continue in your wallet
      </div>
      <div v-else>
        <h1 class="fs-large my-small">Congrats!</h1>
        <div>
          You have claimed
          <b
            >{{ claimModal.campaign.amount }}
            {{ claimModal.campaign.currency }}!</b
          >
        </div>
        <div class="fs-small mt-large">
          Share your win rate with your network and get referral bonus!
        </div>
        <el-button class="mt-large" @click="claimModal.open = false"
          >Close</el-button
        >
      </div>
    </el-dialog>

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
            <svg-link
              class="card-link"
              @click="openCampaignDetails(campaign)"
            />
          </el-row>
          <el-progress
            :percentage="getCampaignProgressPercent(campaign)"
            :status="
              elProgressStatusFromTimeRemaining(campaignTimeLeft(campaign))
            "
            stroke-width="5"
          >
            <svg-clock />&nbsp;<b class="fs-extra-small">{{
              campaignTimeLeft(campaign) <= 0
                ? "Ended"
                : humanTimeLeft(campaignTimeLeft(campaign)) + " left"
            }}</b>
          </el-progress>
        </div>
        <div class="bottom-half">
          <el-row
            justify="space-between"
            align="middle"
            class="pt-medium pb-medium"
          >
            <b>Your Reward</b>
            <div
              class="text-link text-muted"
              @click="openCampaignDetails(campaign)"
            >
              See more <svg-chevron-right />
            </div>
          </el-row>
          <el-row justify="space-between" align="middle">
            <component
              :is="currencyIcons[campaign.currency] ?? 'div'"
              class="currency-icon"
            />
            <div v-if="campaign.amount" class="flex-grow ml-small">
              {{ campaign.amount }} {{ campaign.currency }}
            </div>
            <div v-else-if="campaign.unlockDate" class="flex-grow ml-small text-muted">
              Unlocks on {{ campaign.unlockDate }}
            </div>
            <el-tooltip :content="campaign.amount ? 'Claim your rewards' : 'Unlocks on ' + campaign.unlockDate" placement="top">
              <div>
                <el-button
                  type="primary"
                  class="yellow-button"
                  :disabled="!campaign.amount"
                  @click="claimCampaign(campaign)"
                >
                  <svg-lock v-if="!campaign.amount" />
                  Claim
                </el-button>
              </div>
            </el-tooltip>
          </el-row>
        </div>
      </div>
    </div>

    <el-divider />

    <el-row>
      <h2>Keep Earning</h2>
    </el-row>
    <div class="campaign-container mb-base">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="card-image" :style="{ backgroundImage: 'url(' + project.image + ')' }"></div>
        <div class="card-content">
          <h3 class="fs-large my-base">{{ project.name }}</h3>
          {{ project.description }}
          <div class="d-flex mt-large mb-base">
            <social-links
              :twitter="LinkTwitter"
              :github="LinkGithub"
              :telegram="LinkTelegram"
              :reddit="LinkReddit"
              class="social-links"
            />
            <el-button type="primary" class="ml-auto" @click="openProject(project)">Visit</el-button>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import PageWrapper from "@/components/PageWrapper.vue";
import SocialLinks from "@/components/SocialLinks.vue";
import SvgLock from "@/assets/icons/lock.svg?component";
import SvgLink from "@/assets/icons/open-new-window.svg?component";
import SvgClock from "@/assets/icons/clock.svg?component";
import SvgChevronRight from "@/assets/icons/nav-arrow-right.svg?component";
import SvgAry from "@/assets/currencies/ary.svg?component";
import SvgBab from "@/assets/currencies/bab.svg?component";
import SvgBeam from "@/assets/currencies/beam.svg?component";
import SvgEth from "@/assets/currencies/eth.svg?component";
import SvgEvx from "@/assets/currencies/evx.svg?component";
import SvgLuna from "@/assets/currencies/luna.svg?component";
import SvgPowr from "@/assets/currencies/powr.svg?component";
import SvgUni from "@/assets/currencies/uni.svg?component";

const LinkGithub: string = import.meta.env.VITE_LINK_GITHUB;
const LinkTwitter: string = import.meta.env.VITE_LINK_TWITTER;
const LinkTelegram: string = import.meta.env.VITE_LINK_TELEGRAM;
const LinkReddit: string = import.meta.env.VITE_LINK_REDDIT;

const currencyIcons = {
  ARY: SvgAry,
  BAB: SvgBab,
  BEAM: SvgBeam,
  ETH: SvgEth,
  EVX: SvgEvx,
  LUNA: SvgLuna,
  POWR: SvgPowr,
  UNI: SvgUni,
};

const now = ref(Math.ceil(new Date().valueOf() / 1000));
const timer = setInterval(() => {
  now.value = Math.ceil(new Date().valueOf() / 1000);
}, 1000);
onUnmounted(() => {
  clearInterval(timer);
});

let claimModal = reactive({
  campaign: {},
  open: false,
  loading: false,
});

type Campaign = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  unlockDate?: string;
  started: number;
  expiring: number;
};

type Project = {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
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
    amount: 0,
    currency: "ETH",
    unlockDate: "Apr 9",
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

let projects: Array<Project> = [
  {
    id: 1,
    name: "Project Name 1",
    description: "Lorem 1 ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia augue eget nisl euismod, quis pulvinar massa pharetra. Sed vestibulum tortor et magna sodales, nec cursus sapien eleifend. In hac habitasse platea dictumst.",
    image: "https://derpicdn.net/img/2012/1/2/3/large.png",
    link: "https://derpibooru.org/images/3",
  },
  {
    id: 2,
    name: "Project Name 2",
    description: "Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia augue eget nisl euismod, quis pulvinar massa pharetra. Sed vestibulum tortor et magna sodales, nec cursus sapien eleifend. In hac habitasse platea dictumst.",
    image: "https://derpicdn.net/img/view/2021/5/31/2625576.png",
    link: "https://derpibooru.org/images/2625576",
  },
  {
    id: 3,
    name: "Project Name 3",
    description: "Lorem 3 ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia augue eget nisl euismod, quis pulvinar massa pharetra. Sed vestibulum tortor et magna sodales, nec cursus sapien eleifend. In hac habitasse platea dictumst.",
    image: "https://derpicdn.net/img/2022/5/23/2871156/large.jpg",
    link: "https://derpibooru.org/images/2871156",
  },
];

function openCampaignDetails(campaign: Campaign): void {
  // todo: actual implementation
  ElMessageBox.alert("openCampaignDetails " + campaign.id, "Todo");
}

function claimCampaign(campaign: Campaign): void {
  // todo: actual implementation
  claimModal.campaign = campaign;
  claimModal.open = true;
  claimModal.loading = true;
  setTimeout(() => {
    claimModal.loading = false;
  }, 1500);
}

function openProject(project: Project): void {
  // todo: actual implementation
  window.open(project.link, "_blank");
}

function campaignTimeLeft(campaign: Campaign): number {
  return campaign.expiring - now.value;
}

function getCampaignProgressPercent(campaign: Campaign): number {
  return (
    Math.round(
      Math.min(
        Math.max(
          (now.value - campaign.started) /
            (campaign.expiring - campaign.started),
          0
        ),
        1
      ) * 1000
    ) / 10
  );
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
    return seconds + " s";
  }
  let minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes + " m";
  }
  let hours = Math.floor(minutes / 60);
  if (hours < 60) {
    return hours + " h";
  }
  let days = Math.floor(hours / 24);
  if (days < 7) {
    return days + " d";
  }
  let weeks = Math.floor(days / 7);
  return weeks + " w";
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
.claim-modal {
  text-align: center;
  max-width: 19.93em;

  .el-loading-spinner {
    position: static;
    margin-top: 0;
  }
}

.campaign-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22em, 1fr));
  gap: 1em;
}

.campaign-card {
  h3 {
    margin: 1.1em 0;
  }

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

  .currency-icon {
    font-size: 2em;
  }

  div.currency-icon {
    width: 1em;
  }

  .el-progress .el-progress-bar__outer {
    border: 1px solid #000;
  }

  .el-progress .el-progress__text {
    min-width: 4.75em;
    text-align: right;

    svg {
      vertical-align: -0.142em;
    }
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

.project-card {
  background: #fff;
  border: 1px solid #000;
  border-radius: 0.75em;
  overflow: hidden;

  .card-image {
    border-bottom: 1px solid #000;
    height: 14.286em;
    background-size: cover;
  }

  .card-content {
    padding: 0 1.25em 1.25em 1.25em;

    .social-links {
      gap: 0.5em;
    }

    .el-button {
      box-shadow: none;
    }
  }
}
</style>
