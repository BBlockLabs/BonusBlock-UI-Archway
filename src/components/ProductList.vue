<template>
  <div v-infinite-scroll="loadAnnouncements">
    <div v-if="products.length > 0" class="campaign-container mb-base">
      <div
        v-for="product in products"
        :key="product.id"
        class="project-card py-medium"
        style="display: flex"
      >
        <el-row class="mb-medium px-medium is-align-middle">
          <el-col :span="-1">
            <img
              v-if="product.icon"
              style="border-radius: 4px; aspect-ratio: 1; height: 5em"
              :src="product.icon"
              alt="Product"
            />
            <SvgProductLogoBlank v-else style="width: 5em; height: 5em" />
          </el-col>
          <el-col class="ml-small" :span="-1">
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
        <el-row class="px-medium mb-large">
          <el-col style="word-break: break-word; height: 3.5em">
            <span v-html="product.shortDescription"></span>
          </el-col>
        </el-row>
        <el-row justify="center" align="middle" class="px-medium h-100">
          <el-card class="w-100 h-100 mission-preview">
            <el-row class="p-0 mb-medium" justify="center">
              <el-col
                style="
                  justify-content: center;
                  align-content: center;
                  aspect-ratio: 1.7;
                "
                class="d-flex"
              >
                <img
                  v-if="product.featuredMission && product.featuredMission.imageUrl"
                  style="border-radius: 4px; aspect-ratio: 1.7"
                  :src="product.featuredMission.imageUrl"
                  alt="Product"
                />
                <EmptyCube v-else class=""></EmptyCube>
              </el-col>
            </el-row>

            <template v-if="product.featuredMission">
<!--              <el-row class="mb-medium">
                <strong>{{ product.featuredMission.title }}</strong>
              </el-row>-->
              <el-row class="h-auto" style="word-break: break-word">
                <span v-html="product.featuredMission.shortDescription"></span>
              </el-row>
            </template>
          </el-card>
        </el-row>
        <el-row class="px-medium mt-large">
          <el-col :span="12">
            <el-row class="fs-small mb-small">
              Total XP
            </el-row>
            <el-row class="bold">
              {{ product.totalXpPoints }} XP
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="fs-small mb-small">
              Missions
            </el-row>
            <el-row class="bold">
              {{ product.missionCount }}
            </el-row>
          </el-col>
        </el-row>
        <hr class="w-100 mt-medium"/>
        <el-row align="middle" class="mt-small">
          <el-col class="mx-auto is-align-center" :span="-1">
            <el-button
              class="is-link"
              type="primary"
              @click="$router.push('/product/' + product.id)"
              >View details</el-button
            >
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
import SvgArch from "@/assets/currencies/arch.svg?component";
import SvgProductLogoBlank from "@/assets/archway/product-logo-blank.svg";
import { ref } from "vue";
import { store } from "@/store/index.ts";

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
