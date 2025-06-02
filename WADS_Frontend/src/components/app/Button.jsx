/* eslint-disable react/prop-types */
function Button({ type, children }) {
  const buttonStyle =
    type === "blue"
      ? "p-2 bg-[#0A3E74] h-10 rounded-md text-white mx-auto hover:cursor-pointer"
      : type === "blue-s"
      ? "p-2 bg-[#0A3E74] h-10 rounded-md text-white hover:cursor-pointer"
      : type === "clear"
      ? "p-2 bg-[FFFFFF] h-10 rounded-md text-black hover:cursor-pointer border border-gray-300"
      : "flex items-center justify-center gap-2 p-2 px-4 bg-[#E3EFF9] rounded-md text-gray-700 shadow-sm hover:cursor-pointer";

  return <button className={buttonStyle}>{children}</button>;
}

export default Button;
