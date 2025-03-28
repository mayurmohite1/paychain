import { useState, useEffect } from "react";
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
    manufacturingYear: new Date().getFullYear(),
    price: "",
  });

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
        throw new Error("Authentication required");
      }

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        image: "",
        manufacturingYear: new Date().getFullYear(),
        price: "",
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
    <div className="w-full h-full overflow-y-auto bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Add New Product
              </h1>
              <button 
                onClick={() => navigate("/get-started")}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    type="number"
                    name="manufacturingYear"
                    value={formData.manufacturingYear}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                  />
                </div>

                <div>
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
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/get-started")}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center"
                >
                  <X className="mr-2 w-5 h-5" /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
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