import React, { useState } from 'react';
import CardTitle from "../dashboard/CardTitle";
import AdminDropdown from "../dashboard/Admin/AdminDropdown";
import { useAdminDashboardContext } from '../../contexts/AdminDashboardContext';

// Mock user feedback data - you can remove this when integrating with real data
const defaultUserFeedbackData = [
  {
    ticketId: '188',
    userId: '188',
    category: '188',
    priority: '188',
    agentAssigned: '188',
    resolutionTime: '188',
    feedbackScore: '188',
    comments: '188'
  }
];

const UserFeedbackCard = ({ feedbackData = defaultUserFeedbackData, onExport, onViewDetails }) => {
  const handleExport = () => {
    if (onExport) {
      onExport(feedbackData);
    } else {
      // Default export behavior
      console.log('Exporting feedback data:', feedbackData);
    }
  };

  const handleViewDetails = (rowData) => {
    if (onViewDetails) {
      onViewDetails(rowData);
    } else {
      // Default view behavior
      console.log('Viewing details for:', rowData);
    }
  };

  const { agentMetrics, agentMetricsLoading } = useAdminDashboardContext();
  let options;
  if (!agentMetricsLoading && agentMetrics?.performance) {
    options = agentMetrics.performance.map((agent, index) => {
      const { firstName, lastName, userId } = agent.assignedTo;
      const shortId = userId.slice(-4);
      return {
        label: `${firstName} ${lastName} (#${shortId})`,
        value: index
      };
    });
  }

  const [selectedOption, setSelectedOption] = useState(0);

  const handleOptionChange = (newOption) => {
    setSelectedOption(newOption);
  };

  if (agentMetricsLoading) return <>Loading...</>;

  return (
    <div className="bg-white rounded-sm shadow-md border border-neutral-200">
      <CardTitle title="User Feedback">
        <AdminDropdown options={options || []} onChange={handleOptionChange} />
        <button 
          onClick={handleExport}
          className="bg-[#1D3B5C] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#2a4d6e] transition-colors"
        >
          Export
        </button>
      </CardTitle>

      <div className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Ticket ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">User ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Priority</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Agent Assigned</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Resolution Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Feedback Score</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Comments</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Details</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{row.ticketId}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.userId}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.category}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.priority}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.agentAssigned}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.resolutionTime}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.feedbackScore}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.comments}</td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleViewDetails(row)}
                    className="bg-[#1D3B5C] text-white px-3 py-1 rounded text-xs hover:bg-[#2a4d6e] transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserFeedbackCard;