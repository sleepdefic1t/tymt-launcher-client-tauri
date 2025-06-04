import { CONST_SUPPORT_CURRENCIES } from "../../const/CurrencyConsts";
import axiosAuth from "../core/AxiosAuth";

import { IReserve } from "../../types/CurrencyTypes";
import { ICurrencyAPIFetchReserveListResponse } from "../../types/APITypes/CurrencyAPITypes";

export class CurrencyAPI {
  static async fetchReserveList() {
    try {
      const res = await axiosAuth.get(`/currencies`);

      const data: IReserve[] = CONST_SUPPORT_CURRENCIES?.map((one) => {
        const item: IReserve = {
          currency: one?.name,
          reserve: res?.data?.result?.data?.find((element: ICurrencyAPIFetchReserveListResponse) => element?.currency_id === one?.name)?.rate,
        };
        return item;
      });

      return data;
    } catch (err) {
      console.error("Failed to fetchReserveList: ", err);
    }
  }
}
