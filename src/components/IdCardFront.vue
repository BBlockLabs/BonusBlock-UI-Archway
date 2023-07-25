<template>
  <id-card class="id-card">
    <el-row justify="center">
      <el-col :span="-1">
        <el-link href="https://archway.io/" target="_blank">
          <el-avatar class="no-border" :src="url" shape="square" :size="170" />
        </el-link>
      </el-col>
    </el-row>

    <el-row class="mx-extra-large" justify="center">
      <el-col :span="-1">
        <el-tooltip :content="walletAddress" placement="top">
          <h2 class="of-hidden fs-large">
            {{ walletAddress }}
          </h2>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-row>
      <el-col class="fs-extra-small tc my-small">
        Connect your social profiles to join the quests!
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <box class="id-card-social fs-small px-base py-small">
          <el-row justify="space-between" class="is-align-middle flex-row pointer" :gutter="5" @click="linkTwitter()" v-if="twitterId === ''">
            <el-col :span="-1" class="fs-base flex-noshrink">
              Connect Twitter
            </el-col>
            <el-col :span="-1">
              <SvgTwitter class="icon-base"/>
            </el-col>
          </el-row>
          <el-col v-else>
            <el-row justify="space-between" class="is-align-middle flex-row" @click="unlinkTwitter()" :gutter="5" style="opacity:.7">
              <el-col :span="-1">
                <el-tooltip content="Unlink" placement="top">
                  <SvgUnlink style="margin-right: 0.5em" class="pointer" />
                </el-tooltip>
                ID {{ twitterId }}
              </el-col>
              <el-col :span="-1">
                <SvgTwitter class="icon-base"/>
              </el-col>
            </el-row>
          </el-col>
        </box>
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <el-tooltip content="Coming soon" placement="right">
          <box disabled class="id-card-social fs-small px-base py-small white">
            <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
              <el-col :span="-1" class="fs-base flex-noshrink">
                Connect Telegram
              </el-col>
              <el-col :span="-1">
                <SvgTelegram class="icon-base"/>
              </el-col>
            </el-row>
          </box>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <el-tooltip content="Coming soon" placement="right">
          <box disabled class="id-card-social fs-small px-base py-small white">
            <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
              <el-col :span="-1" class="fs-base flex-noshrink">
                Connect Discord
              </el-col>
              <el-col :span="-1">
                <SvgDiscord class="icon-base"/>
              </el-col>
            </el-row>
          </box>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-row class="my-small">
      <el-col>
        <el-tooltip content="Coming soon" placement="right">
          <box disabled class="id-card-social fs-small px-base py-small white">
            <el-row justify="space-between" class="is-align-middle flex-row" :gutter="5">
              <el-col :span="-1" class="fs-base flex-noshrink">
                Connect Reddit
              </el-col>
              <el-col :span="-1" class="of-hidden">
                <SvgReddit class="icon-base"/>
              </el-col>
            </el-row>
          </box>
        </el-tooltip>
      </el-col>
    </el-row>
  </id-card>
</template>

<script setup lang="ts">
import Box from "@/components/BoxWrapper.vue";
import IdCard from "@/components/IdCard.vue";
import type { ComputedRef, Ref } from "vue";
import { computed, ref} from "vue";
import { StoreType, useStore } from "@/store";
import { renderDiscs } from "@whi/identicons";
import SvgUnlink from "@/assets/icons/unlink.svg";
import SvgTwitter from "@/assets/icons/twitter.svg";
import SvgTelegram from "@/assets/icons/telegram.svg";
import SvgDiscord from "@/assets/icons/discord.svg";
import SvgReddit from "@/assets/icons/reddit.svg";
import { ElMessageBox } from "element-plus";
import HttpResponse from "@/common/api/HttpResponse";
import Toast from "@/common/Toast";

const store: StoreType = useStore();

let twitterIdRemoved: Ref<boolean> = ref(false);

const url = computed(() => {
  const result = renderDiscs({
    seed: store.state.UserModule?.user?.userId || "-",
    base: 0.06,
    size: 170,
    maxDiscs: 4,
    colorRange: 1,
  });

  return result.dataURL;
});

const twitterId: ComputedRef<string> = computed(
  () => twitterIdRemoved.value ? "" : (store.state.UserModule?.user?.twitter || "")
);

const walletAddress: ComputedRef<string> = computed(
  () => store.state.UserModule?.activeWallet?.address || ""
);


async function linkTwitter(): Promise<void> {
  const response: Response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/social-link`,
    {
      body: JSON.stringify({
        social: "twitter",
        returnTo: window.location.href,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": store.state.UserModule?.token || "",
      },
      method: "POST",
    }
  );
  const responseData = await HttpResponse.fromResponse<string>(response);
  if (responseData.success) {
    window.location.href = responseData.payload;
  }
}

async function unlinkTwitter(): Promise<void> {
  try {
    await ElMessageBox.confirm(
      "Are you sure you want unlink Twitter account?",
      "Twitter Account",
      {
        confirmButtonText: "Unlink",
        cancelButtonText: "Cancel",
      }
    );
  } catch (e: any) {
    return;
  }
  const response: Response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/social-unlink`,
    {
      body: JSON.stringify({social: "twitter"}),
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": store.state.UserModule?.token || "",
      },
      method: "POST",
    }
  );
  const responseData = await HttpResponse.fromResponse<void>(response);
  if (responseData.success) {
    Toast.make(
      "Twitter unlinked",
      "Your Twitter account successfully unlinked",
      "success",
      true,
      3000
    );
    twitterIdRemoved.value = true;
  }
}

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
