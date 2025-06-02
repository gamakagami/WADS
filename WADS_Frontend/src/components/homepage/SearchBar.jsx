import { Search } from "lucide-react";
function SearchBar() {
  return (
    <div className="max-w-xl mx-auto relative mb-6">
      <input
        type="text"
        placeholder="Search for support, products, or solutions"
        className="w-full py-3 px-4 rounded-md shadow-md border-[1.5px] border-[#6C91BC] outline-none bg-[#2C619E] text-[#d3e2ea] font-semibold"
        style={{ appearance: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </button>
    </div>
  );
}

export default SearchBar;
