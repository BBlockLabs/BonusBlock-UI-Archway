<template>
  <PageWrapper class="fs-medium">
    <!--remove-on-prod-->
    <!--    <el-row class="my-large">-->
    <!--      <el-col>-->
    <!--        <box-wrapper type="primary" round>-->
    <!--          <el-row justify="center" class="mt-extra-large">-->
    <!--            <el-col :span="-1">-->
    <!--              <h1>Connect your wallets</h1>-->
    <!--            </el-col>-->
    <!--          </el-row>-->

    <!--          <el-row justify="center" class="mb-extra-large">-->
    <!--            <el-col :span="-1">-->
    <!--              <h1>*Decorative animation*</h1>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </box-wrapper>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--/remove-on-prod-->
    <template v-if="!selectedProduct">
      <el-row justify="space-between" class="is-align-middle">
        <el-col span="-1" class="explore-archway">
          <span style="">Explore </span>
          <span class="archway-orange">Archway</span>
        </el-col>
        <el-col span="-1" class="my-small">
          <el-row>
            <box-wrapper type="white" round class="my-small fs-medium p-large">
              <el-row style="text-align: center;">
                <el-col class="mx-medium" span="8">
                  <el-col class="bold mb-small">
                    {{store.state.archwayStats.products}}
                  </el-col>
                  <el-col class="archway-orange">
                    Products
                  </el-col>
                </el-col>

                <el-col class="mx-medium" span="8">
                  <el-col class="bold mb-small">
                    {{store.state.archwayStats.missions}}
                  </el-col>
                  <el-col class="archway-orange">
                    Missions
                  </el-col>
                </el-col>

                <el-col class="mx-medium" span="8">
                  <el-col class="bold mb-small">
                    {{store.state.archwayStats.contributors}}
                  </el-col>
                  <el-col class="archway-orange">
                    Contributors
                  </el-col>
                </el-col>
              </el-row>
            </box-wrapper>
          </el-row>
        </el-col>
      </el-row>
      <archway-info-card />

      <el-row>
        <h2>Products</h2>
      </el-row>
      <product-list @selected="productSelected"/>
    </template>

    <template v-else>
      123
    </template>

    <!--    <template #footer>
      <el-footer height="unset" class="px-large pb-medium">
        <box-wrapper class="p-medium t-info b-info">
          <el-row :gutter="14" class="flex-row">
            <el-col :span="-1" class="my-auto">
              <svg-info class="icon-normal"/>
            </el-col>
            <el-col :span="-1">
              <p class="my-extra-small">
                The signed request contains a one time use token that is used to
                verify if the add wallet request is sent from the same
                connection.
              </p>
              <p class="my-extra-small">
                The signed data is only used to verify the wallet owner is the
                one sending the request. It does not contain any personal or
                other private information.
              </p>
            </el-col>
          </el-row>
        </box-wrapper>
      </el-footer>
    </template>-->
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import ProductList from "@/components/ProductList.vue";
import { store } from "../store";
import type { Ref } from "vue";
import { ref } from "vue";
import ArchwayInfoCard from "@/components/ArchwayInfoCard.vue";

let selectedProduct: Ref<string> = ref("");

function productSelected(id: string) {
  console.log(id);
  selectedProduct.value = id;
}

store.dispatch("ArchwayHttpModule/getStats");
</script>

<style lang="scss">
svg.info-tooltip {
  width: 1em;
  height: 1em;
  top: 0.1em;
  position: relative;
}
</style>
