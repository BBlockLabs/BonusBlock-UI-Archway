import { ElMessage } from "element-plus";

const VueCommonMixin = {
  methods: {
    copyToClipboard(data: string | ClipboardItem) {
      const isText = (typeof data === "string");
      const promise = isText
        ? navigator.clipboard.writeText(data)
        : navigator.clipboard.write([data]);
      promise
        .then(() => {
          const message = (isText ? "Text" : "Image") + " copied to clipboard";
          ElMessage({ message: message, type: "success" });
        })
        .catch(() => {
          const message = "Failed to copy " + (isText ? "text" : "image") + " to clipboard";
          ElMessage({ message: message, type: "error" });
        });
    },
  },
};

export default VueCommonMixin;
