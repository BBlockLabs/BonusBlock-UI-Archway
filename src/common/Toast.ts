import { ElCollapse, ElCollapseItem, ElMessage } from "element-plus";
import { h } from "vue";
import type { messageType } from "element-plus/es/components/message/src/message";

class Toast {
  private toasts: { [key: string]: any } = {};

  simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
  }

  setInnerText(elementId: string, data: string) {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerText = data;
    }
  }

  // when a toast is rendered or before being destroyed
  toastEventHandler(event: { componentId: string; type: string }) {
    const id = event.componentId;
    const toastData = this.toasts[id];
    if (!toastData) {
      // this toast wasn't created with our makeToast() wrapper
      return;
    }
    if (event.type === "shown") {
      if (toastData.counter > 1) {
        // the makeToast() was called multiple times
      }
    } else if (event.type === "hide") {
      // delete object when the toast disappears, so we can show the same toast again in future
      delete this.toasts[id];
    }
  }

  dismiss(id: string) {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    // @ts-ignore
    const closeBtn = el.parentElement.getElementsByClassName("el-message__closeBtn");
    if (!closeBtn || !closeBtn[0]) {
      return;
    }
    // @ts-ignore
    closeBtn[0].click();
  }

  make(
    title: string,
    text: string | [string, string | Error],
    variant: messageType = "info",
    autoHide: boolean | null = null,
    autoHideDelay: number = 5000,
    id: string = ""
  ): string {
    let details = "";
    if (!text) {
      text = title;
      title =
        variant === "info" || variant === "success" ? "Information" : "Error";
    } else if (typeof text === "object" && Array.isArray(text) && text.length === 2) {
      text = text[0];
      // @ts-ignore
      details = typeof text[1] === "string" ? text[1] : text[1].message;
    }
    // if id is missing - make one based on title and text. toasts with same text will have same id
    if (!id) {
      const hashData = title + "\n" + (typeof (text) === 'object') ? JSON.stringify(text) : text;
      id = "maketoast-" + this.simpleHash(hashData) + hashData.length;
    }
    // see if a toast with the same id is already queued or being show
    if (this.toasts[id]) {
      // update toast counter
      this.toasts[id].counter++;
      // update title and text
      this.setInnerText(id + "-title", title);
      this.setInnerText(id + "-text", text);
      this.setInnerText(id + "-collapse", details);
      return id;
    }
    // by default autoHide will be true for info/success and false for other types of messages
    if (autoHide === null) {
      autoHide = (variant === 'info' || variant === 'success');
    }
    // remember we ha this toast
    this.toasts[id] = {
      id: id,
      title: title,
      text: text,
      counter: 1,
    };
    // format the title and text
    const elements = [];
    elements.push(h("h6", { id: id + "-title" }, title));
    elements.push(h("div", { id: id + "-text" }, text));
    // if detailed description is provided - show it in collapsed block
    if (details) {
      elements.push(
        h(ElCollapse, null, () => [
          h(ElCollapseItem, { title: "Show details" }, () =>
            h("div", { class: "thin-scrollbar" }, details)
          ),
        ])
      );
    }
    ElMessage({
      message: h("div", { id: id, class: "toast-body" }, elements),
      type: variant,
      duration: autoHide ? autoHideDelay : 0,
      showClose: true,
      grouping: true,
      zIndex: 3000,
      onClose: () => {this.toastEventHandler({ componentId: id, type: "hide" });}
    });
    this.toastEventHandler({ componentId: id, type: "shown" });
    return id;
  }
}

const toast = new Toast();

export default toast;
