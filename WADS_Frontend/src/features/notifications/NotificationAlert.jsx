/* eslint-disable react/prop-types */
import { formatDistanceToNow } from "date-fns";

function NotificationAlert({ isRead, title, timestamp, children }) {
  const typeStyles = {
    read: { text: "text-blue-700", bg: "bg-gray-100 border-gray-300" },
    unread: { text: "text-gray-800", bg: "border-gray-300" },
  };

  const { text, bg } = isRead ? typeStyles.read : typeStyles.unread;

  return (
    <div className={`p-5 border-b ${bg}`}>
      <div className="flex justify-between mb-2">
        <strong className={text}>{title}</strong>
        <span className="text-gray-600 text-sm">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>
      <p className="text-gray-800 m-0 text-sm">{children}</p>
    </div>
  );
}

export default NotificationAlert;
