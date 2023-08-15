import type { Action, ActionContext, ActionTree, Store } from "vuex";
import type { StateInterface as RootStateInterface } from "@/store/State";
import HttpResponse from "@/common/api/HttpResponse";
import type KeplrCheckResponseRequest from "@/common/api/KeplrCheckResponseRequest";
import type LoginResponse from "@/common/api/LoginResponse";
import type KeplrUnlinkWalletRequest from "@/common/api/KeplrUnlinkWalletRequest";
import type CalculationResultDto from "@/common/api/dto/CalculationResultDto";
import type CampaignWithRewardDto from "@/common/api/dto/CampaignWithRewardDto";
import type ClaimResponseDto from "@/common/api/dto/ClaimResponseDto";
import type ChartDataDto from "@/common/api/dto/ChartDataDto";
import moment from "moment";

export type Context = ActionContext<{}, RootStateInterface>;
export type HttpAction = Action<{}, RootStateInterface>;

export interface ActionsInterface extends ActionTree<{}, RootStateInterface> {
  getStatus: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<LoginResponse>);

  getAuthTicket: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: string
    ) => Promise<string>);
  keplrCheckResponse: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: KeplrCheckResponseRequest
    ) => Promise<LoginResponse>);

  keplrUnlinkWallet: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: KeplrUnlinkWalletRequest
    ) => Promise<void>);
  terminateSession: HttpAction &
    ((this: Store<RootStateInterface>, context: Context) => Promise<void>);

  getCalculationResults: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<Array<CalculationResultDto>>);

  getCampaignsWithReward: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<HttpResponse<Array<CampaignWithRewardDto>>>);

  claimReward: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: { campaignId: string }
    ) => Promise<ClaimResponseDto>);

  claimRewardInit: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: { campaignId: string }
    ) => Promise<null>);

  claimRewardCheck: HttpAction &
    ((this: Store<RootStateInterface>, context: Context) => Promise<null>);

  loadAnalytics: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: { from: number | null; to: number | null; timeZoneOffset: number | null; campaignIds: Array<string> | null; }
    ) => Promise<ChartDataDto>);

}

export default class Actions implements ActionsInterface {
  [key: string]: Action<{}, RootStateInterface>;

  getStatus = async (context: Context): Promise<LoginResponse> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/get-status`,
      {
        headers: {
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
      }
    );

    const responseData = await HttpResponse.fromResponse<LoginResponse>(
      response
    );

    return responseData.payload;
  };

  getAuthTicket = async (
    context: Context,
    payload: string
  ): Promise<string> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/get-auth-ticket`,
      {
        body: JSON.stringify({ nonce: payload }),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<string>(response);

    return responseData.payload;
  };

  keplrCheckResponse = async (
    context: Context,
    payload: KeplrCheckResponseRequest
  ): Promise<LoginResponse> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/cosmos`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<LoginResponse>(
      response
    );

    return responseData.payload;
  };

  keplrUnlinkWallet = async (
    context: Context,
    payload: KeplrUnlinkWalletRequest
  ): Promise<void> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/unlink-wallet`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    await HttpResponse.fromResponse<null>(response);
  };

  terminateSession = async (context: Context): Promise<void> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
      {
        headers: {
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
      }
    );

    if (!response.ok && response.status === 401) {
      // All good, user is logged out
      return;
    }

    await HttpResponse.fromResponse<null>(response);
  };

  getCalculationResults = async (
    context: Context
  ): Promise<Array<CalculationResultDto>> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/bonus-results`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
      }
    );

    const responseData = await HttpResponse.fromResponse<
      Array<CalculationResultDto>
    >(response);

    return responseData.payload;
  };

  getCampaignsWithReward = async (
    context: Context
  ): Promise<HttpResponse<Array<CampaignWithRewardDto>>> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/campaigns-with-reward`,
      {
        headers: {
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
      }
    );

    const responseData = await HttpResponse.fromResponse<
      Array<CampaignWithRewardDto>
    >(response);

    if (responseData.payload) {
      responseData.payload.map((campaign) => {
        if (campaign.socials) {
          for (const r of campaign.socials) {
            if (r.type === "main" || r.type == "main-link") {
              campaign.mainLink = r.link;
              campaign.mainLinkTitle = r.title || "Visit";
            }
          }
        }
        campaign.periodFromParsed = Math.round(moment(campaign.periodFrom).valueOf() / 1000);
        campaign.periodTillParsed = Math.round(moment(campaign.periodTill).valueOf() / 1000);
      });
    }

    return responseData;
  };

  claimReward = async (
    context: Context,
    payload: { campaignId: string }
  ): Promise<ClaimResponseDto> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/claim`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<ClaimResponseDto>(
      response
    );

    return responseData.payload;
  };

  claimRewardInit = async (
    context: Context,
    payload: { campaignId: string }
  ): Promise<null> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/claim/init`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );
    await HttpResponse.fromResponse<never>(response);
    return null;
  };

  claimRewardCheck = async (context: Context): Promise<null> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/claim/check`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );
    await HttpResponse.fromResponse<never>(response);
    return null;
  };

  loadAnalytics = async (
    context: Context,
    payload: { from: number | null; to: number | null; timeZoneOffset: number | null; campaignIds: Array<string> | null }
  ): Promise<ChartDataDto> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/archway/interactions`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<ChartDataDto>(
      response
    );

    return responseData.payload;
  };

}
