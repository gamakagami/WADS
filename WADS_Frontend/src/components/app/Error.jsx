import { NavLink } from "react-router-dom";

function Error() {
  return(
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-11/12 flex flex-col items-center text-center lg:items-start gap-6 max-w-[900px]">
          <h1 className="text-5xl text-[#1D3B5C] font-bold">Oops! Page not found.</h1>
          <p className="text-xl text-neutral-500">We couldn’t find the page you were looking for. It might have been moved or deleted.</p>
          <NavLink to="/home" className="w-30 p-2 mt-6 bg-[#4A81C0] text-white text-center rounded-md">Return Home</NavLink>
      </div>
    </div>
  )
}

export default Error;
