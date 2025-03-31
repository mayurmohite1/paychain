import  { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Trash2 } from "lucide-react";

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

      // Format sale data
    //   const saleData = {
    //     customer,
    //     products: selectedProducts.map((product) => ({
    //       productId: product._id,
    //       quantity: product.quantity,
    //       pricePerUnit: product.price,
    //       totalPrice: product.totalPrice,
    //     })),
    //     totalAmount: calculateTotal(),
    //   };

    //   // Submit sale to backend
    //   const response = await axios.post("/api/sales", saleData);

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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sell Products</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Customer Full Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={customer.fullName}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contact Number
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={customer.contactNumber}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Wallet Address
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="walletAddress"
              value={customer.walletAddress}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowProductsList(true)}
              className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by product name..."
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />

            {showProductsList && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {loading ? (
                  <div className="p-3 text-center text-gray-600">
                    Loading...
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => addProduct(product)}
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          Price: ${product.price.toFixed(2)}
                        </div>
                      </div>
                      <Plus className="text-blue-500" size={18} />
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-600">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Selected Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border text-left">Product</th>
                    <th className="py-2 px-4 border text-left">Description</th>
                    <th className="py-2 px-4 border text-left">
                      Manufacturing Year
                    </th>
                    <th className="py-2 px-4 border text-right">Price</th>
                    <th className="py-2 px-4 border text-center">Quantity</th>
                    <th className="py-2 px-4 border text-right">Total</th>
                    <th className="py-2 px-4 border text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="py-2 px-4 border">{product.name}</td>
                      <td className="py-2 px-4 border">
                        {product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(product.manufacturingYear).getFullYear()}
                      </td>
                      <td className="py-2 px-4 border text-right">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(product._id, e.target.value)
                          }
                          className="w-16 px-2 py-1 border rounded-md text-center"
                        />
                      </td>
                      <td className="py-2 px-4 border text-right font-medium">
                        ${product.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border text-center">
                        <button
                          type="button"
                          onClick={() => removeProduct(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan="5"
                      className="py-2 px-4 border text-right font-bold"
                    >
                      Total Amount:
                    </td>
                    <td className="py-2 px-4 border text-right font-bold">
                      ${calculateTotal()}
                    </td>
                    <td className="py-2 px-4 border"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="text-right">
          <button
            type="submit"
            disabled={loading || selectedProducts.length === 0}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              loading || selectedProducts.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Sell to Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellProducts;
