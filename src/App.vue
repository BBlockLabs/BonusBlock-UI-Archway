<template>
  <el-container
    v-loading="store.state.loading"
    class="main-container"
    :direction="$route.name === 'home' ? 'vertical' : 'horizontal'"
  >
    <RouterView />
  </el-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { useStore, StoreType } from "@/store";

const store: StoreType = useStore();
const router: Router = useRouter();
const route = useRoute();

onMounted(() => {
  // @ts-ignore
  document.getElementById("loader").style.display = "none";
});

async function checkLogin() {
  if (!store.getters["UserModule/loggedIn"]) {
    return;
  }

  store.commit("setLoading", true);

  await store.dispatch("UserModule/getStatus");

  if (store.getters["UserModule/loggedIn"]) {
    if (document.location.pathname === "/") {
      await router.push("/wallets");
    }
  } else if (route.path !== "/") {
    await router.push("/");
  }

  store.commit("setLoading", false);
}

checkLogin();
store.dispatch("getEnabledExtensions");
</script>

<style lang="scss" scoped>
.main-container {
  height: 100vh;
}
</style>
