import DashboardLayout from './DashboardLayout';
import { Package,} from 'lucide-react';
import ViewProducts from '../pages/ViewProduct';

const userNavItems = [
  { name: 'View Products', icon: <Package className="w-5 h-5" />, key: 'view-products' },
  // { name: 'Transactions', icon: <FileText className="w-5 h-5" />, key: 'transactions' },
  
];

const renderUserContent = (currentTab) => {
  switch (currentTab) {
    
    case 'view-products': return <div className="text-white"><ViewProducts/></div>;
    // case 'transactions': return <div className="text-white">User Transaction History</div>;
    default: return <div className="text-white">Dashboard</div>;
  }
};

const UserDashboard = () => {
  return <DashboardLayout navItems={userNavItems} renderContent={renderUserContent} />;
};

export default UserDashboard;
