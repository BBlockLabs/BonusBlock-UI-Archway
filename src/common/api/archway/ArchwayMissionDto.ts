export default class ArchwayMissionDto {
  id: string = "";
  title: string = "";
  description: string = "";
  image: string = "";
  socials: Array<{ type: string; link: string; title?: string }> | null = [];
  completionCount: number = 0;
}
