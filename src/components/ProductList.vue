<template>
  <div v-infinite-scroll="loadAnnouncements">
    <div v-if="products.length > 0" class="campaign-container mb-base">
      <div
        v-for="product in products"
        :key="product.id"
        class="project-card p-medium"
        style="display: flex"
      >
        <el-row class="mb-medium is-align-middle">
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
                  aspect-ratio: 1.36/1
                "
                class="d-flex"
              >
                <img
                  v-if="product.featuredMission && product.featuredMission.imageUrl"
                  style="border-radius: 4px; aspect-ratio: 1.36/1"
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
                {{ product.featuredMission.shortDescription }}
              </el-row>
            </template>
          </el-card>
        </el-row>
        <el-row align="middle" class="mt-large mb-small">
          <el-col >
            <el-col>
              <span class="fs-extra-small">Reward pool</span>
            </el-col>
            <el-row align="middle">
              <SvgArch class="mr-small" style="height: 1.5em" />
              <strong>{{ product.rewardPoolSize ? getHumanAmount(product.rewardPoolSize) : "N/A" }} ARCH</strong>
            </el-row>
          </el-col>
          <el-col class="mr-medium ml-auto is-align-center" :span="-1">
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
    SvgArch,
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
    getHumanAmount(amount) {
      let decimal = 8;
      let integerPart =
        amount.length > decimal
          ? amount.substring(0, amount.length - decimal)
          : "0";
      let fractionalPart =
        amount.length > decimal
          ? amount.substring(amount.length - decimal)
          : amount;
      if (fractionalPart !== "0") {
        while (fractionalPart.length < decimal) {
          fractionalPart = "0" + fractionalPart;
        }
      }
      fractionalPart = fractionalPart.replace(/0+$/, "");
      return fractionalPart === ""
        ? integerPart
        : integerPart + "." + fractionalPart;
    },
  },
};
</script>
