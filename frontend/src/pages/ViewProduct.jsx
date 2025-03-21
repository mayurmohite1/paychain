import { useEffect, useState } from "react";
import axios from "axios";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Parse JSON if needed
        let processedData = response.data;

        // If the response is a JSON string, parse it
        if (typeof processedData === "string") {
          try {
            processedData = JSON.parse(processedData);
            console.log("Parsed JSON data:", processedData);
          } catch (e) {
            console.error("Failed to parse JSON:", e);
          }
        }

        // Handle different data structures
        if (Array.isArray(processedData)) {
          setProducts(processedData);
        } else if (processedData && typeof processedData === "object") {
          // Check if the object has a products array property
          if (processedData.products && Array.isArray(processedData.products)) {
            setProducts(processedData.products);
          } else {
            // Convert object of objects to array if needed
            const productsArray = Object.values(processedData);
            setProducts(productsArray);
          }
        } else {
          throw new Error("Could not process product data");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-red-500 p-4 rounded-lg">
          <p className="text-xl">Error: {error}</p>
          <button
            className="mt-2 px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-200"
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Available Products
        </h1>

        {productsToRender.length === 0 ? (
          <div className="text-center text-xl">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToRender.map((product, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {product.name || "Unknown Product"}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {product.description || "No description available"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-400">
                      ${parseFloat(product.price || 0).toFixed(2)}
                    </span>
                    {product.stock > 0 ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-sm rounded">
                        In Stock: {product.stock}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
