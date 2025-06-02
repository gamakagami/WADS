import { queryOptions, useMutation } from "@tanstack/react-query";
import { getUsers, createUsers } from "../api/userManagement";

export function getUsersQueryOptions(token, currentPage) {
  return queryOptions({
    queryKey: ["users", currentPage],
    queryFn: () => getUsers(token, currentPage),
  });
}

export function useCreateUsers(token) {
  return useMutation({
    mutationFn: (data) => createUsers(token, data),
  });
}
