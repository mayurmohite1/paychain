import React, { useState } from 'react';
import SidebarNavigation from './SidebarNavigation';

const DashboardLayout = ({ navItems, renderContent }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex h-screen w-full bg-gray-900">
    <SidebarNavigation navItems={navItems} onTabChange={setCurrentTab} />
    <main className="flex-grow p-6 overflow-y-auto text-white mt-16">
      {renderContent(currentTab)}
    </main>
  </div>
  
  );
};

export default DashboardLayout;
