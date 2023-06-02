<template>
  <el-drawer
    :model-value="store.state.infoPanelOpen"
    direction="ltr"
    size="25.2857142857em"
    :append-to-body="true"
    modal-class="hidden-md-and-up"
    class="hidden-md-and-up page-wrapper-drawer"
    @closed="infoPanelClosed"
  >
    <template #header>
      <el-row justify="center">
        <el-col :span="-1">
          <h1 class="fs-extra-large m-0">Welcome</h1>
        </el-col>
      </el-row>
    </template>

    <template #default>
      <el-row justify="center" class="mb-base">
        <el-col>
          <id-card-front v-if="!props.cardBack" />
          <id-card-back v-else />
        </el-col>
      </el-row>

      <el-row justify="center" class="mt-auto">
        <el-col>
          <twitter-box />
        </el-col>
      </el-row>
    </template>

    <template #footer>
      <footer-component />
    </template>
  </el-drawer>

  <el-aside
    width="25.2857142857em"
    class="hidden-sm-and-down br-solid b-info"
  >
    <el-container class="h-100" direction="vertical">
      <el-main class="d-flex flex-column gap-base">
        <el-row justify="center" class="mb-base">
          <el-col>
            <id-card-front v-if="!props.cardBack" />
            <id-card-back v-else />
          </el-col>
        </el-row>

        <el-row justify="center" class="mt-auto">
          <el-col>
            <twitter-box />
          </el-col>
        </el-row>
      </el-main>

      <footer-component />
    </el-container>
  </el-aside>

  <el-container>
    <el-header class="p-0">
      <navigation-bar />
    </el-header>

    <el-main :class="noPadding ? 'px-0 pt-0' : 'px-large pt-small'">
      <div id="page-wrapper" :class="fullWidth ? '' : 'limit-width'" :style="fullHeight ? 'height: 100%' : ''" v-bind="$attrs">
        <slot />
      </div>
    </el-main>

    <slot name="footer" />
  </el-container>
</template>

<script setup lang="ts">
import FooterComponent from "@/components/PageFooter.vue";
import IdCardBack from "@/components/IdCardBack.vue";
import IdCardFront from "@/components/IdCardFront.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import TwitterBox from "@/components/TwitterBox.vue";
import { StoreType, useStore } from "@/store";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  cardBack?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const props: Props = withDefaults(defineProps<Props>(), {
  cardBack: false,
  fullHeight: false,
});

function infoPanelClosed(): void {
  store.commit("closeInfoPanel");
}

const store: StoreType = useStore();
</script>

<style lang="scss">
.page-wrapper-drawer {
  .el-drawer__header {
    margin-bottom: 2rem;
  }

  .el-drawer__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0;
    padding-bottom: 1rem;
  }

  .el-footer {
    height: auto;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.limit-width {
  max-width: 1600px;
  margin: auto;
  box-sizing: content-box;
}
</style>
