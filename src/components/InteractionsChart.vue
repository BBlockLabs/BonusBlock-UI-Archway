<template>
  <div class="chart-border mb-medium">
    <el-row align="middle" justify="space-between">
      <el-tabs v-model="interactionsRange">
        <el-tab-pane label="Year" name="year"></el-tab-pane>
        <el-tab-pane label="Month" name="month"></el-tab-pane>
        <el-tab-pane label="Week" name="week"></el-tab-pane>
        <el-tab-pane label="Day" name="day"></el-tab-pane>
      </el-tabs>

      <el-row align="middle" class="chart-navigation">
        <svg-chevron-left
          class="prevent-select"
          :class="{ disabled: !hasPrevRange }"
          @click="jumpBy(1)"
        />
        <strong>{{ currentRangeName }}</strong>
        <svg-chevron-right
          class="prevent-select"
          :class="{ disabled: !hasNextRange }"
          @click="jumpBy(-1)"
        />
      </el-row>
    </el-row>

    <apexchart
      v-if="interactionsSeries[0].data.length > 0"
      ref="interactionsChart"
      v-loading="chartLoading[interactionsRange + chartOffset]"
      style="width: 100%"
      height="270px"
      type="bar"
      :options="interactionsOptions"
      :series="interactionsSeries"
    ></apexchart>
    <div v-else-if="chartLoading[interactionsRange + chartOffset] || props.parentLoading" class="el-loading-spinner static-spinner mb-small text-muted-more">
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
      </svg>
    </div>
    <div v-else class="fullscreen-empty-list text-muted-more" style="height: 18em">
      <svg-cube-top class="splash-image" />
      <b class="slightly-larger">No data for selected period yet</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import moment, { Moment, unitOfTime } from "moment";
import { store } from "@/store";
import type ChartDataDto from "@/common/api/dto/ChartDataDto";
import SvgCubeTop from "@/assets/icons/cube-top.svg?component";
import SvgChevronLeft from "@/assets/icons/nav-arrow-left.svg?component";
import SvgChevronRight from "@/assets/icons/nav-arrow-right.svg?component";
import Chart from "@/common/Chart";

interface Props {
  campaignId?: string;
  minDate?: Moment;
  maxDate?: Moment;
  parentLoading?: boolean;
}
const props: Props = defineProps<Props>();

const interactionsRange = ref("week");
const chartOffset = ref(0);
const interactionsChart = ref(null);
const chartLoading = reactive({} as { [key: string]: boolean });
let cache: { [key: string]: { time: Moment; data: ChartDataDto } } = {};

function tooltipXFormatter(label: string) {
  switch (interactionsRange.value) {
    case "day":
      return label + " - " + currentRangeStart.value.format("MMMM Do, YYYY");
    case "week":
      return label + " - " + currentRangeStart.value.format("MMMM, YYYY");
    case "month":
      return currentRangeStart.value.format("MMMM [" + nth(parseInt(label)) + "], YYYY");
  }
  return label;
}

function tooltipYFormatter(value: number) {
  return value.toFixed(0);
}

const interactionsSeries = [
  {
    name: "Interactions",
    data: reactive([0] as Array<number>),
  },
];
const interactionsOptions = Chart.getBarChartOptions({
  tooltip: {
    x: {
      formatter: tooltipXFormatter,
    },
    y: {
      formatter: tooltipYFormatter,
    },
  },
});

onMounted(() => {
  chartOffset.value = lowestOffset.value;
  fetchChartData();
  window.addEventListener("resize", updateChartBarWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateChartBarWidth);
});

watch(
  () => interactionsRange.value,
  (): void => {
    chartOffset.value = lowestOffset.value;
    fetchChartData();
  }
);

watch(
  () => chartOffset.value,
  (): void => {
    fetchChartData();
  }
);

watch(
  () => props.maxDate,
  (): void => {
    if (props.maxDate && currentRangeStart.value.isAfter(props.maxDate)) {
      const diff = currentRangeStart.value.diff(props.maxDate, interactionsRange.value as unitOfTime.Base, true);
      jumpBy(Math.ceil(diff));
    }
  }
);

watch(
  () => props.minDate,
  (): void => {
    if (props.minDate && currentRangeEnd.value.isBefore(props.minDate)) {
      const diff = currentRangeEnd.value.diff(props.minDate, interactionsRange.value as unitOfTime.Base, true);
      jumpBy(Math.floor(diff));
    }
  }
);

function nth(d: number) {
  if (d > 3 && d < 21) return d + "th";
  switch (d % 10) {
    case 1:
      return d + "st";
    case 2:
      return d + "nd";
    case 3:
      return d + "rd";
    default:
      return d + "th";
  }
}

function weekOfMonth(input: Moment) {
  const firstDayOfMonth = input.clone().startOf("month");
  const firstDayOfWeek = firstDayOfMonth.clone().startOf("week");
  const offset = firstDayOfMonth.diff(firstDayOfWeek, "days");
  return Math.ceil((input.date() + offset) / 7);
}

const lowestOffset = computed(() => {
  if (!props.maxDate) {
    return 0;
  }
  const diff = moment()
    .startOf(interactionsRange.value as unitOfTime.Base)
    .diff(props.maxDate, interactionsRange.value as unitOfTime.Base, true);
  return diff > 0 ? Math.ceil(diff) : 0;
});

const currentRangeStart = computed(() => {
  return moment()
    .subtract(chartOffset.value, interactionsRange.value as unitOfTime.Base)
    .startOf(interactionsRange.value as unitOfTime.Base);
});

