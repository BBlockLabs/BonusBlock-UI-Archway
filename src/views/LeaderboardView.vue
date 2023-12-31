<template>
  <PageWrapper full-width class="m-0 fs-slightly-larger">
    <el-dialog
      v-model="calculationDialog"
      :show-close="false"
      class="fs-large calculation-dialog"
    >
      <el-row justify="center">
        <h2 class="w-100 tc">How calculations work?</h2>
        <SvgMissionCardSample style="border-radius: 1em"/>


        <div class="tc fs-medium mt-large mx-large">
          <div>
            Accomplish missions to earn <span class="archway-orange">Community XP</span>, which will elevate your rank as you gain more experience.
          </div>
          <div class="mt-small">
            <span class="archway-orange">Community XP</span> serves the additional purpose of unlocking various community badges!
          </div>
          <el-button
            class="mt-small w-100"
            type="secondary"
            @click="calculationDialog = false"
          >
            Close</el-button
          >
        </div>
      </el-row>
    </el-dialog>

    <el-dialog
      v-model="badgeShowcaseDialog"
      :show-close="false"
      class="fs-large calculation-dialog"
    >
      <el-row :style="badgeShowcaseDialog ? '' : 'height: 25em;'" class="mb-small" justify="center">
        <component
          :is="badgeShowcaseDialog ? getBadgeImageForXp(badgeShowcaseDialog) : {}"
        />

      </el-row>
      <el-button
        class="mt-auto w-100"
        type="secondary"
        @click="badgeShowcaseDialog = null"
      >
        Close</el-button
      >
    </el-dialog>

    <el-dialog
      v-model="newBadgeDialog"
      :before-close="newBadgeAcknowledge"
      :show-close="false"
      class="px-medium pt-medium fs-large calculation-dialog"
    >
      <el-row justify="center">
        <component
          :is="getNewBadgeImage()"
          style="height: 35em; border-radius: 18px; border: 1px solid #CCCCCC"
        />

        <h2 class="tc">Congratulations!</h2>
        <span class="fs-medium tc">You have unlocked a new mint badge.</span>
        <el-row class="mt-medium w-100" gutter="10">

          <el-col :span="12">
            <el-button
              class="w-100"
              type="secondary"
              @click="newBadgeAcknowledge"
            >
              Close
            </el-button>
          </el-col>

          <el-col :span="12">
            <el-button class="w-100" @click="newBadgeMint()" type="primary">
              Claim
            </el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-dialog>

    <div class="limit-width leaderboard">
      <box-wrapper type="white" round class="mt-large p-large">
        <el-row align="top" justify="space-between">
          <el-col class="fs-medium bold mb-large" :span="-1">
            <el-row class="flex-nowrap" align="middle">
              <el-avatar :src="getAvatar(walletAddress)" class="mr-small"/>
              <el-tooltip :content="walletAddress" placement="top">
                <span class="m-auto">{{ shortWallet(walletAddress) }}</span>
              </el-tooltip>
            </el-row>
          </el-col>

          <el-col class="pointer" :span="-1">
            <el-link :href="shareProgressLink" target="_blank">
              <el-button class="mr-small" type="primary"
                >Share progress on Twitter
                <svg-twitter class="ml-small icon-small" />
              </el-button>
            </el-link>
          </el-col>
        </el-row>
        <el-row class="fs-medium mt-small" justify="space-between">
          <el-col class="flex-grow flex-basis-0" :span="-1">
            <el-row> Your rank </el-row>
            <el-row class="fs-extra-large archway-orange">
              {{
                leaderboard.myLeaderboardSpot
                  ? "#" + leaderboard.myLeaderboardSpot.position.rank
                  : "-"
              }}
            </el-row>
          </el-col>
          <el-col :span="-1">
            <el-row>
              <span class="mx-auto"> Your XP </span>
            </el-row>
            <el-row class="fs-extra-large">
              <span class="mx-auto">
                {{
                  leaderboard.myLeaderboardSpot
                    ? leaderboard.myLeaderboardSpot.position.score
                    : "0"
                }}
              </span>
            </el-row>
          </el-col>
          <el-col style="align-items: flex-end;" class="d-flex flex-basis-0 flex-column flex-grow" :span="-1">
            <el-row> Your top dApp </el-row>
            <el-row class="t-end fs-extra-large">
              {{
                leaderboard.myLeaderboardSpot
                  ? leaderboard.myLeaderboardSpot.position.topDapp
                  : "-"
              }}
            </el-row>
          </el-col>
        </el-row>
        <hr />

        <el-row style="margin-top: 7em" class="m-large">
          <el-col style="position: relative;">

            <el-progress
              :percentage="
                leaderboard.myLeaderboardSpot
                  ? getXpPercentage(leaderboard.myLeaderboardSpot.position.score)
                  : 0
              "
              status="success"
              :stroke-width="7"
              :show-text="false"
            ></el-progress>

            <span
              v-for="value in BADGE_XP"
              :key="value"
              style="position: absolute; top: 0"
              :style="'left: ' + getXpPercentage(value) + '%'"

            >
              <component
                :class="badgeActive(value) ? 'pointer' : ''"
                @click="badgeActive(value) ? badgeShowcaseDialog = value : {}"
                :is="getBadgeForXp(value)"
                style="
                  position: absolute;
                  height: 5em;
                  bottom: 0.8em;
                  left: -2.5em;
                "
              />
              <SvgCircle
                style="
                  position: absolute;
                  width: 0.8em;
                  left: -0.4em;
                  top: -0.17em;
                "
                :class="badgeActive(value) ? 'archway-orange' : ''"
                :style="badgeActive(value) ? '' : 'color: #CCCCCC'"
              />
            </span>


          </el-col>
        </el-row>
        <el-col class="mb-medium d-flex is-align-middle archway-orange">
          <SvgInfo class="mr-small icon-small"/> Repeating missions allows you to accumulate Community XP, though the token reward has a limit.
        </el-col>
        <el-row justify="space-between">
          <el-col :span="-1">
            <el-row>
              <strong class="fs-medium">Mint badge progress</strong>
            </el-row>
            <el-row class="archway-orange">
              {{
                leaderboard.myLeaderboardSpot
                  ? leaderboard.myLeaderboardSpot.position.score
                  : "0"
              }}
              /
              {{
                leaderboard.myLeaderboardSpot
                  ? getClosestNextBadgeXp(leaderboard.myLeaderboardSpot.position.score)
                  : getClosestNextBadgeXp(undefined)
              }}
              XP
            </el-row>
          </el-col>
          <el-col
            :span="-1"
          >
            <!--            <el-button class="mr-small is-link" type="primary"
              >Share badge</el-button
            >-->
