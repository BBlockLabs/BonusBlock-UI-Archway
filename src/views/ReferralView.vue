<template>
  <PageWrapper class="fs-slightly-larger w-100">
    <el-row justify="space-between" :gutter="24" class="w-100 mt-extra-large">
      <el-col :md="16" :lg="17">
        <h3 class="fs-slightly-larger mt-0">
          Stack your first rewards by onboarding more users!
        </h3>

        <b>Invitation Link</b>

        <copy-box class="mt-small" :text="store.getters['UserModule/refLink']" />

        <p>
          <b>
            NOTE: new wallets without any activity will not be considered as a
            new user.
          </b>
        </p>

        <div v-if="!$mq.lg" class="tc mt-large">
          <img :src="PngReferral" alt style="height: 80vh" />
        </div>
      </el-col>

      <el-col :md="8" :lg="7">
        <!--remove-on-prod-->
        <!--        <el-space direction="vertical" fill size="large">-->
        <!--/remove-on-prod-->
        <invitation-count-card />

        <!--remove-on-prod-->
        <!--          <colored-card type="primary">-->
        <!--            <box-wrapper type="primary" class="fs-extra-large">-->
        <!--              *Decorative animation*-->
        <!--            </box-wrapper>-->
        <!--          </colored-card>-->
        <!--        </el-space>-->
        <!--/remove-on-prod-->
      </el-col>

      <div v-if="$mq.lg" class="tc mx-auto mt-large">
        <img :src="PngReferral" alt style="height: 50vh" />
      </div>
    </el-row>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
// import ColoredCard from "@/components/ColoredCard.vue";
import CopyBox from "@/components/CopyBox.vue";
// import BoxWrapper from "@/components/BoxWrapper.vue";
import InvitationCountCard from "@/components/InvitationCountCard.vue";
import PngReferral from "@/assets/images/referral-illustration.png";
import { useStore, StoreType } from "@/store";

const store: StoreType = useStore();
</script>
