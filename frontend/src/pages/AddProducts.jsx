import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Save } from "lucide-react";

const AddProducts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    manufacturingYear: new Date(),
    price: "",
    quantity: "", // Field name is "stock" per your latest code
  });

  // Create refs for scrolling to elements
  const bottomRef = useRef(null);
  const errorRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const checkAdmin = async () => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.role !== "admin") {
          navigate("/get-started");
        }
      } catch (err) {
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  // Scroll to bottom when image is uploaded
  useEffect(() => {
    if (formData.image && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [formData.image]);

  // Scroll to error message when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please login first.");

        throw new Error("Authentication required");
      }

      // Validate price
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error("Invalid price value");
      }

      // Send the original string value to preserve precision
      await axios.post(
        "http://localhost:5000/api/products",
        {
          ...formData,
          price: formData.price, // Send as is to preserve precision
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        image: "",
        manufacturingYear: new Date(),
        price: "",
        quantity: "",
      });

      setTimeout(() => {
        navigate("/get-started");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="container mx-auto px-2 py-2 pb-16">
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Add New Product
              </h1>
            </div>

            {error && (
              <div
                ref={errorRef}
                className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4"
              >
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Manufacturing Year
                  </label>
                  <input
                    type="date"
                    name="manufacturingYear"
                    value={formData.manufacturingYear}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                    min="1900"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => {
                      const priceValue = e.target.value;
                      // More strict validation - requires at least one digit before optional decimal
                      if (
                        /^\d+(\.\d{0,15})?$/.test(priceValue) ||
                        priceValue === ""
                      ) {
                        setFormData({ ...formData, price: priceValue });
                      }
                    }}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                    min="0"
                    step="0.000000000000001"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                    min="0"
                    step="1"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div ref={imageRef}>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Product Image
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!formData.image}
                    />
                    <span className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white flex items-center justify-center cursor-pointer hover:bg-gray-700/70 transition">
                      <Upload className="mr-2 w-5 h-5" />
                      {formData.image ? "Change Image" : "Upload Image"}
                    </span>
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-40 object-contain rounded-lg border border-gray-600"
                    />
                  </div>
                )}
              </div>

              <div
                className="flex justify-end space-x-4 mt-6 pt-2"
                ref={bottomRef}
              >
                <button
                  type="button"
                  onClick={() => navigate("/get-started")}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center"
                >
                  <X className="mr-2 w-5 h-5" /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    "Adding..."
                  ) : (
                    <>
                      <Save className="mr-2 w-5 h-5" /> Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
