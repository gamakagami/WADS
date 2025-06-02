import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicketStatus } from "../api/ticket";
import { useAuthContext } from "../contexts/AuthContext";

const useUpdateTicketStatus = (ticketId) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStatus) =>
      updateTicketStatus(user.accessToken, ticketId, newStatus),
    onSuccess: () => {
      // Invalidate and refetch the ticket details
      queryClient.invalidateQueries(["ticket", ticketId]);
      // Also invalidate the tickets list to reflect the status change
      queryClient.invalidateQueries(["tickets"]);
    },
  });
};

export default useUpdateTicketStatus;
