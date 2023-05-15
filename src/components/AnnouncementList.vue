<template>
  <el-row v-infinite-scroll="loadAnnouncements" :gutter="10" class="w-100">
    <el-col
      v-for="announcement in announcements"
      :key="announcement.title"
      ref="announcementBox"
      :span="12"
      :xl="24 / 3"
      :xs="24"
      class="announcement-card"
    >
      <el-card shadow="never">
        <img
          v-if="announcement.image"
          :src="announcement.image"
          class="image"
          :alt="announcement.title"
        />

        <div class="announcement-text pr-medium pl-medium pt-small">
          <h3 class="m-0 pb-small">
            {{ announcement.title }}
          </h3>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="announcement.description" />
        </div>
        <el-row class="socials pr-medium pl-medium">
          <el-col :span="18">
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
          </el-col>
          <el-col :span="6" class="align-right">
            <el-link
              target="_blank"
              :href="announcement.mainLink"
              :underline="false"
            >
              <el-button v-if="announcement.mainLink" type="primary">
                {{ announcement.mainLinkTitle }}
              </el-button>
            </el-link>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row v-loading="loading"></el-row>
</template>
<script>
import SvgTwitter from "@/assets/icons/twitter.svg?component";
import SvgTelegram from "@/assets/icons/telegram.svg?component";
import SvgReddit from "@/assets/icons/reddit.svg?component";
import SvgDiscord from "@/assets/icons/discord.svg?component";
import SvgYoutube from "@/assets/icons/youtube.svg?component";
import { ref } from "vue";

export default {
  components: {
    SvgTwitter,
    SvgTelegram,
    SvgReddit,
    SvgDiscord,
    SvgYoutube,
  },
  setup() {
    return {
      announcements: ref([]),
      announcementBox: ref(null),
    };
  },
  data() {
    return {
      page: 1,
      loading: false,
      stop: false,
    };
  },
  methods: {
    loadAnnouncements: async function () {
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

      this.$nextTick(() => {
        let maxH = 0;
        for (const elem in this.announcementBox) {
          maxH = Math.max(
            maxH,
            this.announcementBox[elem].$el.querySelector(".announcement-text")
              .clientHeight
          );
        }
        for (const elem in this.announcementBox) {
          this.announcementBox[elem].$el.querySelector(
            ".announcement-text"
          ).style.height = maxH + "px";
        }
      });

      if (newAnnouncements.length < 12) {
        this.stop = true;
      }

      this.loading = false;
    },
  },
};
</script>
<style lang="scss">
.announcement-card {
  margin-bottom: 1em;
  max-width: 32em;

  .el-card {
    height: 100%;
  }

  .el-card__body {
    padding: 0;

    .image {
      width: 100%;
      height: 45%;
      object-fit: cover;
      aspect-ratio: 16/9;
    }

    .el-row {
      width: 100%;
      &.socials {
        height: 4em;
      }
    }

    .align-right {
      text-align: right;
    }
  }
}

.announcements-row {
  flex-direction: column;
}

@media only screen and (max-width: 700px) {
  .announcements-row {
    justify-content: center;

    .announcement-card {
      max-width: initial;
    }
  }
}
</style>
