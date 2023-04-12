<template>
  <PageWrapper>
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
    <el-row>
      <h2>
        Connect your wallet
        <el-tooltip
          class="box-item"
          effect="dark"
          content="The signed request contains a one time use token that is used to verify if the add wallet request is sent from the same connection. <br />The signed data is only used to verify the wallet owner is the one sending the request. It does not contain any personal or other private information."
          raw-content
          placement="bottom-start"
        >
          <svg-info class="info-tooltip" style="" />
        </el-tooltip>
      </h2>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" class="my-small">
        <wallet-box-keplr/>
      </el-col>

      <el-col :span="12" class="my-small">
        <wallet-box-metamask/>
      </el-col>
    </el-row>

    <el-row>
      <h2>Announcements</h2>
    </el-row>
    <el-row
      :gutter="10"
      class="announcements-row"
    >
      <announcements />
    </el-row>
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
import WalletBoxKeplr from "@/components/WalletBoxKeplr.vue";
import WalletBoxMetamask from "@/components/WalletBoxMetamask.vue";
import SvgInfo from "@/assets/icons/info.svg?component";
import Announcements from "@/components/Announcements.vue";
</script>

<style lang="scss">
svg.info-tooltip {
  width: 1em;
  height: 1em;
  top: 0.1em;
  position: relative;
}
</style>
