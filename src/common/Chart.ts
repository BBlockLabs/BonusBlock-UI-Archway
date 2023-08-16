import { reactive } from "vue";

export type Options = any;
export type BarChartOptions = Options & any;

export default class Chart {
  public static colors: string[] = ["#FF4D00"];

  private static defaultChartOptions = {
    colors: Chart.colors,
    chart: {
      animations: {
        speed: 400,
        dynamicAnimation: {
          enabled: false,
        },
      },
      toolbar: {
        show: false,
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
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 2,
      borderColor: "rgba(222, 227, 237, 0.7)",
    },
  };

  static defaultBarChartOptions = Chart.merge(Chart.defaultChartOptions, {
    chart: {
      stacked: true,
    },
    xaxis: {
      categories: reactive([""] as Array<string>),
      labels: {
        hideOverlappingLabels: true,
        rotate: -45,
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
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: 25 as string | number,
      },
    },
  });

  public static getOptions(options: any | null = null): Options {
    return options === null
      ? Chart.defaultChartOptions
      : Chart.merge(Chart.defaultChartOptions, options);
  }

  public static getBarChartOptions(
    options: any | null = null
  ): BarChartOptions {
    return options === null
      ? Chart.defaultBarChartOptions
      : Chart.merge(Chart.defaultBarChartOptions, options);
  }

  private static merge(obj1: any, obj2:  any): any {
    const result: any = {};

    for (const key of [...Object.keys(obj1), ...Object.keys(obj2)]) {
      if (obj1[key] === undefined || obj2[key] === undefined) {
        result[key] = obj1[key] || obj2[key];

        continue;
      }

      if (
        obj1[key] !== null
        && obj2[key] !== null
        && obj1[key] instanceof Object
        && obj2[key] instanceof Object
        && !(obj1[key] instanceof Array)
        && !(obj2[key] instanceof Array)
      ) {
        result[key] = Chart.merge(obj1[key], obj2[key]);

        continue;
      }

      result[key] = obj2[key];
    }

    return result;
  };
};
