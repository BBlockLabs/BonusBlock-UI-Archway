import type { StoreType } from "@/store";
import FormattedError from "@/common/errors/FormattedError";
import { ElMessageBox } from "element-plus";

export default class MetamaskClient {
  static metamaskAgentRegex: RegExp = /MetaMaskMobile/i;
  static mobileAgentRegex: RegExp =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
  static metamaskNumberRegex: RegExp =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;

  private static isMetamaskAgent(): boolean {
    const agent: string =
      navigator.userAgent || navigator.vendor || window.opera || "-";

    return MetamaskClient.metamaskAgentRegex.test(agent);
  }

  private static canSwitchAgent(): boolean {
    const agent: string =
      navigator.userAgent || navigator.vendor || window.opera || "-";

    return (
      MetamaskClient.mobileAgentRegex.test(agent) ||
      MetamaskClient.metamaskNumberRegex.test(agent)
    );
  }

  static async metamaskLogin(
    store: StoreType,
    referrer: string | null = null
  ): Promise<void> {
    // if (!MetamaskClient.isMetamaskAgent() && MetamaskClient.canSwitchAgent()) {
    //   window.location.href = `https://metamask.app.link/dapp/${window.location.href}?metamask-login`;
    //
    //   return;
    // }

    store.commit("setLoading", true);

    try {
      await store.dispatch("UserModule/metamaskLogin", referrer);
    } catch (e: any) {
      if (e instanceof FormattedError) {
        await ElMessageBox.alert(e.message, e.name, {
          center: true,
        });
      } else {
        console.error(e);
        await ElMessageBox.alert(
          "There was an error connecting your wallet, please try again.",
          "Error",
          {
            center: true,
          }
        );
      }

      return Promise.reject();
    } finally {
      store.commit("setLoading", false);
    }
  }

  static async requestAccounts(provider: any): Promise<Array<string>> {
    const accounts: Array<string> = await provider.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      return accounts;
    }

    try {
      return await provider.request({ method: "eth_requestAccounts" });
    } catch (error: Error | any) {
      if (
        error.code === -32603 ||
        error.message === "An internal error has occurred"
      ) {
        /**
         * Brave browser error -32602 happens when there is no metamask and
         * there is no wallet connected to brave browser itself - in which case brave
         * also opens a new tab to add wallet, but we cannot prevent that.
         */
        throw new FormattedError(
          "Could not connect to a wallet. Please verify that a wallet is added and reload the page."
        );
      }

      throw error;
    }
  }

  static async signMessage(
    provider: any,
    params: [string, string]
  ): Promise<string> {
    try {
      return await provider.request({
        method: "personal_sign",
        params: params,
      });
    } catch (error: Error | any) {
      if (
        error.code === 4001 ||
        error.message === "The user rejected the request."
      ) {
        /**
         * Brave browser and Metamask error 4001
         * happens when user rejects the sign request
         */
        throw new FormattedError("Sign request rejected, can't connect.");
      }

      throw error;
    }
  }

  static async sendTransaction(
    provider: any,
    to: string,
    value: string,
    data: string
  ): Promise<Array<string>> {
    try {
      const accounts: Array<string> = await provider.request({
        method: "eth_accounts",
      });

      if (accounts.length == 0) {
        return [];
      }

      return await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: to,
            value: value.toString(16),
            data: data,
          },
        ],
      });
    } catch (error: Error | any) {
      console.error(error);
      throw error;
    }
  }
}
