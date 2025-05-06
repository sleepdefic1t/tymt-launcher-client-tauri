import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Box, Button } from "@mui/material";
import { IPropsMode } from "../../types/HomeTypes";

const LibraryModeButton = ({ status, setStatus }: IPropsMode) => {
  const [mode, setMode] = useState(status);
  const { t } = useTranslation();

  // Button configurations
  const buttons = [
    { status: 0, label: t("lib-1_your-games") },
    { status: 2, label: t("lib-3_download") },
    { status: 3, label: t("lib-5_coming") },
  ];

  // Shared button styles
  const buttonStyles = {
    "&.MuiButtonBase-root, &.MuiBox-root": {
      display: "block",
      textTransform: "none",
      color: "#52E1F21A",
      minWidth: "unset",
      boxShadow: "none",
      padding: "0px",
      borderRadius: "16px",
    },
  };

  const boxStyles = {
    padding: "8px 16px",
    fontFeatureSettings: "'calt' off",
    fontFamily: "Cobe",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "24px",
    letterSpacing: "-0.36px",
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"2px"}
      sx={{
        padding: "2px",
        borderRadius: "16px",
        gap: "2px",
        border: "1px solid",
        borderColor: "#FFFFFF1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {buttons.map((btn) => (
        <Button
          key={btn.status}
          onClick={() => {
            setStatus(btn.status);
            setMode(btn.status);
          }}
          sx={{
            ...buttonStyles,
            backgroundColor: mode === btn.status ? "rgba(82, 225, 242, 0.10)" : undefined,
            "&:hover": {
              backgroundColor: mode === btn.status ? "rgba(82, 225, 242, 0.10)" : undefined,
            },
          }}
        >
          <Box
            sx={{
              ...boxStyles,
              color: mode === btn.status ? "#52E1F2" : "white",
            }}
          >
            {btn.label}
          </Box>
        </Button>
      ))}
    </Stack>
  );
};

export default LibraryModeButton;
