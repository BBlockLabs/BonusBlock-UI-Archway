<template>
  <template
    v-for="announcement in announcements"
    :key="announcement.title"
  >
    <el-col
      :span="12"
      :xl="24/3"
      :xs="24"
      class="announcement-card"
    >
      <el-card shadow="never">
        <img
          :src="announcement.bannerImg"
          class="image"
          :alt="announcement.title"
        >
        <el-row
          justify="center"
          align="top"
        >
          <el-col
            :span="24"
            class="p-medium"
          >
            <h4 class="m-0">
              {{ announcement.title }}
            </h4>
            <span v-html="announcement.content" />
            <el-row class="pt-medium">
              <el-col :span="18">
                <social-links
                  :twitter="announcement.twitterLink"
                  :discord="announcement.discordLink"
                  :youtube="announcement.youtubeLink"
                  :telegram="announcement.telegramLink"
                  :reddit="announcement.redditLink"
                />
              </el-col>
              <el-col :span="6" class="align-right">
                <el-link target="_blank" :href="announcement.mainLink" :underline="false">
                  <el-button v-if="announcement.mainLink" type="primary">Visit</el-button>
                </el-link>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </template>
</template>
<script setup lang="ts">
import SocialLinks from "@/components/SocialLinks.vue";
import {onMounted, ref} from "vue";
import AnnouncementsDto from "@/common/api/dto/AnnouncementsDto";
import {StoreType, useStore} from "@/store";

const store: StoreType = useStore();

let announcements = ref(Array<AnnouncementsDto>());

onMounted(async () => {
  try {
    const response: Array<AnnouncementsDto> = await store.dispatch("HttpModule/getAnnouncementsList");
    announcements.value = response;
  } catch (e) {
    console.error(e);
  }


});
</script>
<style lang="scss">
.announcement-card {
  margin-bottom: 1em;
  max-width: 32em;

  .el-card__body {
    padding: 0;

    .image {
      width: 100%;
      height: 20%;
      object-fit: cover;
      aspect-ratio: 16/9;
    }

    .el-row {
      width: 100%;
    }

    .align-right {
      text-align: right;
    }
  }
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
