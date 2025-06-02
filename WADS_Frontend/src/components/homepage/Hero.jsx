import SearchBar from "./SearchBar";

function Hero() {
  return (
    <div className="bg-[#11498B] py-12 px-4 text-center">
      <h1 className="text-white text-4xl font-bold mb-2">
        Medical Equipment Support
      </h1>
      <p className="text-white text-lg mb-6">
        Comprehensive support for healthcare professionals
      </p>
      <SearchBar />
      <div className="flex justify-center gap-6 text-white">
        <span className="text-sm">Quick Links:</span>
        <a href="#" className="text-sm hover:underline">
          Maintenance
        </a>
        <a href="#" className="text-sm hover:underline">
          Repair
        </a>
        <a href="#" className="text-sm hover:underline">
          Product Manuals
        </a>
      </div>
    </div>
  );
}

export default Hero;
