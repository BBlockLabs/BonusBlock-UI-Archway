export default class ChartDataDto {
  interactions: { [id: string]: number } = {};
  from: string = "";
  to: string = "";
  truncateTo: string = "";
}
