import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Grid, Stack } from "@mui/material";
import Bottom from "../../components/home/Bottom";
import UpdateModal from "../../components/home/UpdateModal";
import AnimatedComponent from "../../components/home/AnimatedComponent";
import GameSwiperComponent from "../../components/home/GameSwiperComponent";
import { getConstTymtLinks, IConstTymtLinks } from "../../const/tymtConsts";
import TymtIntro from "../../components/home/TymtIntro";

const Homepage = () => {
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [constTymtLinks, setConstTymtLinks] = useState<IConstTymtLinks>(null);

  useEffect(() => {
    getConstTymtLinks()
      .then(setConstTymtLinks)
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
          {/* <div style={{ width: "calc(100% - 353px)" }}> */}
          {/* <Grid item xs={12}> */}
          {/* <img
                className="District53"
                src={image}
                width={"100%"}
                style={{
                  aspectRatio: "1.78",
                  borderRadius: "16px",
                  opacity: 1.0,
                  flexShrink: 1,
                }}
                loading="lazy"
              /> */}
          {/* </Grid> */}
          {/* <Grid item xs={12} container spacing={"32px"} mt={"0px"}>
              <GameBarSticker />
            </Grid> */}
          {/* </div> */}
          {/* <District53Intro setImage={setImage} /> */}
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
        {/* <RecentlyAddedGames /> */}
        {/* <AnimatedComponent>
          <ComingsoonD53 />
        </AnimatedComponent> */}
        <AnimatedComponent>
          <Bottom />
        </AnimatedComponent>
      </Grid>
      <UpdateModal open={updateModal} setOpen={setUpdateModal} />
    </>
  );
};

export default Homepage;
