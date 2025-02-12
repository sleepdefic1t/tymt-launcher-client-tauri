import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";

import PushNotification from "../components/home/PushNotification";

import notiIcon from "../assets/main/32x32.png";

import { CONST_EVENT_NAMES } from "../const/EventConsts";
import { INotificationContent, INotificationEventParams } from "../types/NotificationTypes";

interface NotificationContextType {
  showNotification: (_: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = () => {
  const [content, setContent] = useState<INotificationContent>();
  const [customText, setCustormText] = useState<string>("");
  const [customLink, setCustomLink] = useState<string>("");

  const showNotification = () => {};

  // useEffect(() => {
  //   const init = async () => {
  //     let permissionGranted = await isPermissionGranted();
  //     const windowIsVisible = await invoke<boolean>("is_window_visible");
  //     if (!permissionGranted) {
  //       const permission = await requestPermission();
  //       permissionGranted = permission === "granted";
  //     }
  //     if (permissionGranted && !windowIsVisible) {
  //       sendNotification({
  //         title: notificationTitle,
  //         body: notificationDetail,
  //         icon: notiIcon,
  //       });
  //     }
  //   };
  //   if (notificationOpen && notificationStore.alert) {
  //     init();
  //   }
  // }, []);

  useEffect(() => {
    const unlisten_notification = listen(CONST_EVENT_NAMES.NOTIFICATION, async (event) => {
      const data = event.payload as INotificationEventParams;
      setContent(data.content);
      setCustormText(data.text);
      setCustomLink(data.link);
    });

    return () => {
      unlisten_notification.then((unlistenFn) => unlistenFn());
    };
  });

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
      }}
    >
      <Outlet />
      <PushNotification content={content} text={customText} link={customLink} />
    </NotificationContext.Provider>
  );
};
