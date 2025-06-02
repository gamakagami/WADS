import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex font-poppins h-screen overflow-hidden bg-[#F5F5F5]">
      <div
        className={`md:hidden ${
          sidebarOpen ? "block" : "hidden"
        } fixed inset-0 z-40`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full">
        <Header openSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
