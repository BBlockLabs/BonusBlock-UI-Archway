import type { Action, ActionContext, ActionTree, Store } from "vuex";
import type { StateInterface as RootStateInterface } from "@/store/State";
import HttpResponse from "@/common/api/HttpResponse";
import type PaginationRequest from "@/common/api/PaginationRequest";
import type ReducedArchwayProductDto from "@/common/api/archway/ReducedArchwayProductDto";
import type ArchwayProductDto from "@/common/api/archway/ArchwayProductDto";
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
}
