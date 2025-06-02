export default function UserMessage({ content }) {
    return (
      <div className="flex justify-end mb-8">
        <div className="max-w-3/4">
          <div className="bg-[#1D3B5C] rounded-lg p-3 text-white">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }