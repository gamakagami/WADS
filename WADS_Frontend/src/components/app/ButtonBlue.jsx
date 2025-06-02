// eslint-disable-next-line react/prop-types
export default function ButtonBlue({ Text, handleClick }) {
  return (
    <button
      className="p-2 w-32 bg-[#4A81C0] h-10 rounded-md text-white mx-auto hover:cursor-pointer"
      onClick={handleClick}
    >
      {Text}
    </button>
  );
}
