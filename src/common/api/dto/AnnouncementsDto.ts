export default class AnnouncementsDto {
  id: string = "";
  title: string = "";
  description: string = "";
  image: string = "";
  imageType: string = "";
  socials: Array<{ type: string; link: string; title?: string }> | null = [];
  createdOn: string = "";
  // deprecated
  bannerImg: string = "";
  content: string = "";
  mainLink: string = "";
  mainLinkTitle: string = "";
  twitterLink: string = "";
  telegramLink: string = "";
  youtubeLink: string = "";
  redditLink: string = "";
  discordLink: string = "";
}
