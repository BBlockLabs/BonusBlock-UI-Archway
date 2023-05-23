export default class ChartDataDto {
    interactions: { [id: string]: number } = {};
    mode: string = "";
    interactionsToday: string | null = null;
}
