<template>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    :default-active="active"
    class="hidden-sm-and-down"
    @select="onMenuAction"
  >
    <div class="flex-grow" />

    <el-menu-item index="/explore">Explore</el-menu-item>
    <el-menu-item index="/referral">Referral</el-menu-item>
    <el-menu-item index="/collect-rewards">Collect Rewards</el-menu-item>
    <el-menu-item index="/leaderboard">Leaderboard</el-menu-item>

    <div class="flex-grow" />

    <el-sub-menu index="menu" class="flex-noshrink">
      <template #title>
        <el-avatar :src="url" class="mr-small"> </el-avatar>
        <el-tooltip :content="walletAddress" placement="left">
          <span style="width: 10em" class="of-hidden">{{ walletAddress }}</span>
        </el-tooltip>
      </template>
      <el-menu-item index="logout">
        <svg-logout class="icon-base mr-small" />
        Logout
      </el-menu-item>
    </el-sub-menu>
  </el-menu>

  <el-menu
    v-model="active"
    mode="horizontal"
    :ellipsis="false"
    modal-class="hidden-md-and-up"
    class="hidden-md-and-up"
    :class="navClass"
    @select="onMenuAction"
  >
    <div class="flex-grow" />

    <el-sub-menu index="collapsed-menu" class="flex-noshrink">
      <template #title>
        <svg-dots class="icon-base" />
        &nbsp;
      </template>

      <el-menu-item index="info">Info</el-menu-item>
      <el-menu-item index="/explore">Wallets</el-menu-item>
      <el-menu-item index="/referral">Referral</el-menu-item>
      <el-menu-item index="/collect-rewards">Collect Rewards</el-menu-item>
      <el-sub-menu index="menu" class="flex-noshrink">
        <template #title>
          <el-avatar :src="url" class="mr-small"> </el-avatar>
          {{ walletAddress }}
        </template>
        <el-menu-item index="logout">
          <svg-logout class="icon-base mr-small" />
          Logout
        </el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import SvgLogout from "@/assets/icons/logout.svg?component";
import { ElMessageBox } from "element-plus";
import { Router, useRoute, useRouter } from "vue-router";
import { computed, ComputedRef, Ref, ref } from "vue";
import { useStore, StoreType } from "@/store";
import { renderDiscs } from "@whi/identicons";
import SvgDots from "@/assets/icons/dots.svg?component";

export interface Props {
  class?: string;
}

const props: Props = defineProps<Props>();
const router: Router = useRouter();
const route = useRoute();
const store: StoreType = useStore();
const active: Ref<string> = ref(route.path);

const walletAddress: ComputedRef<string> = computed(
  () => store.state.UserModule?.activeWallet?.address || ""
);
const navClass: ComputedRef<string> = computed(() => props.class || "");

const url = computed(() => {
  const result = renderDiscs({
    seed: store.state.UserModule?.user?.userId || "-",
    base: 0.11,
    size: 170,
    maxDiscs: 4,
    colorRange: 1,
  });

  return result.dataURL;
});

function onMenuAction(index: string): void {
  if (index === "logout") {
    active.value = route.path;
    logout();

    return;
  }

  if (index === "menu" || index === "collapsed-menu") {
    active.value = route.path;

    return;
  }

  if (index === "info") {
    store.commit("toggleInfoPanel");
    active.value = route.path;

    return;
  }

  router.push(index);
}

async function logout(): Promise<void> {
  try {
    await ElMessageBox.confirm("Are you sure you want to logout?", "Logout", {
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    });
  } catch (e: any) {
    return;
  }

  await store.dispatch("UserModule/logout");
  await router.push("/");
}
</script>
