<template>
  <PageWrapper full-width class="m-0 fs-slightly-larger">
    <div class="limit-width leaderboard">
      <box-wrapper type="white" round class="p-large">
        <el-row align="middle" justify="space-between">
          <el-col class="fs-medium bold" :span="-1">
            <el-row class="flex-nowrap" align="middle">
              <el-avatar :src="getAvatar(walletAddress)" class="mr-small"/>
              <span class="m-auto">{{ walletAddress }}</span>
            </el-row>
          </el-col>
          <el-col class="pointer" :span="-1">
            <el-button class="mr-small is-link" type="primary"
              >Share progress on Twitter
              <svg-twitter class="ml-small icon-small" />
            </el-button>
          </el-col>
        </el-row>
        <el-row class="fs-medium mt-large" justify="space-between">
          <el-col :span="-1">
            <el-row> Your rank </el-row>
            <el-row class="fs-extra-large archway-orange"> #{{ 8 }} </el-row>
          </el-col>
          <el-col :span="-1">
            <el-row>
              <span> Your XP </span>
            </el-row>
            <el-row class="fs-extra-large">
              <span class="mx-auto">
                {{ 0 }}
              </span>
            </el-row>
          </el-col>
          <el-col :span="-1">
            <el-row> Your top dApp </el-row>
            <el-row class="fs-extra-large">
              {{ "PeerSwap" }}
            </el-row>
          </el-col>
        </el-row>
        <hr />

        <el-row class="mb-large">TODO</el-row>
        <el-row justify="space-between">
          <el-col :span="-1">
            <el-row>
              <strong class="fs-medium">Mint badge progress</strong>
            </el-row>
            <el-row class="archway-orange"> {{ 1234 }} / {{ 1234 }} XP </el-row>
          </el-col>

          <el-col :span="-1">
            <el-button class="mr-small is-link" type="primary"
              >Share badge</el-button
            >
            <el-button type="primary">Mint badge</el-button>
          </el-col>
        </el-row>
      </box-wrapper>

      <el-row align="middle" justify="space-between" class="mt-medium">
        <el-col :span="-1">
          <h2>Leaderboard</h2>
        </el-col>
        <el-col class="archway-orange pointer" :span="-1">
          How calculations work?</el-col
        >
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
            v-for="(leaderboardItem, index) in leaderboard.searchResults"
            :key="leaderboardItem.walletAddress"
          >
            <div class="leaderboard-element first">
              <strong class="fs-large bold archway-orange">
                {{ index + 1 + (perPage * page - perPage) }}
              </strong>
            </div>
            <div class="leaderboard-element fs-medium bold">
              <el-avatar
                :src="getAvatar(leaderboardItem.walletAddress)"
                class="mr-small"
              >
              </el-avatar>
              <el-tooltip :content="leaderboardItem.walletAddress" placement="top">
                <span style="width: 8em">
                  {{ shortWallet(leaderboardItem.walletAddress) }}
                </span>
              </el-tooltip>
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
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import SvgChevronUp from "@/assets/icons/nav-arrow-up.svg?component";
import { store } from "@/store";
import PaginationRequest from "@/common/api/PaginationRequest";
import ArchwayLeaderboardResponse from "@/common/api/archway/ArchwayLeaderboardResponse";
import BoxWrapper from "@/components/BoxWrapper.vue";
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import { renderDiscs } from "@whi/identicons";
import SvgTwitter from "@/assets/icons/twitter.svg";

let page = ref(1);
let perPage = ref(15);
let leaderboard: Ref<ArchwayLeaderboardResponse> = ref(
  new ArchwayLeaderboardResponse()
);

async function getLeaderboard() {
  let pagination: PaginationRequest = new PaginationRequest(
    page.value,
    perPage.value
  );
  leaderboard.value = await store.dispatch(
    "ArchwayHttpModule/getLeaderboard",
    pagination
  );
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

onMounted(() => {
  // @ts-ignore
  getLeaderboard();
});
</script>

<style lang="scss">
@use "@/design/vars.scss";

.limit-width.leaderboard {
  max-width: 850px;
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
</style>
