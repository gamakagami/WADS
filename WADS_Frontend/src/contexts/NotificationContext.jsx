/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { getNotifications } from "../api/notification";

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [Notification, setNotification] = useState("");

  const getNotificationsMutation = useMutation({
    mutationFn: getNotifications,
    onSuccess: (data) => {
      setNotification(data);
      console.log(`The data -> ${data}`);
      console.log(data);
      console.log(Notification);
    },
    onError: (error) => console.error(`Error: ${error.message}`),
  });

  return (
    <NotificationContext.Provider
      value={{
        Notification,
        getNotifications: getNotificationsMutation.mutate,
        getNotificationsError: getNotificationsMutation.error,
        getNotificationsLoading: getNotificationsMutation.isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!NotificationContext)
    throw new Error("Context is used outside of provider");
  return context;
}

export { useNotificationContext, NotificationProvider };
