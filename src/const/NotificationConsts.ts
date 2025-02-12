export const CONST_NOTIFICATION_STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  WARNING: "warning",
  ALERT: "alert",
};

export const CONST_NOTIFICATION_DURATION = {
  DEFAULT: 5000,
};

export const CONST_NOTIFICATION_CONTENTS = {
  SIGNUP_SUCCESS: {
    title: "set-85_success",
    text: "ncca-68_sign-up-success",
    status: CONST_NOTIFICATION_STATUS.SUCCESS,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  SIGNUP_FAIL: {
    title: "wal-56_failed",
    text: "ncca-69_sign-up-failed",
    status: CONST_NOTIFICATION_STATUS.FAILED,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  LOGIN_SUCCESS: {
    title: "set-85_success",
    text: "ncca-70_login-success",
    status: CONST_NOTIFICATION_STATUS.SUCCESS,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  LOGIN_FAIL: {
    title: "wal-56_failed",
    text: "ncca-71_login_failed",
    status: CONST_NOTIFICATION_STATUS.FAILED,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  GAME_REFRESH_SUCCESS: {
    title: "set-85_success",
    text: "ga-41_game-list-updated",
    status: CONST_NOTIFICATION_STATUS.SUCCESS,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  GAME_REFRESH_FAIL: {
    title: "wal-56_failed",
    text: "ga-42_game-list-udpating-failed",
    status: CONST_NOTIFICATION_STATUS.FAILED,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  DOWNLOAD_START: {
    title: "set-85_success",
    text: "alt-28_download-start",
    status: CONST_NOTIFICATION_STATUS.SUCCESS,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
  DOWNLOAD_END: {
    title: "set-85_success",
    text: "alt-7_download-finish",
    status: CONST_NOTIFICATION_STATUS.SUCCESS,
    duration: CONST_NOTIFICATION_DURATION.DEFAULT,
    link: "",
  },
};
