<template>
  <el-dialog v-model="open">
    <template #header>
      <div class="d-flex mb-medium">
        <svg-keplr class="icon-medium" />
        <h1 class="fs-medium ml-extra-small my-auto">Select your chain</h1>
      </div>
    </template>

    <div v-loading="store.state.loading">
      <keplr-chain-select
        @connect="(payload: any) => emit('connect', payload)"
        @disconnect="(payload: any) => emit('disconnect', payload)"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import KeplrChainSelect from "@/components/KeplrChainSelect.vue";
import SvgKeplr from "@/assets/icons/keplr.svg?component";
import type { Ref } from "vue";
import { ElMessageBox } from "element-plus";
import { StoreType, useStore } from "@/store";
import { ref, watch } from "vue";

export interface Props {
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits(["connect", "disconnect", "update:open"]);

const store: StoreType = useStore();

const open: Ref<boolean> = ref(false);

function setOpen(newOpenValue: boolean): void {
  emit("update:open", newOpenValue);
  open.value = newOpenValue;
}

async function loadKeplrChains(): Promise<void> {
  try {
    await store.dispatch("loadKeplrChains");
  } catch (error: any) {
    await ElMessageBox.alert(
      "Could not load list of chains from Keplr, the list might be incomplete.",
      "Error",
      {
        center: true,
      }
    );
  }
}

function openDialog(): void {
  if (!window.keplr) {
    ElMessageBox.alert(
      "Keplr plugin was not found, please enable it and reload the page to use Keplr functions.",
      "Keplr plugin not found",
      {
        center: true,
      }
    );

    setOpen(false);

    return;
  }

  loadKeplrChains();

  setOpen(true);
}

watch(
  () => props.open,
  (): void => {
    if (props.open === true) {
      openDialog();
    } else {
      setOpen(false);
    }
  }
);

watch(open, (): void => {
  emit("update:open", open.value);
});
</script>
