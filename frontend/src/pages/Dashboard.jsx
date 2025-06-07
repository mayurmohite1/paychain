import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';


const Dashboard = () => {

    const [productCount, setProductCount] = useState(0);
    const [userCount,setUserCount]=useState(0);
    const [totalSales, setTotalSales] = useState(0); // 🔸 State for total sales


    // Fetch Product Count from Backend with Token Authorization
    const fetchProductCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }
  
        const response = await  axios.get("http://localhost:5000/api/products/count", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });
  
        setProductCount(response.data.count);
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };
    
    const fetchUserCount = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Authentication required");
          }
    
          const response = await  axios.get("http://localhost:5000/api/users/count", {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in headers
            },
          });
    
          setUserCount(response.data.count);
        } catch (error) {
          console.error("Error fetching product count:", error);
        }
      };

    const fetchTotalSales = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const response = await axios.get("http://localhost:5000/api/products/sales/total", {
              headers: { Authorization: `Bearer ${token}` },
            });

            setTotalSales(response.data.totalSales);
          } catch (error) {
            console.error("Error fetching total sales:", error);
          }
  };



  
    useEffect(() => {
      fetchProductCount(),
      fetchUserCount();
      fetchTotalSales(); // 🔸 Fetch total sales

    }, []);



    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin  Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-blue-400">{productCount}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 mb-2">Total Sales</h3>
                    <p className="text-3xl font-bold text-green-400">{totalSales}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-gray-400 mb-2">Active Users</h3>
                    <p className="text-3xl font-bold text-purple-400">{userCount}</p>
                </div>
            </div>

            {/* Recent Sales */}
            {/* <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4">Recent Sales</h3>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left p-2">Order ID</th>
                            <th className="text-left p-2">Customer</th>
                            <th className="text-left p-2">Product</th>
                            <th className="text-right p-2">Amount</th>
                            <th className="text-right p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-700">
                            <td className="p-2">ORD-1234</td>
                            <td className="p-2">John Doe</td>
                            <td className="p-2">Gaming Laptop</td>
                            <td className="p-2 text-right">$1,299.99</td>
                            <td className="p-2 text-right">
                                <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">
                                    Completed
                                </span>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <td className="p-2">ORD-1235</td>
                            <td className="p-2">Jane Smith</td>
                            <td className="p-2">Smartphone</td>
                            <td className="p-2 text-right">$899.99</td>
                            <td className="p-2 text-right">
                                <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">
                                    Processing
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2">ORD-1236</td>
                            <td className="p-2">Mike Johnson</td>
                            <td className="p-2">4K Monitor</td>
                            <td className="p-2 text-right">$499.99</td>
                            <td className="p-2 text-right">
                                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                                    Shipped
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
                <div className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition">
                  <Link
                     to="/add-product">
                    Add New Product
                  </Link>
                    
                </div>
                <button className="bg-green-600 hover:bg-green-700 p-3 rounded-lg transition">
                    View All Transactions
                </button>
            </div> */}
        </div>
    );
};
  


export default Dashboard;