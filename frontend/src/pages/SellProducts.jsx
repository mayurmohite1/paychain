import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Trash2, ShoppingCart, User, Phone, Mail, Wallet } from "lucide-react";

const SellProducts = () => {
  // Customer information state
  const [customer, setCustomer] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    walletAddress: "",
  });

  // Product search and selection states
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductsList, setShowProductsList] = useState(false);

  // Selected products for sale
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products");
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Handle customer info change
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle product search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowProductsList(true);
  };

  // Handle click outside product list
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProductsList && !event.target.closest('.product-search-container')) {
        setShowProductsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProductsList]);

  // Add product to selected products
  const addProduct = (product) => {
    const exists = selectedProducts.find((p) => p._id === product._id);

    if (!exists) {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantity: 1, totalPrice: product.price },
      ]);
    }

    setSearchTerm("");
    setShowProductsList(false);
  };

  // Update product quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setSelectedProducts((prev) =>
      prev.map((product) => {
        if (product._id === productId) {
          const updatedQuantity = parseInt(quantity);
          return {
            ...product,
            quantity: updatedQuantity,
            totalPrice: product.price * updatedQuantity,
          };
        }
        return product;
      })
    );
  };

  // Remove product from selected products
  const removeProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product._id !== productId)
    );
  };

  // Calculate total amount
  const calculateTotal = () => {
    return selectedProducts
      .reduce((sum, product) => sum + product.totalPrice, 0)
      .toFixed(2);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate customer information
    if (
      !customer.fullName ||
      !customer.contactNumber ||
      !customer.email ||
      !customer.walletAddress
    ) {
      setError("Please provide all customer information");
      return;
    }

    // Validate product selection
    if (selectedProducts.length === 0) {
      setError("Please select at least one product");
      return;
    }

    try {
      setLoading(true);

      // Format sale data - commented out as in original code
      // const saleData = {
      //   customer,
      //   products: selectedProducts.map((product) => ({
      //     productId: product._id,
      //     quantity: product.quantity,
      //     pricePerUnit: product.price,
      //     totalPrice: product.totalPrice,
      //   })),
      //   totalAmount: calculateTotal(),
      // };

      // // Submit sale to backend
      // const response = await axios.post("/api/sales", saleData);

      // Reset form after successful submission
      setCustomer({
        fullName: "",
        contactNumber: "",
        email: "",
        walletAddress: "",
      });
      setSelectedProducts([]);
      setSearchTerm("");

      // Show success message or redirect
      alert("Sale completed successfully!");
      setLoading(false);
    } catch (err) {
      setError("Failed to process sale. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-4xl mx-auto my-8 text-gray-200 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
          <ShoppingCart className="mr-2 text-blue-400" />
          Sell Products
        </h2>
        <div className="text-sm text-gray-400">
          {selectedProducts.length} item(s) selected
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 rounded-md mb-6 flex items-start">
          <span className="font-medium mr-2">Error:</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="relative">
              <label className="block text-gray-300 font-medium mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                  required
                  placeholder="Enter customer's full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Contact Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="contactNumber"
                  value={customer.contactNumber}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                  required
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                  required
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Wallet Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Wallet size={18} />
                </div>
                <input
                  type="text"
                  name="walletAddress"
                  value={customer.walletAddress}
                  onChange={handleCustomerChange}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                  required
                  placeholder="Enter wallet address"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Product Selection</h3>
          <div className="product-search-container relative mb-4">
            <label className="block text-gray-300 font-medium mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowProductsList(true)}
                className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                placeholder="Search by product name..."
              />

              {showProductsList && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-400 flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading products...
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="p-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b border-gray-700 last:border-b-0 transition-colors"
                        onClick={() => addProduct(product)}
                      >
                        <div>
                          <div className="font-medium text-gray-200">{product.name}</div>
                          <div className="text-sm text-gray-400">
                            Price: <span className="font-semibold text-green-400">${product.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/50 p-1 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            addProduct(product);
                          }}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedProducts.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Year</th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Qty</th>
                    <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                    <th scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {selectedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-750 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-200">{product.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-400 max-w-xs">
                        {product.description.length > 30
                          ? `${product.description.substring(0, 30)}...`
                          : product.description}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400 hidden md:table-cell">
                        {new Date(product.manufacturingYear).getFullYear()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(product._id, e.target.value)
                          }
                          className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                        />
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-green-400">
                        ${product.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeProduct(product._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/50 p-1 rounded-full transition-colors"
                          aria-label="Remove product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-900">
                    <td
                      colSpan="5"
                      className="py-3 px-4 text-right font-bold text-gray-300"
                    >
                      Total Amount:
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-lg text-green-400">
                      ${calculateTotal()}
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-600 rounded-lg bg-gray-750">
              <div className="text-gray-400 mb-2">No products selected</div>
              <div className="text-sm text-gray-500">Search and add products to continue</div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || selectedProducts.length === 0}
            className={`px-6 py-3 rounded-lg text-white font-medium flex items-center transition-all ${
              loading || selectedProducts.length === 0
                ? "bg-gray-600 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Sell to Customer
                <ShoppingCart className="ml-2" size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellProducts;