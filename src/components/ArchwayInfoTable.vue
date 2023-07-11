<template>
  <el-table :data="tableData" >
    <el-table-column prop="count" />
    <el-table-column prop="value" />
    <el-table-column prop="valueDenom" />
    <el-table-column prop="action" />
    <el-table-column prop="product" />
    <el-table-column prop="address" />
  </el-table>
</template>

<script lang="ts" setup>
import type {StoreType} from "@/store";
import {useStore} from "@/store";
import { ref } from "vue";

const store: StoreType = useStore();

let tableData = ref([]);

async function loadData() {
  tableData.value = await store.dispatch("ArchwayHttpModule/getInfo");
}

loadData();
</script>
