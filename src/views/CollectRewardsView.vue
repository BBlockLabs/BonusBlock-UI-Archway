<template>
  <!--  <PageWrapper>-->
  <!--    <div class="h-100 d-flex flex-column">-->
  <!--      <el-row justify="center">-->
  <!--        <el-col :span="-1">-->
  <!--          <h1 class="fs-large">Calculation Results</h1>-->
  <!--        </el-col>-->
  <!--      </el-row>-->

  <!--      <el-row v-if="calculationResults" justify="center">-->
  <!--        <el-col :span="-1">-->
  <!--          <el-table :data="calculationResults" style="width: 100%">-->
  <!--            <el-table-column prop="network" label="Network" width="150" />-->
  <!--            <el-table-column prop="periodFrom" label="From" width="150" />-->
  <!--            <el-table-column prop="periodTill" label="Till" width="150" />-->
  <!--            <el-table-column prop="staking" label="Staking" width="100" />-->
  <!--            <el-table-column prop="frequency" label="Frequency" width="100" />-->
  <!--            <el-table-column prop="activity" label="Activity" width="100" />-->
  <!--            <el-table-column prop="rewardPoints" label="Reward Points" width="130" />-->
  <!--            <el-table-column prop="reward" label="Reward" width="100" />-->
  <!--          </el-table>-->
  <!--        </el-col>-->
  <!--      </el-row>-->

  <!--      <el-row justify="center" class="mt-medium mb-auto">-->
  <!--        <el-col :span="-1">-->
  <!--          <template v-if="bonusBlockWallet">-->
  <!--            {{ bonusBlockWallet.address }}-->
  <!--          </template>-->
  <!--          <template v-else>-->
  <!--            <el-button type="primary" @click="bonusBlockKeplrLogin">-->
  <!--              Connect BonusBlock wallet-->
  <!--            </el-button>-->
  <!--          </template>-->
  <!--        </el-col>-->
  <!--      </el-row>-->

  <!--      &lt;!&ndash;      <el-row justify="center">-->
  <!--        <el-col :span="-1">-->
  <!--          Check our social platforms to keep yourself informed.-->
  <!--        </el-col>-->
  <!--      </el-row>&ndash;&gt;-->

  <!--      &lt;!&ndash;      <el-row justify="center" class="mt-medium mb-auto">-->
  <!--        <el-col :span="-1">-->
  <!--          <social-links />-->
  <!--        </el-col>-->
  <!--      </el-row>&ndash;&gt;-->
  <!--    </div>-->
  <!--  </PageWrapper>-->
  <PageWrapper>
    <div class="h-100 d-flex flex-column">
      <el-row justify="center" class="mt-auto">
        <el-col :span="-1">
          <h1 class="fs-large">Under Development</h1>
        </el-col>
      </el-row>

      <el-row justify="center">
        <el-col :span="-1">
          This section is currently under development.
        </el-col>
      </el-row>

      <el-row justify="center">
        <el-col :span="-1">
          Check our social platforms to keep yourself informed.
        </el-col>
      </el-row>

      <el-row justify="center" class="mt-medium mb-auto">
        <el-col :span="-1">
          <social-links />
        </el-col>
      </el-row>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import { ref, onMounted } from "vue";
import { StoreType, useStore } from "@/store";
import FormattedError from "@/common/errors/FormattedError";
import { ElMessageBox } from "element-plus";
import HttpUnauthorizedError from "@/common/errors/HttpUnauthorizedError";
import { Router, useRouter } from "vue-router";
import type CalculationResultDto from "@/common/api/dto/CalculationResultDto";
import SocialLinks from "@/components/SocialLinks.vue";

const store: StoreType = useStore();
const router: Router = useRouter();

let calculationResults = ref(Array<CalculationResultDto>());
let bonusBlockWallet = ref(null);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function bonusBlockKeplrLogin(): Promise<void> {
  store.commit("setLoading", true);

  try {
    await store.dispatch("UserModule/keplrBonusBlockLogin");
    bonusBlockWallet.value = store.getters["UserModule/bonusBlockWallet"];
  } catch (error: any) {
    if (error instanceof FormattedError) {
      await ElMessageBox.alert(error.message, error.name, {});
    } else if (error instanceof HttpUnauthorizedError) {
      await store.dispatch("UserModule/removeSession");
      await router.push("/");
    } else {
      console.error(error);
      await ElMessageBox.alert(
        "There was an error connecting your wallet, please try again.",
        "Error",
        {
          center: true,
        }
      );
    }
  } finally {
    store.commit("setLoading", false);
  }
}

onMounted(async () => {
  try {
    const response: Array<CalculationResultDto> = await store.dispatch(
      "HttpModule/getCalculationResults"
    );
    calculationResults.value = response;
  } catch (e) {
    console.error(e);
  }

  bonusBlockWallet.value = store.getters["UserModule/bonusBlockWallet"];
});
</script>
