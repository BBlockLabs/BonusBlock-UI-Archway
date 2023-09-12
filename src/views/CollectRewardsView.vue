<template>
  <PageWrapper
    :full-width="true"
    class="fs-slightly-larger py-base"
  >
    <el-dialog :show-close="false" v-model="claimModal.open" class="claim-modal">
      <div v-if="claimModal.loading">
        <div class="el-loading-spinner static-spinner mb-small">
          <svg class="circular" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
          </svg>
        </div>
        Continue in your wallet
      </div>
      <div v-else>
        <img class="medal-image" :src="WebpMedal">
        <h1 class="fs-large my-small">Congratulations!</h1>
        <div>
          You have claimed
          <b
            >{{ getHumanAmount(claimModal.campaign) }}
            {{ claimModal.campaign.currency }}!</b
          >
        </div>


        <el-row class="mt-extra-large w-100" >

          <el-col :span="12">
            <el-button
              class="w-90"
              type="secondary"
              @click="claimModal.open = false"
            >
              Close
            </el-button>
          </el-col>

          <el-col :span="12">
            <el-button
              class="w-90"
              type="primary"
              round
              @click="generateAndCopyClaimImage(claimModal.campaign)"
            >Share<svg-share class="p-0 ml-small"
            /></el-button>
          </el-col>
        </el-row>


      </div>
    </el-dialog>

    <div class="limit-width px-large">
      <el-row align="middle" justify="space-between">
        <h2>Your stats</h2>
        <div v-if="todayInteractions !== null" style="margin-right: 2px">
          Today interactions: <strong>{{ todayInteractions }}</strong>
        </div>
      </el-row>
      <interactions-chart/>

      <el-row>
        <h2>Collect Rewards</h2>
      </el-row>
      <el-row class="mb-small" justify="center">
        <box-wrapper
          type="white"
          style="
            border-radius: 1em;
            justify-content: center;
            align-items: center;
          "
          class="d-flex flex-column mb-small py-extra-small archway-orange w-100"
        >

          <el-row class="flex-center">
            <SvgInfo class="mr-extra-small" style="width: 24px"></SvgInfo>
            <span>Failed (for any reason) claims can be re-claimed again in 1.5 mins</span>
          </el-row>
          <el-row class="flex-center mt-small">
            <SvgInfo class="mr-extra-small" style="width: 24px"></SvgInfo>
            <span>Claiming the reward requires a fee of 1ARCH</span>
          </el-row>
        </box-wrapper>
      </el-row>
      <div
        v-if="campaigns.length < 1"
        class="fullscreen-empty-list text-muted-more"
        style="height: 18em"
      >
        <template v-if="campaignsLoading">
          <div class="el-loading-spinner static-spinner mb-small">
            <svg class="circular" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
            </svg>
          </div>
          <!--b class="slightly-larger">Loading...</b-->
        </template>
        <template v-else>
          <svg-cube-top class="splash-image" />
          <b class="slightly-larger">Nothing to collect yet</b>
        </template>
      </div>
      <div v-else class="campaign-container">
        <div
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="campaign-card"
        >
          <div class="top-half">
            <el-row justify="space-between" align="middle">
              <h3 class="fs-slightly-larger">{{ campaign.name }}</h3>
            </el-row>
            <el-progress
              :percentage="getCampaignProgressPercent(campaign)"
              :status="
                elProgressStatusFromTimeRemaining(campaignTimeLeft(campaign))
              "
              :stroke-width="6"
            >
              <svg-clock class="mr-extra-small" />
              <el-tooltip
                v-if="campaignTimeLeft(campaign) <= 0"
                :content="
                  humanTimeLeft(Math.abs(campaignTimeLeft(campaign)), 3) +
                  ' ago'
                "
                placement="top"
              >
                <b class="fs-extra-small">Ended</b>
              </el-tooltip>
              <el-tooltip
                v-else
                :content="humanTimeLeft(campaignTimeLeft(campaign), 3)"
                placement="top"
              >
                <b class="fs-extra-small"
                  >{{ humanTimeLeft(campaignTimeLeft(campaign)) }} left</b
                >
              </el-tooltip>
            </el-progress>
          </div>
          <div class="bottom-half">
            <el-row
              justify="space-between"
              align="middle"
              class="pt-medium pb-medium"
            >
              <b>Your Reward</b>
            </el-row>
            <el-row justify="space-between" align="middle">
              <el-col :span="-1">
                <el-row align="middle">
                  <SvgArch class="currency-icon" />
                  <span
                    v-if="campaign.amount"
                    class="bold ml-small"
                    :class="campaign.status == 'CREATED' ? 'text-muted' : ''"
                  >
                    <el-tooltip
                      :disabled="campaign.status == 'SUBMITTED'"
                      content="Reward has been calculated but not yet assigned in the smart contract"
                      placement="top"
                    >
                      {{ getHumanAmount(campaign).substring(0, 17) }}
                      {{ campaign.currency }}
                    </el-tooltip>

                </span>
                  <span v-else class="flex-grow ml-small text-muted">
                  Unlocks on {{ nextCampaignCalculationDate(campaign) }}
                </span>
                </el-row>
              </el-col>

              <el-col :span="-1">
                <el-tooltip
                  :disabled="campaign.status == 'SUBMITTED'"
                  content="Reward has been calculated but not yet assigned in the smart contract"
                  placement="top"
                >
                  <el-button type="primary" :disabled="campaign.status == 'CREATED'" :loading="claimModal.loading" @click="claimCampaign(campaign)">
                    Claim
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>

    <el-divider />

    <div class="limit-width px-large">
      <el-row>
        <h2>Explore more</h2>
      </el-row>
      <product-list />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { store } from "@/store";
