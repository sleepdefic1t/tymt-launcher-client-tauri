import { useState } from "react";
import ReactPlayer from "react-player";
import { useConstVar } from "../../providers/ConstVarProvider";
import { Grid, Stack } from "@mui/material";
import Bottom from "../../components/home/Bottom";
import UpdateModal from "../../components/home/UpdateModal";
import AnimatedComponent from "../../components/home/AnimatedComponent";
import TymtIntro from "../../components/home/TymtIntro";
import GameSwiperComponent from "../../components/home/GameSwiperComponent";

const Homepage = () => {
  const { constTymtLinks } = useConstVar();
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  return (
    <>
      <AnimatedComponent>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack display={"flex"} direction={"row"} justifyContent={"space-between"} width={"100%"}>
            <div style={{ width: "calc(100% - 353px)", borderRadius: "16px", overflow: "hidden" }}>
              <ReactPlayer url={constTymtLinks?.youtube} playing loop muted width={"100%"} height={"100%"} />
            </div>
            <TymtIntro />
          </Stack>
        </Grid>
      </AnimatedComponent>
      <Grid container sx={{ marginTop: "80px" }}>
        <AnimatedComponent>
          <GameSwiperComponent mode="trending" />
        </AnimatedComponent>
        <AnimatedComponent>
          <GameSwiperComponent mode="free" />
        </AnimatedComponent>
        <AnimatedComponent>
          <GameSwiperComponent mode="recently-added" />
        </AnimatedComponent>
        <AnimatedComponent>
          <GameSwiperComponent mode="coming-soon" />
        </AnimatedComponent>
        <AnimatedComponent>
          <Bottom />
        </AnimatedComponent>
      </Grid>
      <UpdateModal open={updateModal} setOpen={setUpdateModal} />
    </>
  );
};

export default Homepage;
