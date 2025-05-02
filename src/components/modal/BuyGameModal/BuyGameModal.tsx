import { useState } from "react";
import { Modal, Fade, Box } from "@mui/material";

import BuyGameContent from "./BuyGameContent";

import { IGame } from "../../../types/GameTypes";

import CloseIcon from "../../../assets/setting/XIcon.svg";
import ConfirmPasswordContent from "./ConfirmPasswordContent";
import ThankContent from "./ThankContent";

export interface IPropsBuyGameModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  game: IGame;
}

const BuyGameModal = ({ open, setOpen, game }: IPropsBuyGameModal) => {
  const [content, setContent] = useState<string>("buy-game");

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const purchaseGame = async () => {
    setContent("confirm-password");
  };

  const confirmPurchase = async () => {
    setContent("thank-purchase");
  };

  return (
    <>
      <Modal
        open={open}
        style={modalStyle}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: content === "thank-purchase" ? "360px" : "480px",
              padding: content === "thank-purchase" ? "24px" : "40px 24px 24px",
              borderRadius: "16px",
              border: "3px solid #ffffff33",
              background: "#8080804d",
              backgroundBlendMode: "luminosity",
              transition: "all 0.3s ease-in-out", // Added transition
              "&:focusVisible": {
                outline: "none",
              },
            }}
          >
            <img src={CloseIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
            {content === "buy-game" && <BuyGameContent game={game} purchaseGame={purchaseGame} />}
            {content === "confirm-password" && <ConfirmPasswordContent confirmPurchase={confirmPurchase} />}
            {content === "thank-purchase" && <ThankContent game={game} />}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default BuyGameModal;
