import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { Box, Button, Stack } from "@mui/material";
import { useMetamask } from "../../../providers/MetamaskCustomProvider";

import MetamaskImage from "../../../assets/wallet/Metamask.png";

export interface IPropsMetamaskImportContent {
  ethWalletAddress: string;
  ethPrivateKey: string;
  setOpen: (_: boolean) => void;
}

const MetamaskImportContent = ({ ethWalletAddress, ethPrivateKey, setOpen }: IPropsMetamaskImportContent) => {
  const { t } = useTranslation();
  const { connect } = useMetamask();

  // Auto-close after 5 minutes
  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 300000); // 5 minutes in ms
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [setOpen]);

  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"30px"}>
      <Box className="fs-24-regular" sx={{ color: "#52e1f2" }}>{`Mobile Metamask can scan this QR code to import tymt account`}</Box>
      <Box className="fs-14-regular red">{t("wal-90_never-share")}</Box>
      <Box className="fs-14-regular white">{ethWalletAddress}</Box>
      <QRCodeSVG
        value={ethPrivateKey}
        size={250}
        marginSize={1}
        level={"L"}
        imageSettings={{
          src: MetamaskImage,
          x: undefined,
          y: undefined,
          height: 30,
          width: 30,
          excavate: true,
        }}
      />
      <Box className="fs-14-regular light">{`After importing, you still need to connect your mobile metamask with tymt.`}</Box>
      <Button
        fullWidth
        className={"red-button"}
        onClick={() => {
          setOpen(false);
          connect();
        }}
      >{`Next to connect`}</Button>
    </Stack>
  );
};

export default MetamaskImportContent;
