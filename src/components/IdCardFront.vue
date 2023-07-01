<template>
  <id-card>
    <el-row justify="center">
      <el-col :span="-1">
        <el-avatar :src="url" shape="square" :size="170" />
      </el-col>
    </el-row>

    <el-row justify="center">
      <el-col :span="-1">
        <h2 class="fs-large">
          {{ blocktopianId }}
        </h2>
      </el-col>
    </el-row>

    <el-row>
      <el-col class="fs-small" style="font-weight: 700">
        Connect your social profiles to join the quests!
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <box class="id-card-social fs-small px-base py-small">
          <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
            <el-col :span="-1" class="fs-base flex-noshrink">
              Connect Twitter
            </el-col>
            <el-col :span="-1" class="of-hidden">
              <SvgTwitter class="icon-base" />
            </el-col>
          </el-row>
        </box>
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <box class="id-card-social fs-small px-base py-small">
          <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
            <el-col :span="-1" class="fs-base flex-noshrink">
              Connect Telegram
            </el-col>
            <el-col :span="-1" class="of-hidden">
              <SvgTelegram class="icon-base" />
            </el-col>
          </el-row>
        </box>
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <box class="id-card-social fs-small px-base py-small">
          <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
            <el-col :span="-1" class="fs-base flex-noshrink">
              Connect Discord
            </el-col>
            <el-col :span="-1" class="of-hidden">
              <SvgDiscord class="icon-base" />
            </el-col>
          </el-row>
        </box>
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <box class="id-card-social fs-small px-base py-small">
          <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
            <el-col :span="-1" class="fs-base flex-noshrink">
              Connect Reddit
            </el-col>
            <el-col :span="-1" class="of-hidden">
              <SvgReddit class="icon-base" />
            </el-col>
          </el-row>
        </box>
      </el-col>
    </el-row>
  </id-card>
</template>

<script setup lang="ts">
import Box from "@/components/BoxWrapper.vue";
import IdCard from "@/components/IdCard.vue";
import type { ComputedRef } from "vue";
import { StoreType, useStore } from "@/store";
import { computed } from "vue";
import { renderDiscs } from "@whi/identicons";
import SvgTwitter from "@/assets/icons/twitter.svg";
import SvgTelegram from "@/assets/icons/telegram.svg";
import SvgDiscord from "@/assets/icons/discord.svg";
import SvgReddit from "@/assets/icons/reddit.svg";

const store: StoreType = useStore();

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

const blocktopianId: ComputedRef<string> = computed(
  () => store.state.UserModule?.user?.userId || "Username"
);

const data: ComputedRef<Map<string, string | number>> = computed(
  () =>
    new Map<string, string | number>([
      ["Wallet Address", store.state.UserModule?.activeWallet?.address || "-"],
      ["Number of Networks", store.state.UserModule?.wallets.length || "-"],
      [
        "Successful Invitations",
        store.state.UserModule?.user?.invitedCount || "0",
      ],
      [
        "Issue date",
        store.state.UserModule?.user?.createdOn.format("MMMM DD, YYYY") || "-",
      ],
    ])
);
</script>
