<template>
  <PageWrapper class="fs-slightly-larger w-100">
    <el-row justify="space-between" :gutter="24" class="w-100 my-extra-large referral-info">
      <el-col :md="16" :lg="17">
        <h3 class="fs-large mb-large">
          Stack your first rewards by onboarding more users!
        </h3>

        <b>Invitation Link</b>

        <copy-box class="mt-small mb-extra-large referral-link" :text="store.getters['UserModule/refLink']" />
        <p>
          <b>
            Once a new user signs-up and adds at least one wallet, it will be counted towards a bigger reward.
          </b>
        </p>
        <p>
          <b>
            You will receive 150XP if your 5 or more referrals finish at least one mission each.
          </b>
        </p>
      </el-col>

      <el-col :md="8" :lg="6">
        <!--remove-on-prod-->
        <!--        <el-space direction="vertical" fill size="large">-->
        <!--/remove-on-prod-->
        <invitation-count-card class="invitation-count" />

        <!--remove-on-prod-->
        <!--          <colored-card type="secondary" class='invitation-count'>-->
        <!--            <box-wrapper type="primary" class="fs-extra-large invitation-count">-->
        <!--              *Decorative animation*-->
        <!--            </box-wrapper>-->
        <!--          </colored-card>-->
        <!--        </el-space>-->
        <!--/remove-on-prod-->
      </el-col>
    </el-row>
    <div class="leaderboard-table">
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
          <div class="leaderboard-element fs-medium bold">
            <el-avatar
              :src="getAvatar(leaderboardItem.walletAddress)"
              class="mr-small"
            >
            </el-avatar>
            <span style="width: 16em">
              {{ leaderboardItem.walletAddress }}
              <span class="joined-text">has joined archway missions.</span>
            </span>
          </div>
          <div class="leaderboard-element">
</div>
          <div class="leaderboard-element fs-medium">
            {{ leaderboardItem.totalOnChain }}
          </div>
          <div class="leaderboard-element fs-medium">
            {{ leaderboardItem.topDapp }}
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
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
// import ColoredCard from "@/components/ColoredCard.vue";
import CopyBox from "@/components/CopyBox.vue";
// import BoxWrapper from "@/components/BoxWrapper.vue";
import InvitationCountCard from "@/components/InvitationCountCard.vue";
import { useStore, StoreType } from "@/store";

const store: StoreType = useStore();

import SvgChevronUp from "@/assets/icons/nav-arrow-up.svg?component";
import {store} from "@/store";
import PaginationRequest from "@/common/api/PaginationRequest";
import ArchwayLeaderboardResponse from "@/common/api/archway/ArchwayLeaderboardResponse";
import {computed, ComputedRef, onMounted, Ref, ref, watch} from "vue";
import {renderDiscs} from "@whi/identicons";
import LeaderboardPeriod from "@/common/api/archway/LeaderboardPeriod";
let page = ref(1);
let perPage = ref(15);
let leaderboard: Ref<ArchwayLeaderboardResponse> = ref(
  new ArchwayLeaderboardResponse()
);
const leaderboardPeriod: Ref<LeaderboardPeriod> = ref(
  LeaderboardPeriod.ALL_TIME
);

watch(leaderboardPeriod, () => getLeaderboard());

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


function currentPageChange(newVal: number) {
  page.value = newVal;
  getLeaderboard();
}

function perPageChange(newVal: number) {
  perPage.value = newVal;
  getLeaderboard();
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
  grid-template-columns: 1.5fr 6fr 1fr 3fr 3fr 3fr;
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










.referral-info{
  padding: 2em 4em 3em 4em;
  align-items: center;
  border-radius: 32px;
  background: var(--archway-white, #FFF);
  box-shadow: -8px 40px 70px -20px rgba(0, 0, 0, 0.20);
}
.referral-link {
  border-radius: 8px;
  border: none;
  background-color: #FF4D00 !important;
  color: white !important;
}
.referral-link>el-button .is-link{
  color:white !important;
}

.invitation-count{
  background-color: #f2efed;
  border-radius: 32px;
}

.joined-text{
  font-weight: 400;
}
</style>
