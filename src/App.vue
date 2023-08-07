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
import { StoreType, useStore } from "@/store";
import HttpResponse from "@/common/api/HttpResponse";

const store: StoreType = useStore();
const router: Router = useRouter();
const route = useRoute();

onMounted(() => {
  // @ts-ignore
  document.getElementById("loader").style.display = "none";
});

async function checkArchXWallet() {
  if (typeof window.archx !== "undefined") {
    await window.archx.enable();
    const bonusBlockObj = await window.archx.bonusBlock();
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/archway/archx-ping`,
      {
        body: JSON.stringify(bonusBlockObj),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": store.state.UserModule?.token || "",
        },
        method: "POST",
      }
    );
    const responseData = await HttpResponse.fromResponse<null>(response);
  }
}

async function checkLogin() {
  if (!store.getters["UserModule/loggedIn"]) {
    return;
  }

  store.commit("setLoading", true);

  await store.dispatch("UserModule/getStatus");

  if (store.getters["UserModule/loggedIn"]) {
    if (document.location.pathname === "/") {
      await router.push("/explore");
    }
  } else if (route.path !== "/") {
    await router.push("/");
  }

  store.commit("setLoading", false);
}

checkArchXWallet();
checkLogin();

</script>

<style lang="scss" scoped>
.main-container {
  height: 100vh;
}
</style>
