function SearchHelp() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">
        Can&apos;t find what you&apos;re looking for?
      </h3>
      <div className="flex">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="flex-1 border rounded-l p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchHelp;
