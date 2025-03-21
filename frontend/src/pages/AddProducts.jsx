import { useState,  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProducts = () => {
  // Remove the unused user variable from context
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

  // Redirect if not admin
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Check if user is admin
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

      // Reset form
      setFormData({
        name: "",
        description: "",
        image: "",
        manufacturingYear: new Date().getFullYear(),
        price: "",
      });

      // Redirect after short delay
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded p-2 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded p-2 text-white h-32"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-700 rounded p-2 text-white"
              required={!formData.image}
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="h-40 object-contain"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Manufacturing Year
              </label>
              <input
                type="number"
                name="manufacturingYear"
                value={formData.manufacturingYear}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded p-2 text-white"
                required
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded p-2 text-white"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/get-started")}
              className="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-500 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
