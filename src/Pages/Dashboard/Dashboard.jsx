import React, { useState } from 'react'
import { Outlet } from 'react-router'
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen)
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    }
  }

  return (
    <div className="flex h-[96vh] bg-gray-50 font-inter overflow-hidden">
      <Sidebar
        setIsColapsed={setIsSidebarCollapsed}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`flex-1 flex flex-col overflow-hidden `}>
        <Header toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
