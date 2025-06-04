import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import numeral from "numeral";
import { Box, Button, Skeleton, Stack } from "@mui/material";
import { CONST_CHAIN_ICONS } from "../../../const/ChainConsts";
import { useWallet } from "../../../providers/WalletProvider";
import { add, compare, multiply, formatForDisplay } from "../../../lib/helper/balanceUtils";
import BigNumber from 'bignumber.js';
import { IGame } from "../../../types/GameTypes";
import ChevronRightDouble from "../../../assets/arrow/ChevronRightDouble.png";

export interface IPropsBuyGameContent {
  game: IGame;
  purchaseGame: () => void;
  loadingPrice: boolean;
  gamePriceInSXP: number;
}

const BuyGameContent = ({ game, purchaseGame, loadingPrice, gamePriceInSXP }: IPropsBuyGameContent) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sxpBalance, sxpPrice, sxpFee } = useWallet();

  const isInsufficient: boolean = useMemo(() => {
    const totalNeeded = add(gamePriceInSXP.toString(), sxpFee.toString());
    return compare(sxpBalance, totalNeeded) < 0;
  }, [sxpBalance, gamePriceInSXP, sxpFee]);

  const handleClick = () => {
    if (isInsufficient) {
      navigate("/wallet", { state: { openGameTopUp: true } });
      return;
    }
    purchaseGame();
  };

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
      <Box className="fs-40-regular white">{t("pur-8_buying-a-game")}</Box>

      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={game?.imageUrl} alt="game" sx={{ width: "40px", height: "40px", borderRadius: "8px" }} />
          <Box className="fs-20-regular white">{game?.title}</Box>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={CONST_CHAIN_ICONS.SOLAR} alt="game" sx={{ width: "24px", height: "24px" }} />
          <Box className="fs-20-regular white">{loadingPrice ? <Skeleton /> : numeral(+gamePriceInSXP + +sxpFee).format("0,0.[0000]")}</Box>
        </Stack>
      </Stack>

      <Box sx={{ width: "100%", border: "1px solid #ffffff33", borderRadius: "16px" }}>
        {isInsufficient ? (
          <Stack direction={"column"} gap={"16px"} padding={"24px 16px"}>
            <Box className="fs-20-regular white">{t("pur-11_there-are-insufficient")}</Box>

            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">{`${t("pur-9_your-current-balance")}:`}</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{formatForDisplay(sxpBalance, 2)} SXP</Box>
                <Box className="fs-16-regular light">$ {formatForDisplay(multiply(sxpBalance, sxpPrice), 2)}</Box>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} padding={"24px 16px"}>
            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">{`${t("pur-9_your-current-balance")}:`}</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">{formatForDisplay(sxpBalance, 2)} SXP</Box>
                <Box className="fs-16-regular light">$ {formatForDisplay(multiply(sxpBalance, sxpPrice), 2)}</Box>
              </Stack>
            </Stack>
            <Box component={"img"} src={ChevronRightDouble} alt="chevron" sx={{ width: "24px", height: "24px" }} />
            <Stack direction={"column"} gap={"8px"}>
              <Box className="fs-16-regular light">{`${t("pur-10_balance-after-purchase")}:`}</Box>
              <Stack direction={"column"} gap={"4px"}>
                <Box className="fs-16-regular white">
                  {loadingPrice ? <Skeleton /> : `${formatForDisplay(new BigNumber(sxpBalance).minus(gamePriceInSXP).minus(sxpFee).toFixed(), 2)} SXP`}
                </Box>
                <Box className="fs-16-regular light">
                  {loadingPrice ? <Skeleton /> : `$ ${formatForDisplay(multiply(new BigNumber(sxpBalance).minus(gamePriceInSXP).minus(sxpFee).toFixed(), sxpPrice), 2)}`}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Box>

      <Button className={"red-button fw"} onClick={handleClick}>
        {isInsufficient ? "Top up balance" : "Purchase"}
      </Button>
    </Stack>
  );
};

export default BuyGameContent;
