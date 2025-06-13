import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Box, Stack, IconButton } from "@mui/material";

import InputText from "../account/InputText";
import RedStrokeButton from "../account/RedStrokeButton";

import { FeedbackAPI } from "../../lib/api/FeedbackAPI";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameFeedback {
  game: IGame;
}

const GameFeedback = ({game}: IPropsGameFeedback) => {
  const { t } = useTranslation();

  const [thumbup, setThumbup] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const thumbupRef = useRef(thumbup);

  useEffect(() => {
    thumbupRef.current = thumbup;
  }, [thumbup]);

  const formik = useFormik({
    initialValues: {
      review: "",
    },
    validationSchema: Yup.object({
      review: Yup.string()
        .max(5000, t("ga-49_max-length", { max: 5000 })),
    }),
    onSubmit: async () => {
      try {
        setLoading(true);
        // console.log('formik.values.review-->', formik.values.review ?? "");
        // console.log('thumbupRef.current-->', thumbupRef.current);
        // console.log('game?._id-->', game?._id);
        const res = await FeedbackAPI.createFeedbackDev({
          gameId: game?._id,
          thumbIs: thumbupRef.current,
          text: formik.values.review ?? "",
        });
        if(res) {
          console.log('res-->', res);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to onSubmit at GameFeedback: ", err);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Box
        sx={{
          padding: "50px 0px",
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <Stack gap={"24px"} textAlign={"center"}>
            <Stack gap={"12px"}>
              <Box className={"fs-20 white"}>{t("ga-50_you_like_it")}</Box>
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <IconButton
                  onClick={() => setThumbup(true)}
                  sx={{
                    backgroundColor: thumbup ? 'rgba(82, 225, 242, 0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: thumbup ? '#52E1F2' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    '&:hover': {
                      backgroundColor: thumbup ? 'rgba(82, 225, 242, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <Box sx={{ fontSize: '24px', opacity: thumbup ? 1 : 0.5, color: "white" }}>👍</Box>
                </IconButton>
                <IconButton
                  onClick={() => setThumbup(false)}
                  sx={{
                    backgroundColor: !thumbup ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: !thumbup ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    '&:hover': {
                      backgroundColor: !thumbup ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <Box sx={{ fontSize: '24px', opacity: !thumbup ? 1 : 0.5, color: "white" }}>👎</Box>
                </IconButton>
              </Box>
            </Stack>

            <Stack>
              <InputText
                id="review"
                label={t("ga-51_more_detail_feedback")}
                type="text"
                name="review"
                value={formik.values.review}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Stack>

            <RedStrokeButton text={t("ga-52_submit_feedback")} isSubmit={true} loading={loading}/>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default GameFeedback;