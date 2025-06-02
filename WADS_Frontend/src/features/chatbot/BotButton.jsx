import PropTypes from "prop-types";

export default function BotButton({ content, onClick }) {
  return (
    <button
      className="border border-[#1D3B5C] text-[#1D3B5C] px-3 py-1 rounded-full text-sm hover:cursor-pointer hover:bg-[#1D3B5C] hover:text-white transition-colors"
      onClick={onClick}
    >
      {content}
    </button>
  );
}

BotButton.propTypes = {
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
