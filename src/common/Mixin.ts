import { ElMessage } from "element-plus";

const VueCommonMixin = {
  methods: {
    copyToClipboard(text: string) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          ElMessage({ message: "Text copied to clipboard", type: "success" });
        })
        .catch(() => {
          ElMessage({ message: "Failed to copy text", type: "error" });
        });
    },
  },
};

export default VueCommonMixin;
