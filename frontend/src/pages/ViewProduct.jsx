import { useEffect, useState, useRef } from "react";
import axios from "axios";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Log the response to see its structure
        console.log("Raw API Response:", response);
        console.log("Response data type:", typeof response.data);
        // Process response data
        const data = typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

        setProducts(Array.isArray(data) ? data : data.products || Object.values(data));
        setLoading(false);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  useEffect(() => {
    if (containerRef.current && products.length > 0) {
      // Smooth scroll to bottom when new products arrive
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [products.length]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="text-xl flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-md">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl font-semibold">Error: {error}</p>
          </div>
          <button
            className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Ensure products is an array before rendering
  const productsToRender = Array.isArray(products) ? products : [];
  console.log("Products to render:", productsToRender);

  return (
    <div ref={containerRef} className="bg-gray-50 dark:bg-gray-900 flex-1 overflow-y-auto p-4 mb-20 sm:p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Available Products
        </h1>

        {productsToRender.length === 0 ? (
          <div className="text-center text-xl bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 sm:gap-6 pb-10">
            {productsToRender.map((product, index) => (
              <div
                key={index}
                onClick={() => handleProductClick(product)}

                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {product.image && (
                  <div className="relative pt-[56.25%] w-full">
                    <img
                      src={product.image}
                      alt={product.name || "Product image"}
                      className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100 dark:bg-gray-700 p-2"
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    // }}
                    />
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      {product.name || "Unknown Product"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                      {product.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${parseFloat(product.price || 0).toFixed(2)}
                    </span>
                    {product.quantity > 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-sm rounded-full font-medium">
                        In Stock: {product.quantity}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 text-sm rounded-full font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-gray-700" onClick={closeModal}>
                ✖
              </button>
              {selectedProduct.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-60 object-contain bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                />
              )}
              <h2 className="text-2xl font-bold mt-4">{selectedProduct.name}</h2>
              <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-green-600">
                  ETH {parseFloat(selectedProduct.price || 0).toFixed(15)}
                </span>
                {selectedProduct.quantity > 0 ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">In Stock</span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Out of Stock</span>
                )}
              </div>
              <button
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewProducts;