export default class HttpResponse<TPayload> {
  payload: TPayload = {} as TPayload;
  errors: Array<string> = [];
  now: string = "";
  success: boolean = false;

  static async fromResponse<TPayload>(
    response: Response
  ): Promise<HttpResponse<TPayload>> {
    return (await response.json()) as HttpResponse<TPayload>;
  }
}