const currentRangeEnd = computed(() => {
  return moment()
    .subtract(chartOffset.value, interactionsRange.value as unitOfTime.Base)
    .endOf(interactionsRange.value as unitOfTime.Base);
});

const currentRangeName = computed(() => {
  let rangeEnd = currentRangeStart.value;
  switch (interactionsRange.value) {
    case "day":
      return rangeEnd.format("MMMM Do");
    case "week":
      return nth(weekOfMonth(rangeEnd)) + " week of " + rangeEnd.format("MMMM");
    case "month":
      return rangeEnd.format("MMMM");
    case "year":
      return rangeEnd.format("YYYY");
  }
  return "";
});

const hasPrevRange = computed(() => {
  if (props.minDate && currentRangeStart.value.isBefore(props.minDate)) {
    return false;
  }
  let userJoinDate = store.state.UserModule?.user?.createdOn;
  if (userJoinDate && currentRangeStart.value.isBefore(userJoinDate)) {
    return false;
  }
  return true;
});

const hasNextRange = computed(() => {
  if (props.maxDate && currentRangeEnd.value.isAfter(props.maxDate)) {
    return false;
  }
  return chartOffset.value > 0;
});

function jumpBy(offset: number) {
  if (offset > 0 && !hasPrevRange.value) {
    return;
  }
  chartOffset.value = Math.max(lowestOffset.value, chartOffset.value + offset);
}

const truncateSettings: { [key: string]: string } = {
  day: "hours",
  week: "days",
  month: "days",
  year: "months",
};

function fetchChartData() {
  let queriedRange = interactionsRange.value;
  let queriedOffset = chartOffset.value;
  let query = {
    from: currentRangeStart.value.unix(),
    to: currentRangeEnd.value.unix(),
    truncateTo: truncateSettings[interactionsRange.value],
    timeZoneOffset: new Date().getTimezoneOffset() * -1,
    campaignIds: null as Array<string> | null,
  };
  if (props.campaignId) {
    query.campaignIds = [props.campaignId];
  }
  let cacheKey = query.from + "-" + query.to + "-" + query.truncateTo;
  if (cache[cacheKey]) {
    updateChart(cache[cacheKey].data);
    if (moment().diff(cache[cacheKey].time) < 1000 * 60 * 5) {
      return;
    }
  }
  if (chartLoading[queriedRange + queriedOffset]) {
    return;
  }
  chartLoading[queriedRange + queriedOffset] = true;
  store.dispatch(
    "HttpModule/loadAnalytics",
    query
  ).then((result) => {
    cache[cacheKey] = { time: moment(), data: result };
    if (interactionsRange.value === queriedRange && chartOffset.value === queriedOffset) {
      updateChart(result);
    }
    chartLoading[queriedRange + queriedOffset] = false;
  }).catch((e) => {
    console.error(e);
    if (interactionsRange.value === queriedRange && chartOffset.value === queriedOffset) {
      updateChart(null);
    }
    chartLoading[queriedRange + queriedOffset] = false;
  });
}

function updateChartBarWidth() {
  let wrapper = document.getElementById("page-wrapper");
  if (!wrapper) {
    return;
  }
  let graphWidth = wrapper.clientWidth - 80;
  let elementCount = interactionsSeries[0].data.length;
  if (elementCount < 1) {
    return;
  }
  let columnWidth = Math.min(20, (graphWidth / elementCount) * 0.6);
  interactionsOptions.plotOptions.bar.columnWidth = columnWidth;
  if (interactionsChart.value) {
    // @ts-ignore
    interactionsChart.value.updateOptions({
      plotOptions: {
        bar: {
          columnWidth: columnWidth,
        },
      },
    });
  }
}

function updateLabelRotationAngle(angle: number) {
  interactionsOptions.xaxis.labels.rotate = angle;
  if (interactionsChart.value) {
    // @ts-ignore
    interactionsChart.value.updateOptions({
      xaxis: {
        labels: {
          rotate: angle,
        },
      },
    });
  }
}

function updateChart(chartData: ChartDataDto | null) {
  interactionsSeries[0].data.length = 0;
  interactionsOptions.xaxis.categories.length = 0;

  if (!chartData) {
    return;
  }

  let from = moment(chartData.from);
  let to = moment(chartData.to);
  if (props.minDate && from.isBefore(props.minDate)) {
    from = moment(props.minDate);
  }
  if (props.maxDate && to.isAfter(props.maxDate)) {
    to = moment(props.maxDate);
  }

  let dateFormat = "";
  if (chartData.truncateTo === "hours") {
    dateFormat = "[\u00A0]HH:00[\u00A0]";
  } else if (chartData.truncateTo === "days") {
    dateFormat = to.diff(from, "days") > 8 ? "DD" : "dddd";
  } else {
    dateFormat = "MMM";
  }

  updateLabelRotationAngle((chartData.truncateTo === "hours" || dateFormat === "DD") ? -90 : -45);

  let samples: { [key: string]: number } = {};
  for (let key in chartData.interactions) {
    let formattedDate = moment(key).format(dateFormat);
    samples[formattedDate] = chartData.interactions[key] ?? 0;
  }

  let date = from.clone();
  while (date.diff(to) < 0) {
    let formattedDate = moment(date).format(dateFormat);
    interactionsSeries[0].data.push(samples[formattedDate] ?? 0);
    interactionsOptions.xaxis.categories.push(formattedDate);
    date.add(1, chartData.truncateTo as unitOfTime.Base);
  }

  updateChartBarWidth();
}
</script>
