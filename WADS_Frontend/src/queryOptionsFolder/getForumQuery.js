import { queryOptions } from "@tanstack/react-query";
import { getUserRooms, getAgentsRoom, getRoomMessages } from "../api/forum";

function getUserRoomsQueryOptions(token) {
  return queryOptions({
    queryKey: ["user-rooms"],
    queryFn: () => getUserRooms(token),
  });
}

function getAgentsRoomQueryOptions(token) {
  return queryOptions({
    queryKey: ["agents-room"],
    queryFn: () => getAgentsRoom(token),
  });
}

function getRoomMessagesQueryOptions(token, roomId) {
  return queryOptions({
    queryKey: ["room-messages", roomId],
    queryFn: () => getRoomMessages(token, roomId),
    enabled: !!roomId,
  });
}

export {
  getUserRoomsQueryOptions,
  getAgentsRoomQueryOptions,
  getRoomMessagesQueryOptions,
};
