// eslint-disable-next-line react/prop-types
function Main({ children }) {
  return (
    <div className="flex flex-col bg-[#F5F5F5] min-h-screen flex-1">
      {children}
    </div>
  );
}

export default Main;
