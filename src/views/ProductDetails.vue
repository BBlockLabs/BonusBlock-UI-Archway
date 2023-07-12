<template>
  <PageWrapper>
    <el-row v-if="selectedProduct" class="flex-row fs-slightly-larger my-medium">
      <el-col class="mr-medium" :span="-1">
        <SvgChevronLeft
          class="icon pointer"
          @click="$router.push('/explore')"
        />
      </el-col>
      <el-col class="flex-grow" :span="-1">
        <el-row>
          <box-wrapper
            type="white"
            round
            style="overflow: hidden"
            class="flex-grow"
          >
            <el-row>
              <div
                class="p-large flex-grow flex-basis-0 product-banner"
                :style="{
                  backgroundImage: 'url(' + selectedProduct.bannerUrl + ')',
                }"
              ></div>
              <div class="p-large">
                <el-row>
                  <h2 class="mt-0">Details</h2>
                </el-row>
                <hr />

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
                <el-row>
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
            </el-row>
          </box-wrapper>
          <el-row class="fs-medium w-100">
            <h1>{{ selectedProduct.title }}</h1>
          </el-row>
          <el-row class="mb-extra-large fs-medium w-100">
            {{ selectedProduct.description }}
          </el-row>
          <el-row class="w-100">
            <h2>Missions</h2>
          </el-row>
          <el-row v-if="selectedProduct.missions.length > 0" class="products-container mb-base">
            <el-col
              v-for="mission in selectedProduct.missions"
              :key="mission.id"
              class="project-card"
              style="display: flex"
            >
              <el-row
                class="mission-image"
                :style="{
                  backgroundImage: 'url(' + mission.imageUrl + ')',
                }"
              ></el-row>
              <el-row class="flex-grow flex-column mission-card-content">
<!--                <el-row class="mb-medium">
                  <strong>{{ mission.title }}</strong>
                </el-row>-->
                <el-row class="mb-small">
                  {{ mission.description }}
                </el-row>

                <el-row class="mt-auto">
                  <el-col :span="-1" v-for="social in mission.socials" :key="social.type">
                    <el-link
                      v-if="social.type !== 'main-link' && social.type !== 'main-label'"
                      :href="social.link || social.url"
                      target="_blank"
                      :underline="false"
                      class="black-link mr-small"
                    >
                      <social-icon :type="social.type"/>
                    </el-link>
                  </el-col>

                  <el-col class="ml-auto" :span="-1">
                    <el-link
                      class=""
                      target="_blank"
                      :href="getMainLink(mission.socials).link"
                      :underline="false"
                    >
                      <el-button type="primary">{{ getMainLink(mission.socials).title }}</el-button>
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
import { store } from "@/store/index.ts";
import SocialIcon from "@/components/SocialIcon.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import SvgArch from "@/assets/currencies/arch.svg";

export default {
  components: {
    SvgArch,
    PageWrapper,
    SocialIcon,
    BoxWrapper,
    SvgChevronLeft,
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