<!--            <el-button
              v-if="
                leaderboard.myLeaderboardSpot &&
                leaderboard.myLeaderboardSpot.canGetDiscordRole &&
                !roleClaimed
              "
              :loading="mintBadgeLoading"
              :disabled="mintBadgeLoading"
              type="primary"
              @click="claimDiscordRole"
            >Claim Discord Role</el-button>-->

            <el-button
              v-if="
                leaderboard.myLeaderboardSpot &&
                leaderboard.myLeaderboardSpot.position.score >= BADGE_XP[0] &&
                !leaderboard.myLeaderboardSpot.badgeClaimed
              "
              :loading="mintBadgeLoading"
              :disabled="mintBadgeLoading"
              type="primary"
              @click="newBadgeDialog = true"
            >Mint badge</el-button
            >
          </el-col>
        </el-row>
      </box-wrapper>

      <el-row align="middle" justify="space-between" class="mt-medium">
        <el-col
          :span="-1"
          flex-nowrap
          style="display: flex; flex-direction: row; gap: 0.6em"
        >
          <h2>Leaderboard</h2>
        </el-col>
        <el-col
          class="archway-orange pointer"
          :span="-1"
          @click="calculationDialog = true"
        >
          How calculations work?</el-col
        >
      </el-row>

      <el-row justify="center">
        <box-wrapper
          type="white"
          style="
            border-radius: 1em;
            justify-content: center;
            align-items: center;
          "
          class="d-flex mb-small py-extra-small archway-orange w-100"
        >
          <SvgInfo class="mr-extra-small" style="width: 24px"></SvgInfo>
          <span>Leaderboard updates may take up to 10 minutes</span>
        </box-wrapper>
      </el-row>

      <el-row>
        <el-col :span="-1">
          <el-tabs
            v-model="leaderboardTab"
            @tab-change="
              (name) => {
                leaderboardPeriod =
                  name === LeaderboardPeriod.ALL_TIME.toString()
                    ? LeaderboardPeriod.ALL_TIME
                    : LeaderboardPeriod.WEEK;
              }
            "
          >
            <el-tab-pane
              label="All time"
              :name="LeaderboardPeriod.ALL_TIME.toString()"
            />

            <el-tab-pane
              label="This week"
              :name="LeaderboardPeriod.WEEK.toString()"
            />
          </el-tabs>
        </el-col>
      </el-row>

      <div class="leaderboard-table">
        <div class="leaderboard-header">Rank</div>
        <div class="leaderboard-header">User</div>
        <div class="leaderboard-header"></div>
        <div class="leaderboard-header">Total on-chain</div>
        <div class="leaderboard-header">Top dApp</div>
        <div class="leaderboard-header">Community XP</div>
        <template v-if="leaderboard.searchResults.length > 0">
          <template
            v-for="leaderboardItem in leaderboard.searchResults"
            :key="leaderboardItem.walletAddress"
          >
            <div class="leaderboard-element first">
              <strong class="fs-large bold archway-orange">
                {{ leaderboardItem.rank }}
              </strong>
            </div>
            <div class="leaderboard-element fs-medium bold">
              <el-avatar
                :src="getAvatar(leaderboardItem.walletAddress)"
                class="mr-small"
              >
              </el-avatar>
              <span style="width: 8em">
                {{ leaderboardItem.walletAddress }}
              </span>
            </div>
            <div class="leaderboard-element">
            </div>
            <div class="leaderboard-element fs-medium">
              {{ leaderboardItem.totalOnChain }}
            </div>
            <div class="leaderboard-element fs-medium">
              <div style="text-wrap: nowrap">
                {{ leaderboardItem.topDapp }}
              </div>

            </div>
            <div class="leaderboard-element last fs-medium bold archway-orange">
              {{ leaderboardItem.score }}
            </div>
          </template>
        </template>
      </div>
      <template v-if="leaderboard.searchResults.length > 0">
        <el-row justify="space-between" align="middle" class="px-large my-large">
          <el-col :span="-1" class="bold">
            showing
            <span class="archway-orange">
              {{ page * perPage - perPage + 1 }}-{{ page * perPage - perPage + leaderboard.searchResults.length }}
            </span>
            of {{ leaderboard.totalRows }} results
          </el-col>
          <el-col :span="-1">
            <el-pagination
              class="fs-extra-large"
              layout="prev, pager, next"
              :total="leaderboard.totalRows"
              :page-size="perPage"
              :current-page="page"
              @current-change="currentPageChange"
            />
          </el-col>
          <el-col :span="-1">
            <strong>Results per page: </strong>
            <strong class="archway-orange">{{ perPage }}</strong>
            <el-dropdown
              class="dropdown"
              placement="top-end"
              :hide-on-click="true"
              @command="perPageChange"
            >
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right">
                  <svg-chevron-up />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="15">15</el-dropdown-item>
                  <el-dropdown-item :command="50">50</el-dropdown-item>
                  <el-dropdown-item :command="75">75</el-dropdown-item>
                  <el-dropdown-item :command="100">100</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </template>
      <template v-if="leaderboard.searchResults.length < 1">
        <el-row class="fs-large mt-extra-large" justify="center">
          No data
        </el-row>
      </template>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import SvgChevronUp from "@/assets/icons/nav-arrow-up.svg?component";
