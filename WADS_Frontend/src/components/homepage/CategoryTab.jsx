/* eslint-disable react/prop-types */
function CategoryTab({ title, onActiveCategory, index, activeCategory }) {
  return (
    <button
      key={index}
      className={`flex-1 px-4 py-3 text-sm font-semibold ${
        activeCategory === index
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-[#364153]"
      } rounded-md text-center`}
      onClick={() => onActiveCategory(index)}
    >
      {title}
    </button>
  );
}

export default CategoryTab;
