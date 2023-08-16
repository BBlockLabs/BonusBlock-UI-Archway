<template>
  <div class="chart-border mb-medium">
    <apex-chart
      ref="interactionsChart"
      style="width: 100%"
      height="270px"
      type="bar"
      stacked
      :series="propValues.series"
      :options="propValues.options"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import {Ref, ref} from "vue";
import Chart, { BarChartOptions } from "@/common/Chart";

export type DataSeries = {
  name: string;
  group?: string;
  data: Array<number>;
};

export interface Props {
  series: Array<DataSeries>;
  options: BarChartOptions;
}

const propValues: Props = withDefaults(defineProps<Props>(), {
  series: () => [],
  options: Chart.getBarChartOptions(),
});

const interactionsChart: Ref<ApexChart | null> = ref(null);
</script>
