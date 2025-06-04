import { useTranslation } from "react-i18next";
import { Box, Skeleton, Stack } from "@mui/material";
import { IPurchaseHistory } from "../../types/APITypes/PurchaseAPITypes";
import { IMetaPurchasePagination } from "../../types/APITypes/BasicAPITypes";
import { useWallet } from "../../providers/WalletProvider";
import { multiply, formatForDisplay } from "../../lib/helper/balanceUtils";

export interface IPropsPurchaseMetrics {
  loading: boolean;
  historyPagination: { data: IPurchaseHistory[]; meta: IMetaPurchasePagination };
}

const PurchaseMetrics = ({ loading, historyPagination }: IPropsPurchaseMetrics) => {
  const { t } = useTranslation();
  const { sxpPrice, currentCurrencySymbol, currentCurrencyReserve } = useWallet();
  return (
    <>
      <Stack padding={"24px 40px"}>
        <Box className="fs-16-regular light t-center">{t("pur-3_total-items")}</Box>
        <Box className="fs-34-bold white t-center">
          {loading || !historyPagination?.meta?.pagination?.total ? <Skeleton /> : `${historyPagination?.meta?.pagination?.total} ${t("pur-7_items")}`}
        </Box>
      </Stack>
      <Stack padding={"32px 24px"}>
        <Box
          sx={{
            borderRight: "1px solid #FFFFFF1A",
            height: "68px",
          }}
        />
      </Stack>

      <Stack padding={"24px 40px"}>
        <Box className="fs-16-regular light t-center">{t("pur-4_total-spent-sxp")}</Box>
        <Box className="fs-34-bold white t-center">
          {loading || !historyPagination?.meta?.total_sxp ? <Skeleton /> : `${formatForDisplay(historyPagination?.meta?.total_sxp.toString(), 2)} SXP`}
        </Box>
      </Stack>
      <Stack padding={"32px 24px"}>
        <Box
          sx={{
            borderRight: "1px solid #FFFFFF1A",
            height: "68px",
          }}
        />
      </Stack>

      <Stack padding={"24px 40px"}>
        <Box className="fs-16-regular light t-center">{t("pur-5_total-spent")}</Box>
        <Box className="fs-34-bold beach t-center">
          {loading || !historyPagination?.meta?.total_sxp ? (
            <Skeleton />
          ) : (
            `${formatForDisplay(multiply(multiply(historyPagination?.meta?.total_sxp.toString(), sxpPrice), currentCurrencyReserve.toString()), 2)} ${currentCurrencySymbol}`
          )}
        </Box>
      </Stack>
    </>
  );
};

export default PurchaseMetrics;
