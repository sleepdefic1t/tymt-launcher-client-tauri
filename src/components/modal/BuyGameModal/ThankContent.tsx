import { Box, Button, Stack } from "@mui/material";
import { IGame } from "../../../types/GameTypes";
import RedStrokeButton from "../../account/RedStrokeButton";

export interface IPropsThankContent {
  game: IGame;
}

const ThankContent = ({ game }: IPropsThankContent) => {
  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"40px"}>
      <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"24px"}>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
          <Box component={"img"} src={game?.imageUrl} alt="game" sx={{ width: "40px", height: "40px", borderRadius: "8px" }} />
          <Box className="fs-20-regular white">{game?.title}</Box>
        </Stack>
        <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"16px"}>
          <Box className="fs-24-regular white">Thank you for your purchase!</Box>
          <Box className="fs-16-regular white">Ready to install your product?</Box>
        </Stack>
      </Stack>

      <Stack direction={"row"} alignItems={"center"} gap={"16px"} width={"100%"}>
        <RedStrokeButton text="Close" fullWidth />
        <Button className={"red-button fw"} onClick={() => {}}>
          Install now
        </Button>
      </Stack>
    </Stack>
  );
};

export default ThankContent;
