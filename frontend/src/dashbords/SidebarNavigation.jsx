import  { useState } from 'react';

const SidebarNavigation = ({ navItems, onTabChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (key) => {
    setActiveTab(key);
    onTabChange(key);
  };

  return (
    <aside className="w-64 bg-gray-800 h-full text-white p-4 flex flex-col">
      <nav className="flex-grow">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`
                w-full flex items-center p-3 rounded-lg transition-all duration-200
                ${activeTab === item.key ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}
              `}
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default SidebarNavigation;