import { AwesomeQR } from "awesome-qr";
import VueCommonMixin from "@/common/Mixin";
import Logo from "@/assets/logo/logo.png";
import PageWrapper from "@/components/PageWrapper.vue";
import SvgClock from "@/assets/icons/clock.svg?component";
import SvgShare from "@/assets/icons/share.svg?component";
import SvgArch from "@/assets/currencies/arch.svg?component";
import WebpMedal from "@/assets/images/congratulations_medal.webp";
import SvgCubeTop from "@/assets/icons/cube-top.svg?component";
import ClaimSharingBackground from "@/assets/images/claim-sharing-image-template.svg?raw";
import moment from "moment";
import CampaignWithRewardDto from "@/common/api/dto/CampaignWithRewardDto";
import InteractionsChart from "@/components/InteractionsChart.vue";
import ProductList from "@/components/ProductList.vue";
import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";
import Toast from "@/common/Toast";
import { ArchwayLeapClient } from "@/common/ArchwayLeapClient";
import CosmostationWalletClient from "@/common/CosmostationWalletClient";
import SvgInfo from "@/assets/icons/info.svg";
import BoxWrapper from "@/components/BoxWrapper.vue";

let localTimeOffsetMs: number = 0;
const now = ref(Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000));
const timer = setInterval(() => {
  now.value = Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000);
}, 1000);

onMounted(() => {
  updateRewards();
  fetchTodayInteractions();
});

onUnmounted(() => {
  clearInterval(timer);
});

let claimModal = reactive({
  campaign: {},
  open: false,
  loading: false,
});

const todayInteractions = ref(null as number | null);
const campaignsLoading = ref(true);
const campaigns: Array<CampaignWithRewardDto> = reactive([]);

