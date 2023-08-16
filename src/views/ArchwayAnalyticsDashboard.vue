<template>
  <PageWrapper class="fs-slightly-larger">
    <el-row>
      <el-col>
        <el-form inline>
          <el-form-item label="dApp">
            <el-select v-model="productId" clearable>
              <el-option
                v-for="id in products.keys()"
                :key="id"
                :label="products.get(id)"
                :value="id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Period">
            <el-select v-model="dateFilterPeriod">
              <el-option label="Day" value="day" />
              <el-option label="Week" value="week" />
              <el-option label="Month" value="month" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row gutter="20">
      <el-col>
        <h1>Active Wallets, number and growth</h1>
      </el-col>

      <el-col :lg="activeWalletsFilter === null ? 24 : 12">
        <el-table :data="activityStatistics.activeWallets.tableData" fixed max-height="500" show-summary>
          <el-table-column prop="mission" label="Mission">
            <template #default="scope">
              <el-tooltip
                :content="missionAddresses.get(scope.row.mission)"
                placement="top"
              >
                <el-button
                  link
                  color="secondary"
                  @click="updateActiveWalletsFilter(scope.row.mission)"
                >
                  {{ missionNames.get(scope.row.mission) }}
                </el-button>
              </el-tooltip>
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
              {{ moment(scope.row.date).format("DD.MM.YYYY") }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row class="mt-medium">
      <el-col v-if="activityStatistics.missionCategories.length">
        <statistics-chart
          :series="activityStatistics.activeWallets.chartData"
          :options="
            Chart.getBarChartOptions({
              colors: ['#FF4D00', '#B63700'],
              xaxis: {
                categories: activityStatistics.missionCategories,
              },
            })
          "
        />
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <h1>Missions completed per wallet</h1>
      </el-col>
      <el-col>
        <el-table :data="activityStatistics.walletMission.tableData" fixed max-height="500" show-summary>
          <el-table-column prop="wallet" label="Wallet" />
          <el-table-column prop="mission" label="Mission">
            <template #default="scope">
              <el-tooltip
                :content="missionAddresses.get(scope.row.mission)"
                placement="top"
              >
                {{ missionNames.get(scope.row.mission) }}
              </el-tooltip>
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
        <el-table :data="activityStatistics.missionActivityRow.tableData" fixed max-height="500" show-summary>
          <el-table-column prop="mission" label="Mission">
            <template #default="scope">
              <el-tooltip
                :content="missionAddresses.get(scope.row.mission)"
                placement="top"
              >
                {{ missionNames.get(scope.row.mission) }}
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="count" sortable label="Times completed" />
          <el-table-column prop="increase" sortable label="Growth in period" />
        </el-table>
      </el-col>
    </el-row>

    <el-row class="mt-medium">
      <el-col v-if="activityStatistics.missionCategories.length">
        <statistics-chart
          :series="activityStatistics.missionActivityRow.chartData"
          :options="
            Chart.getBarChartOptions({
              colors: ['#FF4D00', '#B63700'],
              xaxis: {
                categories: activityStatistics.missionCategories,
              },
            })
          "
        />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :lg="12">
        <el-row>
          <el-col><h1>Total gas fee spent from the wallets</h1></el-col>

          <el-col>
            <el-table
              :data="activityStatistics.totalGasSpent.tableData"
              fixed
              :summary-method="gasSum"
              max-height="500"
              :default-sort="{ prop: 'gasSpent', order: 'descending' }"
              show-summary
            >
              <el-table-column prop="wallet" label="Wallet" />
              <el-table-column prop="gasSpent" sortable label="Gas spent">
                <template #default="scope">
                  {{ Formatter.bigIntToPrecision(scope.row.gasSpent, 18, 18) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>

<!--          commented out since its broken due to too many walles-->
<!--          <el-col v-if="activityStatistics.walletCategories.length">-->
<!--            <statistics-chart-->
<!--              :series="activityStatistics.totalGasSpent.chartData"-->
<!--              :options="-->
<!--                Chart.getBarChartOptions({-->
<!--                  xaxis: {-->
<!--                    categories: activityStatistics.walletCategories,-->
<!--                  },-->
<!--                })-->
<!--              "-->
<!--            />-->
<!--          </el-col>-->
        </el-row>
      </el-col>

      <el-col :lg="12">
        <el-row>
          <el-col><h1>Total interaction per wallet</h1></el-col>

          <el-col>
            <el-table
              :data="activityStatistics.totalInteractions.tableData"
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

<!--          commented out since its broken due to too many walles-->
<!--          <el-col v-if="activityStatistics.walletCategories.length">-->
<!--            <statistics-chart-->
<!--              :series="activityStatistics.totalInteractions.chartData"-->
<!--              :options="-->
<!--                Chart.getBarChartOptions({-->
<!--                  xaxis: {-->
<!--                    categories: activityStatistics.walletCategories,-->
<!--                  },-->
<!--                })-->
<!--              "-->
<!--            />-->
<!--          </el-col>-->
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
import moment, { Moment } from "moment";
import PageWrapper from "@/components/PageWrapper.vue";
import { Formatter } from "@/common/formatter";
import StatisticsChart from "@/components/StatisticsChart.vue";
import Chart from "@/common/Chart";

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

const missionAddresses: ComputedRef<Map<string, string>> = computed(() => {
  const response: Map<string, string> = new Map<string, string>();

  for (const mission of missions.value) {
    response.set(mission.id, mission.address);
  }

  return response;
});

const missionNames: ComputedRef<Map<string, string>> = computed(() => {
  const response: Map<string, string> = new Map<string, string>();

  for (const mission of missions.value) {
    response.set(mission.id, `${mission.product.name} - ${mission.action}`);
  }

  return response;
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

const activeWalletsTransactions: ComputedRef<StatisticsActivity[]> = computed(
  () =>
    missionActivities.value.filter(
      (activity) => activity.campaignActivityId === activeWalletsFilter.value
    )
);

type ActivityStatistics = {
  missionCategories: Array<string>;
  walletCategories: Array<string>;
  missionActivityRow: {
    tableData: Array<{ mission: string; count: number; increase: number }>;
    chartData: Array<{ name: string; data: Array<number> }>;
  };
  walletMission: {
    tableData: Array<{
      wallet: string;
      mission: string;
      count: number;
      increase: number;
    }>;
    chartData: Array<{ name: string; group: string; data: Array<number> }>;
  };
  activeWallets: {
    tableData: Array<{ mission: string; count: number; increase: number }>;
    chartData: Array<{ name: string; data: Array<number> }>;
  };
  totalGasSpent: {
    tableData: Array<{ wallet: string; gasSpent: bigint }>;
    chartData: Array<{ name: string; data: Array<number> }>;
  };
  totalInteractions: {
    tableData: Array<{ wallet: string; interactions: number }>;
    chartData: Array<{ name: string; data: Array<bigint> }>;
  };
};

const activityStatistics: ComputedRef<ActivityStatistics> = computed(() => {
  const dateFilter = getDateStart(dateFilterPeriod.value);

  const activityStatistics: ActivityStatistics = {
    missionCategories: [],
    walletCategories: [],
    missionActivityRow: {
      tableData: [],
      chartData: [
        {
          name: "Times completed before period",
          data: [],
        },
        {
          name: "Times completed in period",
          data: [],
        },
      ],
    },
    walletMission: {
      tableData: [],
    },
    activeWallets: {
      tableData: [],
      chartData: [
        {
          name: "Wallets before period",
          data: [],
        },
        {
          name: "New wallets in period",
          data: [],
        },
      ],
    },
    totalGasSpent: {
      tableData: [],
      chartData: [{ name: "Gas", data: [] }],
    },
    totalInteractions: {
      tableData: [],
      chartData: [{ name: "Count", data: [] }],
    },
  };

  const missionData: Map<
    string,
    {
      activities: [number, number];
      wallets: Map<string, [number, number]>;
      activeWallets: Map<string, Moment>;
    }
  > = new Map();

  const walletData: Map<
    string,
    {
      gas: bigint,
      interactions: number,
    }
  > = new Map();

  for (const activity of missionActivities.value) {
    const dateBefore: boolean = moment(activity.date).isBefore(dateFilter);

    const mission = missionData.get(activity.campaignActivityId);

    if (mission === undefined) {
      missionData.set(activity.campaignActivityId, {
        activities: [1, dateBefore ? 0 : 1],
        wallets: new Map([[activity.wallet, [1, dateBefore ? 0 : 1]]]),
        activeWallets: new Map([[activity.wallet, moment(activity.date)]]),
      });
    } else {
      mission.activities[0]++;
      mission.activities[1] += (dateBefore ? 0 : 1);

      const wallet = mission.wallets.get(activity.wallet);

      if (wallet === undefined) {
        mission.wallets.set(activity.wallet, [1, dateBefore ? 0 : 1]);
      } else {
        wallet[0]++;
        wallet[1] += (dateBefore ? 0 : 1);
      }

      const activeWallet = mission.activeWallets.get(activity.wallet);

      if (activeWallet === undefined) {
        mission.activeWallets.set(activity.wallet, moment(activity.date));
      } else {
        mission.activeWallets.set(
          activity.wallet,
          moment.min(activeWallet, moment(activity.date))
        );
      }
    }

    const wallet = walletData.get(activity.wallet);
    const gas = activity.gas ? BigInt(activity.gas) : 0n;

    if (wallet === undefined) {
      walletData.set(activity.wallet, {gas: gas, interactions: 1})
    } else {
      wallet.gas += gas;
      wallet.interactions ++;
    }
  }

  for (const entry of missionData.entries()) {
    activityStatistics.missionActivityRow.tableData.push({
      mission: entry[0],
      count: entry[1].activities[0],
      increase: entry[1].activities[1],
    });

    activityStatistics.missionActivityRow.chartData[0].data.push(entry[1].activities[0] - entry[1].activities[1]);
    activityStatistics.missionActivityRow.chartData[1].data.push(entry[1].activities[1]);

    for (const wallet of entry[1].wallets.entries()) {
      activityStatistics.walletMission.tableData.push({
        mission: entry[0],
        wallet: wallet[0],
        count: wallet[1][0],
        increase: wallet[1][1],
      });
    }

    const walletIncrease = [...entry[1].activeWallets.values()].filter((date) => date.isSameOrAfter(dateFilter)).length;

    activityStatistics.activeWallets.tableData.push({
      mission: entry[0],
      count: entry[1].activeWallets.size,
      increase: walletIncrease,
    });

    activityStatistics.activeWallets.chartData[0].data.push(entry[1].activeWallets.size - walletIncrease);
    activityStatistics.activeWallets.chartData[1].data.push(walletIncrease);

    activityStatistics.missionCategories.push(
      missionNames.value.get(entry[0]) || entry[0]
    );
  }

  for (const entry of walletData.entries()) {
    activityStatistics.walletCategories.push(entry[0]);

    activityStatistics.totalInteractions.tableData.push({ wallet: entry[0], interactions: entry[1].interactions });
    // activityStatistics.totalInteractions.chartData[0].data.push(entry[1].interactions);

    if (entry[1].gas > 0n) {
      activityStatistics.totalGasSpent.tableData.push({ wallet: entry[0], gasSpent: entry[1].gas });
      // activityStatistics.totalGasSpent.chartData[0].data.push(entry[1].gas);
    }
  }

  return activityStatistics;
});

function gasSum(param: any): [string, string] {
  let sum: bigint = 0n;

  for (const item of param.data) {
    sum += item.gasSpent || 0n;
  }

  return ["Sum", Formatter.bigIntToPrecision(sum, 18, 18)];
}

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
  missions.value = response.payload.campaignActivities.filter(
    (mission) => mission.network.network == "ARCHWAY_TRIOMPHE"
  );
}

loadData();
</script>
