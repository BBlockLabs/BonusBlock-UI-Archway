<template>
  <el-row v-if="selectedProduct" class="fs-medium my-medium">
    <el-col class="mr-medium" span="-1">
      <SvgChevronLeft class="icon pointer" @click="$emit('deselected')" />
    </el-col>
    <el-col class="flex-grow" span="-1">
      <el-row>
        <box-wrapper
          type="white"
          round
          style="overflow: hidden"
          class="flex-grow"
        >
          <el-row>
            <!--            :style="{
            backgroundImage: 'url(' + selectedProduct.bannerUrl + ')',
            }"-->
            <el-col
              class="p-large product-banner"
              :span="18"
            >
              <el-row class="mt-extra-large mb-medium">
                <h1>{{ selectedProduct.title }}</h1>
              </el-row>
              <el-row>
                {{ selectedProduct.description }}
              </el-row>
            </el-col>
            <el-col class="p-large" :span="6">
              <el-row>
                <h2 class="mt-0">Details</h2>
              </el-row>
              <hr />

              <el-row align="middle">
                <el-col class="mr-small" span="-1">
                  <h3 class="mb-small">Tags</h3>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="-1">
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
                <el-col span="-1">
                  <h3 class="mb-small">Website</h3>
                </el-col>
                <el-col class="mb-small archway-orange">
                  <el-link
                    :href="getMainLink(selectedProduct.socials).link"
                    target="_blank"
                    :underline="false"
                    class="archway-orange fs-medium mr-small"
                  >{{ getMainLink(selectedProduct.socials).link }}</el-link
                  >
                </el-col>
              </el-row>
              <el-row align="middle">
                <el-col span="-1">
                  <h3 class="mb-0">Links</h3>
                </el-col>
              </el-row>
              <el-row>
                <el-col
                  v-for="social in selectedProduct.socials"
                  :key="social.type"
                  span="-1"
                >
                  <el-link
                    v-if="social.type !== 'main-link' && social.type !== 'main-label'"
                    :href="social.link || social.url"
                    target="_blank"
                    :underline="false"
                    class="archway-orange mr-small mt-small"
                  >
                    <social-icon :type="social.type" />
                  </el-link>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </box-wrapper>
        <el-row class="my-large w-100">
          <strong>Missions</strong>
        </el-row>
        <el-row v-if="selectedProduct.missions.length > 0" class="campaign-container mb-base">

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
            <div class="mission-card-content">
              <el-row class="mb-medium">
                <el-col>
                  <strong>{{ mission.title }}</strong>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  {{mission.description}}
                </el-col>
              </el-row>
              <el-row class="mt-medium" justify="space-between">
                <el-col span="-1">
                  <el-row class="h-100">
                    <el-col span="-1" v-for="social in mission.socials" :key="social.type">
                      <el-link
                        v-if="social.type !== 'main-link' && social.type !== 'main-label'"
                        :href="social.link || social.url"
                        target="_blank"
                        :underline="false"
                        class="mr-small fs-medium"
                      >
                        <social-icon :type="social.type" />
                      </el-link>
                    </el-col>
                  </el-row>
                </el-col>

                <el-col span="-1">
                  <el-link
                    class="ml-auto"
                    target="_blank"
                    :href="getMainLink(mission.socials).link"
                    :underline="false"
                  >
                    <el-button style="background-color: black; color: white" type="primary">{{ getMainLink(mission.socials).title }}</el-button>
                  </el-link>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgChevronLeft from "@/assets/icons/nav-arrow-left.svg?component";
import { store } from "@/store/index.ts";
import SocialIcon from "@/components/SocialIcon.vue";

export default {
  components: {
    SocialIcon,
    BoxWrapper,
    SvgChevronLeft,
  },
  props: {
    product: {
      type: String,
      default: "",
    },
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
      .dispatch("ArchwayHttpModule/getProduct", this.product, {})
      .then((product) => {
        this.selectedProduct = product;
      });
    console.log(this.selectedProduct);
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
