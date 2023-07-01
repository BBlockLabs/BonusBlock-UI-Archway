<template>
  <div v-infinite-scroll="loadAnnouncements">
    <div v-if="products.length > 0" class="campaign-container mb-base">
      <div
        v-for="product in products"
        :key="product.id"
        class="project-card py-small px-medium"
        style="display: flex"
      >
        <el-row class="mb-medium is-align-middle">
          <el-col span="-1">
            <img
              v-if="product.icon"
              style="border-radius: 4px; aspect-ratio: 1; height: 5em"
              :src="product.icon"
              alt="Product"
            />
            <SvgProductLogoBlank v-else style="width: 5em; height: 5em" />
          </el-col>
          <el-col class="ml-small" span="-1">
            <el-row class="mb-small">
              <strong>{{ product.name }}</strong>
            </el-row>
            <el-row>
              <el-tag
                v-for="tag in product.tags"
                :key="tag"
                round
                class="mr-auto"
                type="info"
              >
                <strong>{{ tag }}</strong>
              </el-tag>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="mb-large">
          <el-col style="word-break: break-word; height: 3.5em">
            {{ product.shortDescription }}
          </el-col>
        </el-row>
        <el-row justify="center" align="middle" class="h-100">
          <el-card class="w-100 h-100 mission-preview">
            <el-row class="p-0 mb-medium" justify="center">
              <el-col
                style="
                  justify-content: center;
                  align-content: center;
                  aspect-ratio: 16/9;
                "
                class="d-flex"
              >
                <img
                  v-if="product.featuredMission && product.featuredMission.imageUrl"
                  style="border-radius: 4px; aspect-ratio: 16/9"
                  :src="product.featuredMission.imageUrl"
                  alt="Product"
                />
                <EmptyCube v-else class=""></EmptyCube>
              </el-col>
            </el-row>

            <template v-if="product.featuredMission">
              <el-row class="mb-medium">
                <strong>{{ product.featuredMission.title }}</strong>
              </el-row>
              <el-row style="word-break: break-word; height: 8.5em">
                {{ product.featuredMission.shortDescription }}
              </el-row>
            </template>
          </el-card>
        </el-row>
        <el-row justify="end" align="middle" class="mt-large mb-small">
          <el-col class="mr-medium is-align-center" span="-1">
            <el-button
              class="is-link"
              type="primary"
              @click="$emit('selected', product.id)"
              >View details</el-button
            >
          </el-col>
          <el-col
            v-if="
              product.featuredMission &&
              product.featuredMission.buttonText &&
              product.featuredMission.buttonUrl
            "
            class="is-align-center"
            span="-1"
          >
            <el-link
              class="ml-auto"
              target="_blank"
              :href="product.featuredMission.buttonUrl"
              :underline="false"
            >
              <el-button style="background-color: black; color: white" type="primary">{{ product.featuredMission.buttonText }}</el-button>
            </el-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import RawCubeLeft from "@/assets/icons/cube-left.svg?raw";
import RawCubeRight from "@/assets/icons/cube-right.svg?raw";
import RawCubeTop from "@/assets/icons/cube-top.svg?raw";
import EmptyCube from "@/assets/archway/empty-cube.svg";
import SvgProductLogoBlank from "@/assets/archway/product-logo-blank.svg";
import { ref } from "vue";
import { store } from "@/store";

export default {
  components: {
    SvgProductLogoBlank,
    EmptyCube,
  },
  props: {
    topThree: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selected"],
  setup() {
    return {
      products: ref([]),
    };
  },
  data() {
    return {
      page: 1,
      loading: false,
      stop: false,
    };
  },
  async mounted() {
    this.loading = true;
    store
      .dispatch("ArchwayHttpModule/getProductList", {})
      .then((newProducts) => {
        this.products.length = 0;
        if (newProducts) {
          for (let newProduct of newProducts) {
            this.products.push(newProduct);
          }
        }
      });
    console.log(this.products);
    this.loading = false;
  },
  methods: {
    loadAnnouncements: async function () {},
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
  },
};
</script>