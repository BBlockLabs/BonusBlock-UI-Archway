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
        <svg-medal class="medal-image" />
        <h1 class="fs-large my-small">Congrats!</h1>
        <div>
          You have claimed
          <b
            >{{ getHumanAmount(claimModal.campaign) }}
            {{ claimModal.campaign.currency }}!</b
          >
        </div>
        <div class="fs-small mt-large">
          Share your win rate with your network and get referral bonus!
        </div>
        <div class="mt-small">
          <el-button
            type="primary"
            round
            @click="generateAndCopyClaimImage(claimModal.campaign)"
            >Share<svg-share class="ml-small"
          /></el-button>
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
            <svg-clock class="mr-extra-small" />
            <el-tooltip v-if="campaignTimeLeft(campaign) <= 0" :content="humanTimeLeft(Math.abs(campaignTimeLeft(campaign)), 3) + ' ago'" placement="top">
              <b class="fs-extra-small">Ended</b>
            </el-tooltip>
            <el-tooltip v-else :content="humanTimeLeft(campaignTimeLeft(campaign), 3)" placement="top">
              <b class="fs-extra-small">{{ humanTimeLeft(campaignTimeLeft(campaign)) }} left</b>
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
              {{ getHumanAmount(campaign).substring(0, 17) }} {{ campaign.currency }}
            </div>
            <div v-else class="flex-grow ml-small text-muted">
              Unlocks on {{ nextCampaignCalculationDate(campaign) }}
            </div>
            <el-tooltip :content="campaign.amount ? 'Claim your rewards' : 'Unlocks on ' + nextCampaignCalculationDate(campaign)" placement="top">
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
      <div v-if="campaignsLoading">
        Loading
      </div>
      <div v-if="campaigns.length < 1">
        No rewards yet
      </div>
    </div>

    <el-divider />

    <el-row>
      <h2>Keep Earning</h2>
    </el-row>
    <div class="campaign-container mb-base">
      <div v-for="announcement in announcements" :key="announcement.id" class="project-card">
        <div class="card-image" :style="{ backgroundImage: 'url(' + announcement.image + ')' }"></div>
        <div class="card-content">
          <h3 class="fs-large my-base">{{ announcement.title }}</h3>
          {{ announcement.description }}
          <div class="d-flex mt-large mb-base">
            <social-links
              :twitter="LinkTwitter"
              :github="LinkGithub"
              :telegram="LinkTelegram"
              :reddit="LinkReddit"
              class="social-links"
            />
            <el-button type="primary" class="ml-auto" @click="openAnnouncement(announcement)">Visit</el-button>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { store } from "@/store";
import { AwesomeQR } from "awesome-qr";
import VueCommonMixin from "@/common/Mixin";
import Logo from "@/assets/logo/logo.png";
import PageWrapper from "@/components/PageWrapper.vue";
import SocialLinks from "@/components/SocialLinks.vue";
import SvgLock from "@/assets/icons/lock.svg?component";
import SvgLink from "@/assets/icons/open-new-window.svg?component";
import SvgClock from "@/assets/icons/clock.svg?component";
import SvgChevronRight from "@/assets/icons/nav-arrow-right.svg?component";
import SvgShare from "@/assets/icons/share.svg?component";
import SvgAry from "@/assets/currencies/ary.svg?component";
import SvgBab from "@/assets/currencies/bab.svg?component";
import SvgBeam from "@/assets/currencies/beam.svg?component";
import SvgEth from "@/assets/currencies/eth.svg?component";
import SvgEvx from "@/assets/currencies/evx.svg?component";
import SvgLuna from "@/assets/currencies/luna.svg?component";
import SvgPowr from "@/assets/currencies/powr.svg?component";
import SvgUni from "@/assets/currencies/uni.svg?component";
import SvgMedal from "@/assets/images/congratulations_medal.svg?component";
import ClaimSharingBackground from "@/assets/images/claim-sharing-image-template.svg?raw";
import moment from "moment";
import type CampaignWithRewardDto from "@/common/api/dto/CampaignWithRewardDto";
import type AnnouncementsDto from "@/common/api/dto/AnnouncementsDto";

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

