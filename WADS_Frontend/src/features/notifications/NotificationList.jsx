import { useQuery } from "@tanstack/react-query";
import NotificationAlert from "./NotificationAlert";
import {
  getNotificationsQueryOptions,
  getAdminNotificationsQueryOptions,
} from "../../queryOptionsFolder/getNotificationsQuery";
import { useAuthContext } from "../../contexts/AuthContext";

function NotificationList() {
  const { user } = useAuthContext();

  let notifications, isLoading;

  if (user.role === "admin") {
    ({ data: notifications, isLoading } = useQuery(
      getAdminNotificationsQueryOptions(user.accessToken)
    ));
  } else {
    ({ data: notifications, isLoading } = useQuery(
      getNotificationsQueryOptions(user.accessToken)
    ));
  }

  if (isLoading) return <div>Loading</div>;

  return (
    <div className="col-span-1">
      <h2 className="text-2xl text-gray-800 mb-5">Notifications</h2>
      <div className="bg-white rounded shadow-sm">
        {notifications && notifications.length > 0 ? (
          notifications.map((item, index) => (
            <>
              <NotificationAlert
                key={index}
                title={item.title}
                isRead={item.isRead}
                timestamp={item.timestamp}
              >
                {item.content}
              </NotificationAlert>
            </>
          ))
        ) : (
          <div className="p-5 bg-white border-gray-300 rounded-md shadow-sm text-center">
            <div className="flex justify-center items-center py-4">
              <span className="text-gray-600 text-md">
                No notifications to display
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationList;
