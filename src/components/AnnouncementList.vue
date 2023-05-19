<template>
  <div v-infinite-scroll="loadAnnouncements">
    <div v-if="loading" class="el-loading-spinner static-spinner mb-small text-muted-more">
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
      </svg>
    </div>
    <div v-else-if="announcements.length < 1">No announcements yet</div>
    <div v-else class="campaign-container mb-base">
      <div
        v-for="announcement in announcements"
        :key="announcement.id"
        class="project-card"
      >
        <div
          class="card-image"
          :class="announcement.image ? '' : 'random-cube'"
          :style="{
            backgroundImage:
              'url(' +
              (announcement.image ?? randomCube(announcement.id)) +
              ')',
            backgroundColor: randomBackgroundColor(announcement.id),
          }"
        ></div>
        <div class="card-content">
          <h3 class="fs-large my-base">{{ announcement.title }}</h3>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="announcement.description" />
          <div class="d-flex mt-large mb-base">
            <template v-for="social in announcement.socials" :key="social.type">
              <el-link
                :href="social.link || social.url"
                target="_blank"
                :underline="false"
                class="mr-small mt-small fs-extra-small"
              >
                <SvgTwitter v-if="social.type === 'twitter'" />
                <SvgTelegram v-else-if="social.type === 'telegram'" />
                <SvgYoutube v-else-if="social.type === 'youtube'" />
                <SvgDiscord v-else-if="social.type === 'discord'" />
                <SvgReddit v-else-if="social.type === 'reddit'" />
              </el-link>
            </template>
            <el-link
              v-if="announcement.mainLink"
              class="ml-auto"
              target="_blank"
              :href="announcement.mainLink"
              :underline="false"
            >
              <el-button type="primary">{{ announcement.mainLinkTitle }}</el-button>
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SvgTwitter from "@/assets/icons/twitter.svg?component";
import SvgTelegram from "@/assets/icons/telegram.svg?component";
import SvgReddit from "@/assets/icons/reddit.svg?component";
import SvgDiscord from "@/assets/icons/discord.svg?component";
import SvgYoutube from "@/assets/icons/youtube.svg?component";
import RawCubeLeft from "@/assets/icons/cube-left.svg?raw";
import RawCubeRight from "@/assets/icons/cube-right.svg?raw";
import RawCubeTop from "@/assets/icons/cube-top.svg?raw";
import { ref } from "vue";

export default {
  components: {
    SvgTwitter,
    SvgTelegram,
    SvgReddit,
    SvgDiscord,
    SvgYoutube,
  },
  props: {
    topThree: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      announcements: ref([]),
    };
  },
  data() {
    return {
      page: 1,
      loading: false,
      stop: false,
    };
  },
  mounted() {
    if (this.topThree) {
      // load announcements
      this.loading = true;
      this.$store
        .dispatch("HttpModule/getAnnouncementsList", {
          page: 1,
          perPage: 3,
          sort: "HIGHEST_POOL",
          activeCampaignsOnly: true,
        })
        .then((newAnnouncements) => {
          this.announcements.length = 0;
          if (newAnnouncements) {
            for (let newAnnouncement of newAnnouncements) {
              this.announcements.push(newAnnouncement);
            }
          }
          this.loading = false;
        });
    }
  },
  methods: {
    loadAnnouncements: async function () {
      if (this.topThree) {
        return;
      }
      if (this.loading || this.stop) {
        return;
      }

      this.loading = true;
      const newAnnouncements = await this.$store.dispatch(
        "HttpModule/getAnnouncementsList",
        { page: this.page, perPage: 12 }
      );

      this.announcements = this.announcements.concat(newAnnouncements);
      this.page++;

      if (newAnnouncements.length < 12) {
        this.stop = true;
      }

      this.loading = false;
    },
    numberFromSeed(seed, max) {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
      }
      return Math.abs(hash >> 7) % (max + 1);
    },
    randomCube(seed) {
      const cubes = [RawCubeLeft, RawCubeRight, RawCubeTop];
      const cube = cubes[this.numberFromSeed(seed, cubes.length - 1)];
      return "data:image/svg+xml;base64," + btoa(cube);
    },
    randomBackgroundColor(seed) {
      const colors = [
        "#ffeac3",
        "#d4e68c",
        "#b3dbd5",
        "#c3d0ff",
        "#efbeff",
        "#ffb4b4",
      ];
      return colors[this.numberFromSeed(seed, colors.length - 1)];
    },
  },
};
</script>
