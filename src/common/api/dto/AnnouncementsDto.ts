export default class AnnouncementsDto {
  id: string = "";
  title: string = "";
  description: string = "";
  image: string = "";
  imageType: string = "";
  socials: Array<{ type: string; link: string; title: string }> | null = [];
  mainLink: string = "";
  mainLinkTitle: string = "";
  createdOn: string = "";
}