import {store} from "@/store";
import PaginationRequest from "@/common/api/PaginationRequest";
import ArchwayLeaderboardResponse from "@/common/api/archway/ArchwayLeaderboardResponse";
import BoxWrapper from "@/components/BoxWrapper.vue";
import {computed, ComputedRef, onMounted, Ref, ref, watch} from "vue";
import {renderDiscs} from "@whi/identicons";
import SvgTwitter from "@/assets/icons/twitter.svg";
import SvgBadge1000 from "@/assets/badges/1000.svg";
import SvgBadge1000Lock from "@/assets/badges/1000-locked.svg";
import SvgBadge2000 from "@/assets/badges/2000.svg";
import SvgBadge2000Lock from "@/assets/badges/2000-locked.svg";
import SvgBadge5000 from "@/assets/badges/5000.svg";
import SvgBadge5000Lock from "@/assets/badges/5000-locked.svg";
import SvgBadge10000 from "@/assets/badges/10000.svg";
import SvgBadge10000Lock from "@/assets/badges/10000-locked.svg";
import SvgNewBadge1 from "@/assets/badges/new-badge-1.svg";
import SvgNewBadge2 from "@/assets/badges/new-badge-2.svg";
import SvgNewBadge3 from "@/assets/badges/new-badge-3.svg";
import SvgNewBadge4 from "@/assets/badges/new-badge-4.svg";

