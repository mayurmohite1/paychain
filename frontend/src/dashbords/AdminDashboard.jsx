import DashboardLayout from './DashboardLayout';
import { LayoutDashboard, Package, ShoppingCart, PlusCircle} from 'lucide-react';
import AddProducts from '../pages/AddProducts';
import ViewProducts from '../pages/ViewProduct';
import Dashboard from '../pages/Dashboard';
import SellProducts from "../pages/SellProducts"

const adminNavItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, key: 'dashboard' },
  { name: 'View Products', icon: <Package className="w-5 h-5" />, key: 'view-products' },
  { name: 'Add Product', icon: <PlusCircle className="w-5 h-5" />, key: 'add-product' },
  // { name: 'Transactions', icon: <FileText className="w-5 h-5" />, key: 'transactions' },
  { name: 'Sell to Customer', icon: <ShoppingCart className="w-5 h-5" />, key: 'sell-customer' },
 
];

const renderAdminContent = (currentTab) => {
  switch (currentTab) {
    case 'dashboard': return <div className="text-white"><Dashboard/></div>;
    case 'view-products': return <div className="text-white"><ViewProducts/></div>;
    case 'add-product': return <div className="text-white"><AddProducts/></div>;
    // case 'transactions': return <div className="text-white">Transaction History</div>;
    case 'sell-customer': return <div className="text-white"><SellProducts/></div>;
    default: return <div className="text-white">Dashboard</div>;
  }
};

const AdminDashboard = () => {
  return <DashboardLayout navItems={adminNavItems} renderContent={renderAdminContent} />;
};

export default AdminDashboard;
