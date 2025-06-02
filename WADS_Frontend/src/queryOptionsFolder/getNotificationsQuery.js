import { queryOptions } from "@tanstack/react-query";
import { getNotifications, getAdminNotifications } from "../api/notification";

function getNotificationsQueryOptions(token) {
  return queryOptions({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(token),
  });
}

function getAdminNotificationsQueryOptions(token) {
  return queryOptions({
    queryKey: ["notifications"],
    queryFn: () => getAdminNotifications(token),
  });
}

export { getNotificationsQueryOptions, getAdminNotificationsQueryOptions};
