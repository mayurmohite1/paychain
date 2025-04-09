import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  Phone,
  Mail,
  Wallet,
} from "lucide-react";
import { ethers } from "ethers";
import ProductSale from "../../../artifacts/contracts/ProductSale.sol/ProductSale.json";

const CONTRACT_ADDRESS = "0x9f7c3F1EDc3D268c334a605C8602F2E1A39f586c";
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
  // Transaction status
  const [transactionStatus, setTransactionStatus] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        console.log("Fetched Products:", response.data.products); // Debugging log
        setProducts(
          response.data.products.map((product) => ({
            ...product,
            price: Number(product.price) || 0, // Ensure price is always a number
          }))
        );
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
      if (
        showProductsList &&
        !event.target.closest(".product-search-container")
      ) {
        setShowProductsList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProductsList]);

  // Add product to selected products
  const addProduct = (product) => {
    const exists = selectedProducts.find((p) => p._id === product._id);
    if (!exists) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          ...product,
          price: Number(product.price) || 0, // Convert price to a number
          quantity: 1,
          totalPrice: Number(product.price) || 0, // Ensure totalPrice is also a number
        },
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

  // Connect to wallet and get contract instance
  const getContractInstance = async () => {
    try {
      // Check if window.ethereum is available (MetaMask or other web3 provider)
      if (!window.ethereum) {
        throw new Error(
          "No Ethereum wallet found. Please install MetaMask or another compatible wallet."
        );
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create a provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ProductSale.abi,
        signer
      );

      return { signer, contract };
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw error;
    }
  };

  const listProductInContract = async (product) => {
    try {
      const { contract } = await getContractInstance();

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(product.price.toString());

      // List product in smart contract
      const transaction = await contract.listProduct(
        product.name,
        product.description,
        priceInWei,
        product.quantity
      );

      await transaction.wait();

      // Return the product ID from the contract
      const events = await contract.queryFilter("ProductListed");
      const latestEvent = events[events.length - 1];
      return latestEvent.args.id.toNumber();
    } catch (error) {
      console.error("Error listing product:", error);
      throw error;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate customer information
    if (!customer.walletAddress) {
      setError("Please provide customer wallet address");
      return;
    }
    // Validate product selection
    if (selectedProducts.length === 0) {
      setError("Please select at least one product");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTransactionStatus("Connecting to wallet...");

      // Process blockchain transactions for each product
      setTransactionStatus("Processing blockchain transactions...");
      const transactionHashes = [];

      // Process each product as a separate transaction
      for (const product of selectedProducts) {
        const hash = await processPurchaseTransaction(
          product,
          customer.walletAddress
        );
        transactionHashes.push(hash);
      }

      // Reset form after successful transactions
      setCustomer({
        fullName: "",
        contactNumber: "",
        email: "",
        walletAddress: "",
      });
      setSelectedProducts([]);
      setSearchTerm("");
      setTransactionStatus("");

      // Show success message
      alert(
        "Transactions completed successfully! Transaction hashes: " +
          transactionHashes.join(", ")
      );
      setLoading(false);
    } catch (err) {
      console.error("Transaction error:", err);
      setError(
        `Failed to process transaction: ${err.message || "Unknown error"}`
      );
      setTransactionStatus("");
      setLoading(false);
    }
  };

  // Update the processPurchaseTransaction function
  const processPurchaseTransaction = async (product, buyerAddress) => {
    try {
      const { contract } = await getContractInstance();

      // First list the product in the contract
      const contractProductId = await listProductInContract(product);

      // Calculate total price in wei
      const priceInWei = ethers.utils.parseEther(
        (product.price * product.quantity).toString()
      );

      // Purchase the product using the returned product ID
      const transaction = await contract.purchaseProduct(
        contractProductId,
        product.quantity,
        {
          value: priceInWei,
          from: buyerAddress, // Specify the buyer's address
        }
      );

      setTransactionStatus(
        `Transaction submitted. Hash: ${transaction.hash}. Waiting for confirmation...`
      );

      await transaction.wait();
      return transaction.hash;
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  };
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 rounded-xl shadow-lg w-full mx-auto -mt-3 my-16 text-gray-200 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4 sticky top-0 bg-gray-900 z-10">
        <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center">
          <ShoppingCart className="mr-2 text-blue-400" />
          Sell Products
        </h2>
        <div className="text-sm text-gray-400">
          {selectedProducts.length} item(s) selected
        </div>
      </div>

      <div className="max-h-full overflow-y-auto pb-20">
        {error && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 rounded-md mb-6 flex items-start">
            <span className="font-medium mr-2">Error:</span> {error}
          </div>
        )}

        {transactionStatus && (
          <div className="bg-blue-900/30 border-l-4 border-blue-500 text-blue-200 p-4 rounded-md mb-6 flex items-start">
            <span className="font-medium mr-2">Status:</span>{" "}
            {transactionStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Customer Information
            </h3>
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
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Product Selection
            </h3>
            <div className="product-search-container relative mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowProductsList(true)}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                  placeholder="Search by product name..."
                />
                {showProductsList && (
                  <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-400 flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
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
                            <div className="font-medium text-gray-200">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              Price:{" "}
                              <span className="font-semibold text-green-400">
                                ETH {product.price.toFixed(2)}
                              </span>
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

            <div className="overflow-hidden rounded-lg border border-gray-700">
              {selectedProducts.length > 0 ? (
                <div className="overflow-x-auto max-w-full">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900 sticky top-0">
                      <tr>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell"
                        >
                          Year
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-2 sm:px-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {selectedProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-750 transition-colors"
                        >
                          <td className="py-3 px-2 sm:py-4 sm:px-4 whitespace-nowrap font-medium text-gray-200 text-sm">
                            {product.name}
                          </td>
                          <td className="py-3 px-2 sm:py-4 sm:px-4 text-sm text-gray-400 max-w-xs truncate">
                            {product.description.length > 30
                              ? `${product.description.substring(0, 30)}...`
                              : product.description}
                          </td>
                          <td className="py-3 px-2 sm:py-4 sm:px-4 text-sm text-gray-400 hidden md:table-cell">
                            {new Date(product.manufacturingYear).getFullYear()}
                          </td>
                          <td className="py-3 px-2 sm:py-4 sm:px-4 text-right text-sm text-gray-300">
                            ETH{" "}
                            {!isNaN(product.price)
                              ? Number(product.price).toFixed(2)
                              : "0.00"}
                          </td>
                          <td className="py-3 px-2 sm:py-4 sm:px-4 text-center">
                            <input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) =>
                                updateQuantity(product._id, e.target.value)
                              }
                              className="w-12 sm:w-16 px-1 sm:px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                            />
                          </td>
                          <td className="py-3 px-2 sm:py-4 sm:px-4 text-right font-semibold text-green-400 text-sm">
                            ETH {product.totalPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-2 sm:py-4 sm:px-4 text-center">
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
                      <tr className="bg-gray-900 sticky bottom-0">
                        <td
                          colSpan="5"
                          className="py-3 px-2 sm:py-3 sm:px-4 text-right font-bold text-gray-300"
                        >
                          Total Amount:
                        </td>
                        <td className="py-3 px-2 sm:py-3 sm:px-4 text-right font-bold text-lg text-green-400">
                          ETH {calculateTotal()}
                        </td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-600 rounded-lg bg-gray-750">
                  <div className="text-gray-400 mb-2">No products selected</div>
                  <div className="text-sm text-gray-500">
                    Search and add products to continue
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end sticky bottom-0 py-4 bg-gradient-to-t from-gray-900 to-transparent z-10">
            <button
              type="submit"
              disabled={loading || selectedProducts.length === 0}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center transition-all ${
                loading || selectedProducts.length === 0
                  ? "bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Sell to Customer
                  <ShoppingCart className="ml-2" size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProducts;