import SvgCircle from "@/assets/icons/circle.svg";
import SvgInfo from "@/assets/icons/info.svg";
import SvgMissionCardSample from "@/assets/images/mission-card-sample.svg";
import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";
import Toast from "@/common/Toast";
import {ArchwayLeapClient} from "@/common/ArchwayLeapClient";
import CosmostationWalletClient from "@/common/CosmostationWalletClient";
import LeaderboardPeriod from "@/common/api/archway/LeaderboardPeriod";

let roleClaimed = ref(false);
let calculationDialog = ref(false);
let newBadgeDialog = ref(false);
let badgeShowcaseDialog: Ref<number | null> = ref(null);
let mintBadgeLoading = ref(false);
let page = ref(1);
let perPage = ref(15);
let leaderboard: Ref<ArchwayLeaderboardResponse> = ref(
  new ArchwayLeaderboardResponse()
);
const leaderboardPeriod: Ref<LeaderboardPeriod> = ref(
  LeaderboardPeriod.ALL_TIME
);
const leaderboardTab: Ref<string> = ref(LeaderboardPeriod.ALL_TIME.toString());

const BADGE_XP: number[] = [1000, 2000, 5000, 10000];

watch(leaderboardPeriod, () => {
  page.value = 1;
  getLeaderboard();
});

const shareProgressLink: ComputedRef<string> = computed((): string => {
  const referral: string = store.getters["UserModule/refLink"];
  let message: string;

  if (leaderboard.value.myLeaderboardSpot) {
    message = `Just hit Rank ${leaderboard.value.myLeaderboardSpot.position.rank} with ${leaderboard.value.myLeaderboardSpot.position.score} XP on Archway community missions! Join me and let’s climb the ranks together! ${referral}`;
  } else {
    message = `Just started ranking on Archway community missions! Join me and let’s climb the ranks together! ${referral}`;
  }
  const plainLink: string = `https://twitter.com/intent/tweet?text=${message}`;

  return encodeURI(plainLink);
});

async function getLeaderboard() {
  let pagination: PaginationRequest = new PaginationRequest(
    page.value,
    perPage.value,
    leaderboardPeriod.value
  );
  leaderboard.value = await store.dispatch(
    "ArchwayHttpModule/getLeaderboard",
    pagination
  );
  newBadgeDialog.value = leaderboard.value.myLeaderboardSpot?.newBadgePopup || false;
}

async function newBadgeAcknowledge() {
  if (leaderboard.value.myLeaderboardSpot && leaderboard.value.myLeaderboardSpot.newBadgePopup) {
    await store.dispatch("ArchwayHttpModule/badgeAcknowledge");
    leaderboard.value.myLeaderboardSpot.newBadgePopup = false;
  }

  newBadgeDialog.value = false;
}

async function newBadgeMint() {
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

  newBadgeDialog.value = false;
  mintBadgeLoading.value = true;

  try {
    let mintFee = await client.getMintBadgeFee();

    await store.dispatch("ArchwayHttpModule/mintBadgeInit");

    await client.mintBadge(mintFee);

    Toast.make("Mint success!", "You have minted a new badge", "success", true, 3000);
  } catch (e: any) {
    if (e.toString().includes("Already Minted")) {
      Toast.make("Badge already claimed", "You have already claimed this badge", "warning", true, 5000);
    } else {
      Toast.make("Mint failure", e.toString(), "error", false, 0);
      mintBadgeLoading.value = false;
      return;
    }
  }

  if (leaderboard.value.myLeaderboardSpot) {
    leaderboard.value.myLeaderboardSpot.badgeClaimed = true;
  }

  mintBadgeLoading.value = false;

  await store.dispatch("ArchwayHttpModule/mintBadgeOk");
}

async function claimDiscordRole(){
  await store.dispatch("ArchwayHttpModule/claimDiscordRole");
  roleClaimed.value = true;
  Toast.make("Success!", "You claimed a new discord role!", "success", true, 3000);
}

