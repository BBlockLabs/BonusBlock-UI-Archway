import type { Action, ActionContext, ActionTree, Store } from "vuex";
import type { StateInterface as RootStateInterface } from "@/store/State";
import HttpResponse from "@/common/api/HttpResponse";
import type PaginationRequest from "@/common/api/PaginationRequest";
import type ReducedArchwayProductDto from "@/common/api/archway/ReducedArchwayProductDto";
import type ArchwayProductDto from "@/common/api/archway/ArchwayProductDto";
import type ArchwayStatsDto from "@/common/api/archway/ArchwayStatsDto";
import type ArchwayInfoRow from "@/common/api/archway/ArchwayInfoRow";
export type Context = ActionContext<{}, RootStateInterface>;
export type HttpAction = Action<{}, RootStateInterface>;

export interface ActionsInterface extends ActionTree<{}, RootStateInterface> {
  getProductList: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: PaginationRequest
    ) => Promise<Array<ReducedArchwayProductDto>>);

  getProduct: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: string
    ) => Promise<ArchwayProductDto>);

  getStats: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<void>);

  getInfo: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<Array<ArchwayInfoRow>>)
}

export default class Actions implements ActionsInterface {
  [key: string]: Action<{}, RootStateInterface>;

  getProductList = async (
    context: Context
  ): Promise<Array<ReducedArchwayProductDto>> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/archway/products`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<
      Array<ReducedArchwayProductDto>
    >(response);

    return responseData.payload;
  };

  getProduct = async (
    context: Context,
    payload: string
  ): Promise<ArchwayProductDto> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/archway/product/${payload}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<ArchwayProductDto>(
      response
    );

    return responseData.payload;
  };

  getStats = async (
    context: Context,
  ): Promise<void> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/archway/stats`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<ArchwayStatsDto>(
      response
    );

    context.commit("setArchwayStats", responseData.payload, {root: true});
  };

  getInfo = async (
      context: Context
  ): Promise<Array<ArchwayInfoRow>> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/archway/test-mainnet`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    const responseData = await HttpResponse.fromResponse<Array<ArchwayInfoRow>>(
      response
    );

    return responseData.payload;
  };
}
