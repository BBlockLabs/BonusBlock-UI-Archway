<template>
  <PageWrapper class="fs-slightly-larger">
    <el-row>
      <el-col>
        <el-select v-model="productId" clearable>
          <el-option
            v-for="id in products.keys()"
            :key="id"
            :label="products.get(id)"
            :value="id"
          />
        </el-select>

        <el-select v-model="dateFilterPeriod">
          <el-option label="Day" value="day" />
          <el-option label="Week" value="week" />
          <el-option label="Month" value="month" />
        </el-select>
      </el-col>
    </el-row>

    <el-row gutter="20">
      <el-col>
        <h1>Active Wallets, number and growth</h1>
      </el-col>

      <el-col :lg="activeWalletsFilter === null ? 24 : 12">
        <el-table :data="activeWallets" fixed max-height="500" show-summary>
          <el-table-column prop="mission" label="Mission">
            <template #default="scope">
              <el-button link color="secondary" @click="updateActiveWalletsFilter(scope.row.mission)">
                {{ missionNames.get(scope.row.mission) }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="count" sortable label="Active wallets" />
          <el-table-column prop="increase" sortable label="Growth in period" />
        </el-table>
      </el-col>

      <el-col v-if="activeWalletsFilter" :lg="12" >
        <el-table :data="activeWalletsTransactions" fixed max-height="500">
          <el-table-column prop="hash" label="Hash" />
          <el-table-column prop="wallet" label="Wallet" />
          <el-table-column prop="date" label="Date">
            <template #default="scope">
              {{ moment(scope.row.date).format('DD.MM.YYYY') }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <h1>Missions completed</h1>
      </el-col>
      <el-col>
        <el-table :data="walletMissions" fixed max-height="500" show-summary>
          <el-table-column prop="wallet" label="Wallet" />
          <el-table-column prop="mission" label="Mission">
            <template #default="scope">
              {{ missionNames.get(scope.row.mission) }}
            </template>
          </el-table-column>
          <el-table-column prop="count" sortable label="Times completed" />
          <el-table-column prop="increase" sortable label="Growth in period" />
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <h1>Mission activity</h1>
      </el-col>
      <el-col>
        <el-table :data="missionActivity" fixed max-height="500" show-summary>
          <el-table-column prop="mission" label="Mission">
            <template #default="scope">
              {{ missionNames.get(scope.row.mission) }}
            </template>
          </el-table-column>
          <el-table-column prop="count" sortable label="Times completed" />
          <el-table-column prop="increase" sortable label="Growth in period" />
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :lg="12">
        <el-row>
          <el-col><h1>Total gas fee spent from the wallets</h1></el-col>

          <el-col>
            <el-table
              :data="totalGasSpent"
              fixed
              max-height="500"
              :default-sort="{ prop: 'gasSpent', order: 'descending' }"
              show-summary
            >
              <el-table-column prop="wallet" label="Wallet" />
              <el-table-column
                prop="gasSpent"
                sortable
                label="Gas spent"
              />
            </el-table>
          </el-col>
        </el-row>
      </el-col>

      <el-col :lg="12">
        <el-row>
          <el-col><h1>Total interaction per wallet</h1></el-col>

          <el-col>
            <el-table
              :data="totalInteractions"
              fixed
              max-height="500"
              :default-sort="{ prop: 'interactions', order: 'descending' }"
              show-summary
            >
              <el-table-column prop="wallet" label="Wallet" />
              <el-table-column
                prop="interactions"
                sortable
                label="Imteraction count"
              />
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </PageWrapper>
</template>

<script setup lang="ts">
import { StoreType, useStore } from "@/store";
const store: StoreType = useStore();
import { computed, ref } from "vue";
import HttpResponse from "@/common/api/HttpResponse";
import type StatisticsActivity from "@/common/api/archway/StatisticsActivity";
import type {
  ArchwayStatisticsResponsePayloadDto,
  CampaignActivities,
} from "@/common/api/archway/ArchwayStatisticsResponsePayloadDto";
import type { ComputedRef, Ref } from "vue";
import type { Computed } from "vuex";
import moment, { Moment } from "moment";

type TimeUnit = "month" | "week" | "day";

const activities: Ref<StatisticsActivity[]> = ref([]);
const missions: Ref<CampaignActivities[]> = ref([]);
const productId: Ref<string | null> = ref(null);

const dateFilterPeriod: Ref<TimeUnit> = ref("day");

const activeWalletsFilter: Ref<string | null> = ref(null);

function getDateStart(type: TimeUnit): Moment {
  const date: Moment = moment().startOf("day");

  switch (type) {
    case "day":
      return date;
    case "week":
      return date.subtract(1, "week");
    case "month":
      return date.subtract(1, "month");
  }

  return date;
}

function updateActiveWalletsFilter(filter: string) {
  if (activeWalletsFilter.value === filter) {
    activeWalletsFilter.value = null;
  } else {
    activeWalletsFilter.value = filter;
  }
}

const missionNames: ComputedRef<Map<string, string>> = computed(() => {
  const response: Map<string, string> = new Map<string, string>();

  for (const mission of missions.value) {
   response.set(mission.id, `${mission.product.name} - ${mission.address} ${mission.action}`)
  }

  return response;
})

const walletsAddresses: ComputedRef<Set<string>> = computed(() => {
  const wallets: Set<string> = new Set();

  for (const activity of activities.value) {
    if (!wallets.has(activity.campaignActivityId)) {
      wallets.add(activity.campaignActivityId);
    }
  }

  return wallets;
});

const products = computed(() => {
  const result: Map<string, string> = new Map<string, string>();

  for (const campaignActivity of missions.value) {
    if (result.has(campaignActivity.product.id)) {
      continue;
    }

    result.set(campaignActivity.product.id, campaignActivity.product.name);
  }

  return result;
});

const campaignMissionIds: ComputedRef<string[]> = computed(() => {
  return missions.value
    .filter(
      (campaignActivity) =>
        !productId.value || campaignActivity.product.id === productId.value
    )
    .map((campaignActivity) => campaignActivity.id);
});

const missionActivities: ComputedRef<StatisticsActivity[]> = computed(() => {
  return activities.value.filter((activity) =>
    campaignMissionIds.value.includes(activity.campaignActivityId)
  );
});

const activeWalletsTransactions: ComputedRef<StatisticsActivity[]> = computed(() => missionActivities.value.filter(activity => activity.campaignActivityId === activeWalletsFilter.value))

type MissionActivityRow = {mission: string, count: number, increase: number};
const missionActivity: ComputedRef<MissionActivityRow[]> = computed(() => {
  const dateFilter = getDateStart(dateFilterPeriod.value);

  const missionActivity: Map<string, [number, number]> = new Map<string, [number, number]>();

  for (const activity of missionActivities.value) {
    let mission = missionActivity.get(activity.campaignActivityId);
    let dateBefore = moment(activity.date).isBefore(dateFilter);

    if (mission === undefined) {
      missionActivity.set(activity.campaignActivityId, [1, dateBefore ? 0 : 1]);

      continue;
    }

    missionActivity.set(activity.campaignActivityId, [
      mission[0] + 1,
      mission[1] + (dateBefore ? 0 : 1),
    ]);
  }

  const response: MissionActivityRow[] = [];

  for (const entry of missionActivity.entries()) {
    response.push({
      mission: entry[0],
      count: entry[1][0],
      increase: entry[1][1],
    });
  }

  return response;
});

type WalletMissionRow = {wallet: string, mission: string, count: number, increase: number};
const walletMissions: ComputedRef<WalletMissionRow[]> = computed(() => {
  const dateFilter = getDateStart(dateFilterPeriod.value);

  const walletMissions: Map<string, Map<string, [number, number]>> = new Map<string, Map<string, [number, number]>>();

  for (const activity of missionActivities.value) {
    let mission = walletMissions.get(activity.campaignActivityId);
    let dateBefore = moment(activity.date).isBefore(dateFilter);

    if (mission === undefined) {
      walletMissions.set(activity.campaignActivityId, new Map<string, [number, number]>([[activity.wallet, [1, dateBefore ? 0 : 1]]]));

      continue;
    }

    let missionWallet = mission.get(activity.wallet);

    if (missionWallet === undefined) {
      mission.set(activity.wallet, [1, dateBefore ? 0 : 1]);

      continue;
    }

    mission.set(activity.wallet, [missionWallet[0] + 1,missionWallet[1] + (dateBefore ? 0 : 1)]);
  }

  const results:WalletMissionRow[] = [];

  for (const missionWallets of walletMissions.entries()) {
    for (const wallet of missionWallets[1]) {
      results.push({
        mission: missionWallets[0],
        wallet: wallet[0],
        count: wallet[1][0],
        increase: wallet[1][1],
      })
    }
  }

  return results;
})

type ActiveWalletsRow = { mission: string; count: number; increase: number };
const activeWallets: ComputedRef<ActiveWalletsRow[]> = computed(() => {
  const dateFilter = getDateStart(dateFilterPeriod.value);

  const missionActivity: Map<string, Map<string, Moment>> = new Map<string, Map<string, Moment>>();

  for (const activity of missionActivities.value) {
    let mission = missionActivity.get(activity.campaignActivityId);

    if (mission !== undefined) {
      const walletApearance = mission.get(activity.wallet);

      if (walletApearance === undefined) {
        mission.set(activity.wallet, moment(activity.date));
      } else {
        mission.set(
          activity.wallet,
          moment.min(walletApearance, moment(activity.date))
        );
      }

      missionActivity.set(activity.campaignActivityId, mission);
    } else {
      const map = new Map();

      map.set(activity.wallet, moment(activity.date));

      missionActivity.set(activity.campaignActivityId, map);
    }
  }

  const results: ActiveWalletsRow[] = [];

  for (const result of missionActivity.entries()) {
    results.push({
      mission: result[0],
      count: result[1].size,
      increase: [...result[1].values()].filter(date => date.isSameOrAfter(dateFilter)).length,
    });
  }

  return results;
});

type TotalGasSpentRow = {wallet: string, gasSpent: bigint};
const totalGasSpent: ComputedRef<TotalGasSpentRow[]> = computed(() => {
  const dateFilter = getDateStart(dateFilterPeriod.value);

  const activitiesInDate = missionActivities.value.filter((activity) =>
    moment(activity.date).isSameOrAfter(dateFilter)
  );

  const walletActivities: Map<string, bigint> = new Map<string, bigint>();

  for (const activity of activitiesInDate) {
    if (activity.gas === 0n || !activity.gas) {
      continue;
    }

    let gas: bigint | undefined = walletActivities.get(activity.wallet);

    if (gas === undefined) {
      walletActivities.set(activity.wallet, activity.gas);
    } else {
      walletActivities.set(activity.wallet, gas + activity.gas);
    }
  }

  const results: TotalGasSpentRow[] = [];

  for (const result of walletActivities.entries()) {
    results.push({ wallet: result[0], gasSpent: result[1] });
  }

  return results;
});

type TotalInteractionRow = { wallet: string; interactions: number };
const totalInteractions: ComputedRef<TotalInteractionRow[]> = computed(() => {
  const dateFilter = getDateStart(dateFilterPeriod.value);

  const activitiesInDate = missionActivities.value.filter((activity) =>
    moment(activity.date).isSameOrAfter(dateFilter)
  );

  const walletActivities: Map<string, number> = new Map<string, number>();

  for (const activity of activitiesInDate) {
    let count: number | undefined = walletActivities.get(activity.wallet);

    if (count === undefined) {
      walletActivities.set(activity.wallet, 1);
    } else {
      walletActivities.set(activity.wallet, count + 1);
    }
  }

  const results: TotalInteractionRow[] = [];

  for (const result of walletActivities.entries()) {
    results.push({ wallet: result[0], interactions: result[1] });
  }

  return results;
});

async function loadData(): Promise<void> {
  const response: HttpResponse<ArchwayStatisticsResponsePayloadDto> =
    await HttpResponse.fromResponse(
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/archway/statistics`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": store.state.UserModule?.token || "",
        },
      })
    );

  activities.value = response.payload.activity;
  missions.value = response.payload.campaignActivities;
}

loadData();
</script>
