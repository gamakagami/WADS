/* eslint-disable react/prop-types */
function TableLabel({ text }) {
  return (
    <th
      scope="col"
      className="px-6 py-4 text-left text-sm font-bold text-gray-700"
    >
      {text}
    </th>
  );
}

export default TableLabel;
