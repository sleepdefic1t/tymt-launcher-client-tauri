import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Box, Button, CircularProgress } from "@mui/material";
import { useWallet } from "../../providers/WalletProvider";
import { multiply, formatForDisplay } from "../../lib/helper/balanceUtils";
import TooltipComponent from "../home/TooltipComponent";
import { formatTx } from "../../lib/helper/WalletHelper";
import { openLink } from "../../lib/helper/TauriHelper";
import { ITransactionPagination } from "../../types/TransactionTypes";
import timerIcon from "../../assets/wallet/TimerIcon.svg";
import noreviews from "../../assets/main/NoReviews.png";

export interface IPropsTransCard {
  loading: boolean;
  txList: ITransactionPagination;
}

const TransCard = ({ loading, txList }: IPropsTransCard) => {
  const { t } = useTranslation();

  const { currentChainWalletAddress, currentNativeOrToken, currentCurrencySymbol, currentCurrencyReserve, currentChainNativePrice, currentSupportChain } =
    useWallet();

  return (
    <Suspense>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Optional for vertical alignment
            width: "100%", // Fill the parent width
            padding: "150px 0",
          }}
        >
          <CircularProgress
            size="100px"
            sx={{
              color: "#afafaf",
            }}
          />
        </Box>
      ) : (
        <Box>
          {!txList?.data?.length && (
            <Box
              sx={{
                justifyContent: "center",
                marginTop: "24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ justifyContent: "center", display: "flex" }}>
                <img src={noreviews} width={"300px"} height={"300px"} />
              </Box>
              <Box className={"fs-20-regular white"} textAlign={"center"} marginTop={"24px"}>
                {t("wal-89_no-transactions")}
              </Box>
            </Box>
          )}
          {txList?.data?.map((tx, index) => {
            const { displayTxImage, displayTxAmount, displayTxAddress, displayTxTooltip, displayTimestamp, txScanLink } = formatTx(
              tx,
              currentChainWalletAddress,
              currentSupportChain?.native?.name
            );
            return (
              <TooltipComponent placement="bottom" text={`${displayTxTooltip}: Double-click for detail`} key={`tooltip-${tx.txId}-${index}`}>
                <Button
                  key={`${tx.txId}-${index}`}
                  sx={{
                    textTransform: "none",
                    width: "100%",
                  }}
                  onDoubleClick={() => {
                    openLink(txScanLink);
                  }}
                >
                  <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} padding={"7px 25px"} width={"100%"}>
                    <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
                      <Box component={"img"} src={displayTxImage} width={"32px"} height={"32px"} />
                      <Stack>
                        <Box className={"fs-16-regular white"}>
                          {displayTxAddress?.substring(0, 6)}...
                          {displayTxAddress?.substring(tx?.sender?.length - 10)}
                        </Box>
                        <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                          <Box component={"img"} src={timerIcon} width={"12px"} height={"12px"} />
                          <Box className={"fs-12-regular light"}>{displayTimestamp}</Box>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Stack>
                      <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
                        <Box component={"img"} src={currentNativeOrToken.logo} width={"24px"} height={"24px"}></Box>
                        <Box className={"fs-16-regular white center-align"}>{`${formatForDisplay(displayTxAmount, 4)} ${
                          currentNativeOrToken.symbol
                        }`}</Box>
                      </Stack>
                      <Box className={"fs-12-light light t-right"}>{`${currentCurrencySymbol} ${formatForDisplay(
                        multiply(multiply(displayTxAmount, currentChainNativePrice), currentCurrencyReserve.toString()), 2
                      )}`}</Box>
                    </Stack>
                  </Stack>
                </Button>
              </TooltipComponent>
            );
          })}
        </Box>
      )}
    </Suspense>
  );
};

export default TransCard;