let localTimeOffsetMs: number = 0;
const now = ref(Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000));
const timer = setInterval(() => {
  now.value = Math.ceil((new Date().valueOf() - localTimeOffsetMs) / 1000);
}, 1000);
onUnmounted(() => {
  clearInterval(timer);
});

let claimModal = reactive({
  campaign: {},
  open: false,
  loading: false,
});

const campaignsLoading = ref(true);
const campaigns: Array<CampaignWithRewardDto> = reactive([]);
const announcements: Array<AnnouncementsDto> = reactive([]);

onMounted(() => {
  // load rewards
  store.dispatch(
      "HttpModule/getCampaignsWithReward"
  ).then((data) => {
    campaigns.length = 0;
    if (data.payload) {
      for (let campaign of data.payload) {
        campaigns.push(campaign);
      }
    }
    localTimeOffsetMs = moment().diff(data.now);
    campaignsLoading.value = false;
  });
  // load announcements
  store.dispatch(
      "HttpModule/getAnnouncementsList",
      { page: 1, perPage: 3, sort: "HIGHEST_POOL", activeCampaignsOnly: true }
    ).then((newAnnouncements) => {
      announcements.length = 0;
      if (newAnnouncements) {
        for (let newAnnouncement of newAnnouncements) {
          announcements.push(newAnnouncement);
        }
      }
    });
});

function openCampaignDetails(campaign: CampaignWithRewardDto): void {
  // todo: actual implementation
  ElMessageBox.alert("openCampaignDetails " + campaign.id, "Todo");
}

function claimCampaign(campaign: CampaignWithRewardDto): void {
  // todo: actual implementation
  claimModal.campaign = campaign;
  claimModal.open = true;
  claimModal.loading = true;
  setTimeout(() => {
    claimModal.loading = false;
  }, 1500);
}

function openAnnouncement(announcement: AnnouncementsDto): void {
  // todo: actual implementation
  window.open(announcement.mainLink, "_blank");
}

function getHumanAmount(campaign: CampaignWithRewardDto): string {
  let integerPart = (campaign.amount.length > campaign.decimal) ? campaign.amount.substring(0, campaign.amount.length - campaign.decimal) : "0";
  let fractionalPart = (campaign.amount.length > campaign.decimal) ? campaign.amount.substring(campaign.amount.length - campaign.decimal) : campaign.amount;
  if (fractionalPart !== "0") {
    while (fractionalPart.length < campaign.decimal) {
      fractionalPart = "0" + fractionalPart;
    }
  }
  fractionalPart = fractionalPart.replace(/0+$/, "");
  return (fractionalPart === "") ? integerPart : integerPart + "." + fractionalPart;
}

function getCampaignWeekNumber(campaign: CampaignWithRewardDto): number {
  return Math.floor((now.value - campaign.periodFromParsed) / 60 / 60 / 24 / 7);
}

function nextCampaignCalculationDate(campaign: CampaignWithRewardDto): string {
  const secondsInPeriod = 60 * 60 * 24 * 7;
  let remainingSeconds = secondsInPeriod - (now.value - campaign.periodFromParsed) % secondsInPeriod;
  let date = new Date(now.value + remainingSeconds * 1000);
  const month_names_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];
  return month_names_short[date.getMonth()] + " " + date.getDate();
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
      svgData = ClaimSharingBackground
        .replace(/\{campaign_name}/g, campaign.name)
        .replace(/\{campaign_week}/g, "Week " + (getCampaignWeekNumber(campaign) + 1))
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
<style lang="scss">
.claim-modal {
  text-align: center;
  max-width: 19.93em;

  .el-loading-spinner {
    position: static;
    margin-top: 0;
  }

  .medal-image {
    width: 200px;
    height: 200px;
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
