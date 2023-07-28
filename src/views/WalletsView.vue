<template>
  <PageWrapper class="fs-slightly-larger">
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

    <el-row justify="space-between" class="is-align-middle">
      <el-col :span="-1" class="explore-archway">
        <span style="">Explore </span>
        <span class="archway-orange">Archway</span>
      </el-col>
      <el-col :span="-1" class="my-small">
        <el-row>
          <box-wrapper type="white" round class="p-medium">
            <el-row gutter="10" style="text-align: center;">
              <el-col :span="-1">
                <el-col class="bold mb-small">
                  {{ store.state.archwayStats.products }}
                </el-col>
                <el-col class="archway-orange"> Products </el-col>
              </el-col>

              <el-col :span="-1">
                <el-col class="bold mb-small">
                  {{ store.state.archwayStats.missions }}
                </el-col>
                <el-col class="archway-orange"> Missions </el-col>
              </el-col>
            </el-row>
          </box-wrapper>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <box-wrapper type="white" round class="w-100 my-small px-large">
        <el-row align="middle">
          <el-col class="mr-auto" :span="-1">
            <h2>Total Reward Pool</h2>
          </el-col>
          <el-col :span="-1">
            <SvgArch class="mr-small" style="height: 2em" />
          </el-col>
          <el-col :span="-1">
            <h2>{{ store.state.archwayStats.totalRewardPoolAmount ? getHumanAmount(store.state.archwayStats.totalRewardPoolAmount) : "N/A" }} ARCH</h2>
          </el-col>
        </el-row>
      </box-wrapper>
    </el-row>

    <el-row>
      <h2>Ecosystem dApps</h2>
    </el-row>
    <product-list class="mb-extra-large"/>

    <archway-info-card/>

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

  <el-dialog
    v-model="usageConsentVisible"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="width: 40%; min-width: 500px"
  >
    <div style="padding-left: .5em;font-size:2em">Welcome to Archway // BonusBlock</div>
    <div style="padding: 0 1em 0 1em;overflow-y: auto;max-height:300px" id="terms-text">
      <p>
        BonusBlock’s ARCH tokens rewards are not intended for access and/or use by users in the United States of America and in certain other Excluded Jurisdictions (as defined
        below);
        Accordingly, users from Excluded Jurisdictions should not access or attempt to gain access to this campaign.
      </p>
      <p>
        ARCH TOKENS ARE NOT INTENDED FOR U.S. PERSONS (AS SUCH TERM IS DEFINED IN RULE 902 OF REGULATION S AS PROMULGATED BY THE U.S. SECURITIES AND EXCHANGE COMMISSION) AND
        HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED, AND MAY NOT BE OFFERED OR SOLD IN THE UNITED STATES OR TO U.S. PERSONS UNLESS THEY ARE REGISTERED
        UNDER
        SUCH ACT, OR AN EXEMPTION FROM THE REGISTRATION REQUIREMENTS OF SUCH ACT IS AVAILABLE.
      </p>
      <b>EXCLUDED JURISDICTIONS</b>
      <br>
      Users from the following countries are restricted from accessing this Site:
      <ul>
        <li>United States of America (including its territories)</li>
        <li>Democratic People’s Republic of Korea</li>
        <li>Democratic Republic of Congo</li>
        <li>Cuba</li>
        <li>Dontesk People’s Republic of Ukraine</li>
        <li>Iran</li>
        <li>Iraq</li>
        <li>Luhansk People’s Republic of Ukraine</li>
        <li>Crimea Region of Ukraine</li>
        <li>People’s Republic of China</li>
        <li>Syrian Arab Republic</li>
      </ul>
    </div>
    <div style="display: flex;flex-wrap: nowrap;justify-content: start;padding:1em;margin-top:1em">
      <el-button :disabled="termsOkDisabled" class="archway" style="height:3em;color:white;" @click="confirmUsage()">I agree to the Terms</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import BoxWrapper from "@/components/BoxWrapper.vue";
import ProductList from "@/components/ProductList.vue";
import {store} from "../store";
import ArchwayInfoCard from "@/components/ArchwayInfoCard.vue";
import {onMounted, ref} from "vue";
import moment from "moment/moment";
import SvgArch from "@/assets/currencies/arch.svg";

const usageConsentVisible = ref(false);
const termsOkDisabled = ref(true);

onMounted(() => {
  let consent = localStorage.getItem("usage-consent");
  if (consent == null || moment(consent).add(1, "month").isBefore(new Date())) {
    localStorage.removeItem("usage-consent");
    usageConsentVisible.value = true;
  }
  let checkIfScrolled = setInterval(() => {
    let element = document.getElementById('terms-text');
    if (element == null) {
      clearInterval(checkIfScrolled);
      return;
    }
    if(Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1){
      termsOkDisabled.value = false;
      clearInterval(checkIfScrolled);
    }
  }, 100);
});

function getHumanAmount(amount: string) {
  let decimal = 12;
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
}

function confirmUsage() {
  localStorage.setItem("usage-consent", new Date().toISOString());
  usageConsentVisible.value = false;
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
