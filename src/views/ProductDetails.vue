<template>
  <PageWrapper>
    <el-row class="w-auto archway-orange my-medium" :span="-1">
      <el-col class="d-flex flex-center-y pointer" span="-1" @click="$router.push('/explore')">
        <SvgChevronLeft class="icon" />
        <span>All products</span>
      </el-col>
    </el-row>

    <el-row v-if="selectedProduct" class="flex-row fs-slightly-larger my-medium">
      <el-col class="flex-grow" :span="-1">
        <el-row>
          <box-wrapper
            type="white"
            round
            style="overflow: hidden"
            class="flex-grow"
          >
            <el-row class="product-banner-card">
              <div
                class="p-large product-banner"
                :style="{
                  backgroundImage: 'url(' + selectedProduct.bannerUrl + ')',
                }"
              ></div>
              <div class="p-large product-description">
                <el-row>
                  <h2 class="mt-0 mb-extra-small">{{ selectedProduct.title }}</h2>
                </el-row>
                <hr />

                <el-row align="middle">
                  <el-col :span="-1">
                    <span v-html="selectedProduct.description"></span>
                  </el-col>
                </el-row>

                <template v-if="selectedProduct.tags">
                  <el-row align="middle">
                    <el-col class="mr-small" :span="-1">
                      <h3 class="mb-small">Tags</h3>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-tag
                        v-for="tag in selectedProduct.tags"
                        :key="tag"
                        size="large"
                        round
                        class="mr-auto fs-base"
                        type="info"
                      >
                        <strong>{{ tag }}</strong>
                      </el-tag>
                    </el-col>
                  </el-row>
                </template>

                <div class="mt-auto">
                  <el-row>
                    <el-col :span="-1">
                      <h3 class="mb-small">Website</h3>
                    </el-col>
                    <el-col class="mb-small archway-orange">
                      <el-link
                        :href="getMainLink(selectedProduct.socials).link"
                        target="_blank"
                        :underline="false"
                        class="orange-link fs-slightly-larger mr-small"
                      >{{ getMainLink(selectedProduct.socials).link }}</el-link
                      >
                    </el-col>
                  </el-row>
                  <el-row align="middle">
                    <el-col :span="-1">
                      <h3 class="mb-0">Join our community</h3>
                    </el-col>
                  </el-row>
                  <el-row class="mt-auto">
                    <el-col
                      v-for="social in selectedProduct.socials"
                      :key="social.type"
                      :span="-1"
                    >
                      <el-link
                        v-if="social.type !== 'main-link' && social.type !== 'main-label'"
                        :href="social.link || social.url"
                        target="_blank"
                        :underline="false"
                        class="orange-link mr-small mt-small"
                      >
                        <social-icon :type="social.type" />
                      </el-link>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-row>
          </box-wrapper>
          <el-row class="w-100">
            <h2>Missions</h2>
          </el-row>
          <el-row class="w-100">
            <box-wrapper
              type="white"
              style="border-radius: 1em;justify-content: center;align-items: center;"
              class="d-flex mb-small py-extra-small archway-orange w-100"
            >
              <svg-info class="mr-extra-small" style="width: 24px"/>
              <span>Missions can be repeatedly completed in order to earn Community XP. Token rewards can only be earned once per mission per week.</span>
            </box-wrapper>
          </el-row>
          <el-row v-if="selectedProduct.missions.length > 0" class="products-container mb-base">
            <el-col
              v-for="mission in selectedProduct.missions"
              :key="mission.id"
              class="project-card"
              style="display: flex"
            >
              <el-row
                v-if="mission.imageUrl"
                class="mission-image"
                :style="{
                  backgroundImage: 'url(' + mission.imageUrl + ')',
                }"
              ></el-row>
              <el-row class="flex-grow flex-column mission-card-content">
                <el-row justify="space-between" align="middle" class="mx-medium mb-medium">
                  <strong>{{ mission.title }}</strong>
                  <span v-if="mission.completionCount > 0" class="bold d-flex is-align-middle archway-orange fs-extra-small">
                    <SvgCheck style="margin-right: 2px;" class="icon-small" />
                    Completed</span>
                </el-row>
                <el-row class="mx-medium mb-medium">
                  <span v-html="mission.description"></span>
                </el-row>
                <hr class="w-100 mt-auto"/>
                <el-row align="middle" class="mx-medium mt-small">
                  <el-col :span="-1">
                    <el-row class="fs-small mb-small">
                      Community XP
                    </el-row>
                    <el-row class="bold">
                      {{ mission.xpPoints }} XP
                    </el-row>
                  </el-col>

                  <el-col class="ml-auto" :span="-1">
                    <el-link
                      class=""
                      target="_blank"
                      :href="getMainLink(mission.socials).link"
                      :underline="false"
                    >
                      <el-button class="archway-orange-button">{{ getMainLink(mission.socials).title }}</el-button>
                    </el-link>
                  </el-col>
                </el-row>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </PageWrapper>

</template>

<script>
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgChevronLeft from "@/assets/icons/nav-arrow-left.svg?component";
import SvgCheck from "@/assets/icons/check.svg?component"
import { store } from "@/store/index.ts";
import SocialIcon from "@/components/SocialIcon.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import SvgInfo from "@/assets/icons/info.svg";

export default {
  components: {
    SvgInfo,
    PageWrapper,
    SocialIcon,
    BoxWrapper,
    SvgChevronLeft,
    SvgCheck,
  },
  emits: ["deselected"],
  data() {
    return {
      selectedProduct: null,
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await store
      .dispatch("ArchwayHttpModule/getProduct", this.$route.params.id, {})
      .then((product) => {
        this.selectedProduct = product;
      });
    this.loading = false;
  },
  methods: {
    getMainLink(socials) {
      let mainLink = socials.find(
        (social) => social.type === "main" || social.type === "main-link"
      );
      if (mainLink) {
        return mainLink;
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