function fetchTodayInteractions() {
  store
    .dispatch("HttpModule/loadAnalytics", {
      timeZoneOffset: new Date().getTimezoneOffset() * -1,
    })
    .then((result) => {
      for (let k in result.interactions) {
        todayInteractions.value = result.interactions[k];
        break;
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

function updateRewards() {
  // load rewards
  campaignsLoading.value = true;
  store.dispatch("HttpModule/getCampaignsWithReward").then((data) => {
    campaigns.length = 0;
    if (data.payload) {
      for (let campaign of data.payload) {
        campaigns.push(campaign);
      }
    }
    localTimeOffsetMs = moment().diff(data.now);
    campaignsLoading.value = false;
  });
}

async function claimCampaign(campaign: CampaignWithRewardDto): Promise<void> {
  const loggedInWith = store.state.UserModule?.loggedInWith;
  let client;

  switch (loggedInWith) {
    case "keplr":
      client = ArchwayKeplrClient;
      break;
    case "leap":
      client = ArchwayLeapClient;
      break;
    case "cosmostation":
      client = await CosmostationWalletClient.create();
      break;
    default: {
      throw new Error("Unknown wallet: " + loggedInWith);
    }
  }

  claimModal.campaign = campaign;
  claimModal.loading = true;

  let claimFee;
  try {
    claimFee = await client.getRewardClaimFee(campaign.smartContractAddress)
  } catch (e: any) {
    Toast.make("Claim failure!", e.message, "error", false, 3000);
    return;
  }

  let index = campaigns.indexOf(campaign);

  try {
    await store.dispatch("HttpModule/claimRewardInit", {
      campaignId: campaign.id,
    });
    await client.claimArchwayReward(campaign.smartContractAddress, campaign.id, claimFee);

    campaigns.splice(index, 1);

    claimModal.open = true;
  } catch (e: any) {
    Toast.make("Claim failure!", e.message, "error", false, 3000);
    if (e.toString().includes("User pool does not exist")) {
      campaigns.splice(index, 1);
    }
  }

  claimModal.loading = false;
  try {
    await store.dispatch("HttpModule/claimRewardCheck", {});
  } catch (ignoredError: any) {
    /* empty */
  }
}

function getHumanAmount(campaign: CampaignWithRewardDto): string {
  let integerPart =
    campaign.amount.length > campaign.decimal
      ? campaign.amount.substring(0, campaign.amount.length - campaign.decimal)
      : "0";
  let fractionalPart =
    campaign.amount.length > campaign.decimal
      ? campaign.amount.substring(campaign.amount.length - campaign.decimal)
      : campaign.amount;
  if (fractionalPart !== "0") {
    while (fractionalPart.length < campaign.decimal) {
      fractionalPart = "0" + fractionalPart;
    }
  }
  fractionalPart = fractionalPart.replace(/0+$/, "");
  return fractionalPart === ""
    ? integerPart
    : integerPart + "." + fractionalPart;
}

function getCampaignWeekNumber(campaign: CampaignWithRewardDto): number {
  return Math.floor((now.value - campaign.periodFromParsed) / 60 / 60 / 24 / 7);
}

function nextCampaignCalculationDate(campaign: CampaignWithRewardDto): string {
  const date: moment.Moment = moment.unix(campaign.periodFromParsed);
  const nowDate: moment.Moment = moment.unix(now.value);

  while (date.diff(nowDate, "days") < 0) {
    date.add(7, "days");
  }

  return date.format("MMM DD");
}

function campaignTimeLeft(campaign: CampaignWithRewardDto): number {
  return campaign.periodTillParsed - now.value;
}

function getCampaignProgressPercent(campaign: CampaignWithRewardDto): number {
  return (
    Math.round(
      Math.min(
        Math.max(
          (now.value - campaign.periodFromParsed) /
            (campaign.periodTillParsed - campaign.periodFromParsed),
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

function humanTimeLeft(seconds: number, numberOfParts: number = 1): string {
  if (seconds < 60) {
    return seconds + " s";
  }
  let parts = [(seconds % 60) + " s"];
  let minutes = Math.floor(seconds / 60);
  parts.unshift((minutes % 60) + " m");
  if (minutes < 60) {
    return parts.slice(0, numberOfParts).join(" ");
  }
  let hours = Math.floor(minutes / 60);
  parts.unshift((hours % 24) + " h");
  if (hours < 60) {
    return parts.slice(0, numberOfParts).join(" ");
  }
  let days = Math.floor(hours / 24);
  parts.unshift((days % 7) + " d");
  if (days < 7) {
    return parts.slice(0, numberOfParts).join(" ");
  }
  let weeks = Math.floor(days / 7);
  parts.unshift(weeks + " w");
  return parts.slice(0, numberOfParts).join(" ");
}

function getReferralQrData(): Promise<string> {
  let referralLink = store.getters["UserModule/refLink"];
  return new AwesomeQR({
    colorDark: "#1E1C4E",
    correctLevel: 3,
    logoImage: Logo,
    margin: 14, //px
    size: 35 * 14, // px
    text: referralLink,
    whiteMargin: false,
    // ...this.options,
  })
    .draw()
    .then((data) => {
      if (typeof data !== "string") {
        return "";
      }
      return data.substring(data.indexOf(",") + 1);
    })
    .catch((e) => {
      console.error(e);
      return "";
    });
}

function generateAndCopyClaimImage(campaign: CampaignWithRewardDto): void {
  let img = new Image();
  img.onload = function () {
    try {
      let width = img.width;
      let height = img.height;
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      if (ctx === null) {
        throw new TypeError("canvas.getContext failed");
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(function (blob) {
        try {
          if (blob === null) {
            throw new TypeError("canvas.toBlob failed");
          }
          const item = new ClipboardItem({ "image/png": blob });
          VueCommonMixin.methods.copyToClipboard(item);
        } catch (e) {
          console.error(e);
          ElMessage({ message: "Failed to copy image", type: "error" });
        }
      });
    } catch (e) {
      console.error(e);
      ElMessage({ message: "Failed to generate image", type: "error" });
    }
  };
  img.onerror = function () {
    console.error("img.onerror");
    ElMessage({ message: "Failed to generate image", type: "error" });
  };
  getReferralQrData().then((qrData) => {
    let svgData, svgBase46;
    try {
      svgData = ClaimSharingBackground.replace(
        /\{campaign_name}/g,
        campaign.name
      )
        .replace(
          /\{campaign_week}/g,
          "Week " + (getCampaignWeekNumber(campaign))
        )
        .replace(/\{currency}/g, campaign.currency)
        .replace(/\{amount}/g, getHumanAmount(campaign).substring(0, 9))
        .replace(/\{network}/g, campaign.networkName)
        .replace(/\{qr_data}/g, qrData);
      svgBase46 = "data:image/svg+xml;base64," + btoa(svgData);
      img.src = svgBase46;
    } catch (e) {
      console.error(e);
      ElMessage({ message: "Failed to generate image", type: "error" });
      return;
    }
  });
}
</script>

<style scoped></style>
