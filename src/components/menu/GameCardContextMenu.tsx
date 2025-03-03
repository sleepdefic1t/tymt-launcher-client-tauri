import { useTranslation } from "react-i18next";

import { Modal, Box, Fade } from "@mui/material";

import { IPoint } from "../../types/HomeTypes";
import { IGame } from "../../types/GameTypes";

export interface IPropsUserListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  contextMenuPosition: IPoint;
  game: IGame;
}

const GameCardContextMenu = ({ view, setView, contextMenuPosition, game }: IPropsUserListItemContextMenu) => {
  const { t } = useTranslation();

  const handleOnClose = () => {
    setView(false);
  };

  const handleAddToLibrary = () => {};

  const handleDownload = () => {};

  return (
    <>
      <Modal open={view} onClose={handleOnClose}>
        <Fade in={view}>
          <Box
            sx={{
              position: "fixed",
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              display: "block",
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            {game?.projectMeta?.type === "browser" ? (
              <Box className={"fs-16 white context_menu_single"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleAddToLibrary}>
                {t("ga-43_add-to-library")}
              </Box>
            ) : (
              <Box className={"fs-16 white context_menu_single"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleDownload}>
                {t("lib-3_download")}
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default GameCardContextMenu;
