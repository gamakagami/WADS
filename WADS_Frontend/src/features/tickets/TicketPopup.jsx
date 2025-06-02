import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { createTicket } from "../../api/ticket";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const TicketPopup = ({ handleCancel }) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    category: "General Inquiry",
    priority: "medium",
    department: "Other",
    description: "",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    console.log("File changed:", e.target.files[0].name);
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("attachments", formData.attachments);

      // Only append files if there are any
      formData.attachments.forEach((file) => {
        formDataToSend.append("attachments", file);
      });

      console.log("Sending form data:", {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        department: formData.department,
        description: formData.description,
        attachments: formData.attachments,
      });

      const response = await createTicket(user.accessToken, formDataToSend);
      console.log("Response in handleSubmit:", response);

      // Show success toast
      toast.success("Ticket created successfully!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });

      // Invalidate and refetch tickets
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["user-recent-tickets"] });
      handleCancel();
    } catch (error) {
      console.error("Error in handleSubmit:", error);

      // Show error toast
      toast.error(error.message || "Failed to create ticket", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl mx-4 flex flex-col">
        <div className="bg-white text-black px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Submit New Ticket</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-3 flex-grow flex flex-col overflow-hidden gap-y-2"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1D3B5C]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1D3B5C]"
              required
            >
              <option>Radiology</option>
              <option>Cardiology</option>
              <option>Emergency</option>
              <option>Laboratory</option>
              <option>Pharmacy</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1D3B5C]"
              required
            >
              <option>Equipment Issue</option>
              <option>MRI Machine Calibration</option>
              <option>Software Problem</option>
              <option>Network Issue</option>
              <option>Access Request</option>
              <option>General Inquiry</option>
              <option>Maintenance Request</option>
              <option>Training Request</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1D3B5C]"
              required
            >
              <option>low</option>
              <option>medium</option>
              <option>high</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-bases font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Detailed description of your issue"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1D3B5C]"
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="attachments"
              className="block text-base font-medium text-gray-700 mb-1"
            >
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-xs text-gray-600 mb-2">
                Drag and drop files here or
              </p>
              <input
                type="file"
                id="attachments"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="attachments"
                className="bg-[#1D3B5C] text-white px-3 py-2 text-xs rounded-md hover:cursor-pointer inline-block"
              >
                Browse Files
              </label>
              {formData.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600">Selected files:</p>
                  <ul className="text-xs text-gray-600">
                    {formData.attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-3 py-1 text-md text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-md hover:cursor-pointer"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-md bg-[#1D3B5C] text-white rounded-md focus:outline-none hover:cursor-pointer disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketPopup;
