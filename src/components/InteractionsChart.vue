<template>
  <div v-if="interactionsSeries[0].data.length > 0" class="chart-border mb-medium">
    <apexchart
      ref="interactionsChart"
      style="width: 100%"
      height="270px"
      type="bar"
      :options="interactionsOptions"
      :series="interactionsSeries"
    ></apexchart>
  </div>
  <div v-else-if="chartLoading" class="el-loading-spinner static-spinner mb-small">
    <svg class="circular" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
    </svg>
  </div>
  <div v-else class="fullscreen-empty-list text-muted-more" style="height: 18em">
    <svg-cube-top class="splash-image" />
    <b class="slightly-larger">No data yet</b>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import moment from "moment";
import { store } from "@/store";
import type ChartDataDto from "@/common/api/dto/ChartDataDto";
import SvgCubeTop from "@/assets/icons/cube-top.svg?component";

onMounted(() => {
  getChartData(moment().subtract(31, "days").unix(), null);
  window.addEventListener("resize", updateChartBarWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateChartBarWidth);
});

const interactionsChart = ref(null);
const chartLoading = ref(true);
const interactionsSeries = [
  {
    name: "Interactions",
    data: reactive([] as Array<number>),
  },
];
const interactionsOptions = {
  colors: ["#EDC16C"],
  stroke: {
    width: 1,
    colors: ["#000000"],
  },
  chart: {
    animations: {
      speed: 400,
    },
    toolbar: {
      show: true,
      tools: {
        download: false,
      },
    },
  },
  states: {
    active: {
      filter: {
        type: "none",
      },
    },
  },
  theme: {
    mode: "light",
  },
  title: {
    text: "Interactions",
    align: "left",
    style: {
      fontSize: "18px",
    },
  },
  subtitle: reactive({
    text: "",
    align: "right",
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: "13px",
      fontWeight: "normal",
      color: "#303133",
    },
  }),
  xaxis: {
    categories: reactive([] as Array<string>),
    labels: {
      hideOverlappingLabels: true,
      style: {
        fontWeight: 700,
      },
    },
    axisBorder: {
      color: "rgba(222, 227, 237, 0.4)",
      show: true,
    },
    axisTicks: {
      color: "rgba(222, 227, 237, 0.4)",
      show: true,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: ["#909399"],
        fontSize: "10px",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: 25 as string | number,
    },
  },
  grid: {
    strokeDashArray: 2,
    borderColor: "rgba(222, 227, 237, 0.7)",
  },
};

function getChartData(periodFrom: number, periodTo: number | null) {
  chartLoading.value = true;
  store.dispatch(
    "HttpModule/loadAnalytics",
    {
      from: periodFrom,
      to: periodTo,
    }
  ).then((result) => {
    updateChart(result);
    chartLoading.value = false;
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

function updateChart(chartData: ChartDataDto) {
  let keys = Object.keys(chartData.interactions).sort();

  interactionsSeries[0].data.length = 0;
  interactionsOptions.xaxis.categories.length = 0;

  let dateFormat = "";
  if (chartData.mode === "hour") {
    dateFormat = "HH:00";
  } else if (chartData.mode === "day") {
    dateFormat = "MMM DD";
  } else {
    dateFormat = "MMM YYYY";
  }

  for (let key of keys) {
    let date = moment(key).format(dateFormat);
    let interactionsPerDate = chartData.interactions[key];

    interactionsSeries[0].data.push(interactionsPerDate ?? 0);
    interactionsOptions.xaxis.categories.push(date);
  }

  updateChartBarWidth();

  if (chartData.interactionsToday !== null) {
    interactionsOptions.subtitle.text = "Today interactions: " + chartData.interactionsToday;
  } else {
    interactionsOptions.subtitle.text = "";
  }
}
</script>
