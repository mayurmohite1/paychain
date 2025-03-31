import { useState } from 'react';
import SidebarNavigation from './SidebarNavigation';

const DashboardLayout = ({ navItems, renderContent }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex h-screen w-full bg-gray-900">
    <SidebarNavigation navItems={navItems} onTabChange={setCurrentTab} />
    <main className="flex-grow p-6 overflow-y-auto scrollbar-hidden text-white mt-16 mb-10 hide-scrollbar">
      {renderContent(currentTab)}
    </main>
  </div>
  
  );
};

export default DashboardLayout;