const walletAddress: ComputedRef<string> = computed(
  () => store.state.UserModule?.activeWallet?.address || ""
);

function shortWallet(str: any) {
  if (typeof str !== "string" || str.length < 15) {
    return str;
  }
  return str.substring(0, 10) + "..." + str.substring(str.length - 2);
}

function currentPageChange(newVal: number) {
  page.value = newVal;
  getLeaderboard();
}

function perPageChange(newVal: number) {
  perPage.value = newVal;
  page.value = 1
  getLeaderboard();
}

function getClosestNextBadgeXp(currentXp: number | undefined) {
  if (currentXp == undefined || currentXp <= BADGE_XP[0]) {
    return BADGE_XP[0];
  }
  if (currentXp <= BADGE_XP[1]) {
    return BADGE_XP[1];
  }
  if (currentXp <= BADGE_XP[2]) {
    return BADGE_XP[2];
  }
  if (currentXp <= BADGE_XP[3]) {
    return BADGE_XP[3];
  }
}

function getXpPercentage(givenXp: number): number {
  let maxXp = BADGE_XP[BADGE_XP.length - 1];
  if (givenXp >= maxXp) {
    return 100;
  }
  return Math.floor(100 - (maxXp - givenXp) / 100);
}

function getBadgeForXp(givenXp: number){
  let currentXp: number = leaderboard.value.myLeaderboardSpot
    ? leaderboard.value.myLeaderboardSpot.position.score
    : 0;
  switch (givenXp) {
    case 1000:
      return currentXp >= givenXp ? SvgBadge1000 : SvgBadge1000Lock;
    case 2000:
      return currentXp >= givenXp ? SvgBadge2000 : SvgBadge2000Lock;
    case 5000:
      return currentXp >= givenXp ? SvgBadge5000 : SvgBadge5000Lock;
    case 10000:
      return currentXp >= givenXp ? SvgBadge10000 : SvgBadge10000Lock;
  }
}

function getNewBadgeImage(){
  let currentXp: number = leaderboard.value.myLeaderboardSpot
    ? leaderboard.value.myLeaderboardSpot.position.score
    : 0;

  return getBadgeImageForXp(currentXp);
}

function getBadgeImageForXp(givenXp: number){
  if (givenXp >= BADGE_XP[3]) {
    return SvgNewBadge4;
  }
  if (givenXp >= BADGE_XP[2]) {
    return SvgNewBadge3;
  }
  if (givenXp >= BADGE_XP[1]) {
    return SvgNewBadge2;
  }
  if (givenXp >= BADGE_XP[0]) {
    return SvgNewBadge1;
  }
  return SvgNewBadge1;
}

function badgeActive(givenXp: number): boolean {
  let currentXp: number = leaderboard.value.myLeaderboardSpot
    ? leaderboard.value.myLeaderboardSpot.position.score
    : 0;
  return currentXp >= givenXp;
}

function getAvatar(userWallet: string) {
  return renderDiscs({
    seed: userWallet,
    base: 0.06,
    size: 170,
    maxDiscs: 4,
    colorRange: 1,
  }).dataURL;
}

onMounted(async () => {
  await getLeaderboard();
});
</script>

<style lang="scss">
@use "@/design/vars.scss";

.limit-width.leaderboard {
  max-width: 1000px;
}

.leaderboard-table {
  display: grid;
  grid-template-columns: 1.5fr 6fr 1fr 3fr 6fr 3fr;
  row-gap: 1em;

  .el-avatar {
    width: 2em;
    height: 2em;
  }

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4em 0;

    &.first {
      border-bottom-left-radius: 1em;
      border-top-left-radius: 1em;
    }
    &.last {
      border-bottom-right-radius: 1em;
      border-top-right-radius: 1em;
    }
  }

  .leaderboard-header {
    font-weight: bold;
  }

  .leaderboard-element {
    background: #fff;
    box-shadow: 0px 4px 50px -21px rgba(0, 0, 0, 0.5);
  }
}

.el-dropdown-menu__item:not(.is-disabled) {
  font-size: 1.5em;
  font-weight: 700;
  &:focus,
  &:hover {
    color: vars.$archway-primary-orange;
  }
}

.el-dropdown-menu__item.is-disabled {
  font-size: 1.5em;
  font-weight: 700;
}

.calculation-dialog {
  background-color: vars.$archway-warm-grey;
  max-width: 18em;
}
</style>
