import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const Dashboard = () => {
  const { chef } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null); // the actual file
  const [imagePreview, setImagePreview] = useState(""); // preview URL
  const [uploading, setUploading] = useState(false); // upload progress

  // Add recipe form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "", // user types comma-separated, we split later
    instructions: "",
    cookingTime: "",
    category: "Other",
    image: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch chef's own recipes on load
  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const { data } = await API.get(`/chefs/${chef._id}`);
        setRecipes(data.recipes);
      } catch (err) {
        setError("Failed to load your recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyRecipes();
  }, [chef._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Show instant preview before uploading
    // FileReader converts file to base64 URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.ingredients ||
      !formData.instructions
    ) {
      return setFormError("Please fill all required fields");
    }

    try {
      setFormLoading(true);
      let imageUrl = formData.image; // use URL if typed manually

      // If chef picked a file — upload it to Cloudinary first
      if (imageFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const { data: uploadResult } = await API.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResult.url; // use Cloudinary URL
        setUploading(false);
      }

      const ingredientsArray = formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== "");

      const { data } = await API.post("/recipes", {
        ...formData,
        image: imageUrl,
        ingredients: ingredientsArray,
        cookingTime: Number(formData.cookingTime) || 0,
      });

      setRecipes([data, ...recipes]);
      setSuccessMsg("Recipe added successfully!");
      setFormData({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        cookingTime: "",
        category: "Other",
        image: "",
      });
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add recipe");
      setUploading(false);
    } finally {
      setFormLoading(false);
    }
  };
  const handleDelete = async (recipeId) => {
    // Simple confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await API.delete(`/recipes/${recipeId}`);
      // Remove from local state — no need to re-fetch
      setRecipes(recipes.filter((r) => r._id !== recipeId));
    } catch (err) {
      alert("Failed to delete recipe.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Welcome Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {chef.name}!</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? "✕ Cancel" : "+ Add Recipe"}
          </button>
        </div>

        {/* Success Message */}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        {/* Add Recipe Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Add New Recipe</h2>

            {formError && <div style={styles.formError}>{formError}</div>}

            <form onSubmit={handleAddRecipe}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Title *</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Classic Pasta Carbonara"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    {[
                      "Breakfast",
                      "Lunch",
                      "Dinner",
                      "Dessert",
                      "Snack",
                      "Other",
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Cooking Time (minutes)</label>
                  <input
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    style={styles.input}
                    type="number"
                    placeholder="30"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Recipe Image</label>

                  {/* File picker */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginBottom: "0.5rem", display: "block" }}
                  />

                  {/* OR type a URL manually */}
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Or paste an image URL..."
                  />

                  {/* Live preview */}
                  {(imagePreview || formData.image) && (
                    <img
                      src={imagePreview || formData.image}
                      alt="Preview"
                      style={{
                        marginTop: "0.5rem",
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Brief description of the recipe..."
                  rows={2}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Ingredients * (comma separated)
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="400g spaghetti, 200g pancetta, 4 eggs..."
                  rows={3}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Instructions *</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Step 1: Boil pasta...&#10;Step 2: Fry pancetta..."
                  rows={5}
                />
              </div>

              <button
                type="submit"
                disabled={formLoading || uploading}
                style={{
                  ...styles.submitBtn,
                  opacity: formLoading || uploading ? 0.7 : 1,
                }}
              >
                {uploading
                  ? "Uploading image..."
                  : formLoading
                    ? "Adding..."
                    : "Add Recipe"}
              </button>
            </form>
          </div>
        )}

        {/* My Recipes List */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Recipes ({recipes.length})</h2>

          {loading && <p style={styles.muted}>Loading your recipes...</p>}
          {error && <p style={styles.errorText}>{error}</p>}

          {!loading && recipes.length === 0 && (
            <div style={styles.emptyState}>
              <p>You haven't added any recipes yet.</p>
              <p style={styles.muted}>Click "+ Add Recipe" to get started!</p>
            </div>
          )}

          <div style={styles.recipesList}>
            {recipes.map((recipe) => (
              <div key={recipe._id} style={styles.recipeRow}>
                {/* Recipe image thumbnail */}
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={styles.thumbnail}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={styles.thumbnailPlaceholder}>🍽️</div>
                )}

                {/* Recipe info */}
                <div style={styles.recipeInfo}>
                  <h3 style={styles.recipeName}>{recipe.title}</h3>
                  <div style={styles.recipeMeta}>
                    <span style={styles.categoryPill}>{recipe.category}</span>
                    <span style={styles.muted}>
                      ⏱ {recipe.cookingTime} mins
                    </span>
                    <span style={styles.muted}>
                      {recipe.ingredients.length} ingredients
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={styles.actions}>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "calc(100vh - 64px)", backgroundColor: "#f8f9fa" },
  container: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: { fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a" },
  subtitle: { color: "#666", marginTop: "0.25rem" },
  addBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #c3e6cb",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    marginBottom: "1.5rem",
  },
  formTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#1a1a1a",
  },
  formError: {
    backgroundColor: "#ffeaea",
    color: "#e74c3c",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  field: { marginBottom: "1rem" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
    fontSize: "0.875rem",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },
  submitBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "11px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  section: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "1.25rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #f0f0f0",
  },
  muted: { color: "#888", fontSize: "0.875rem" },
  errorText: { color: "#e74c3c" },
  emptyState: { textAlign: "center", padding: "2rem", color: "#555" },
  recipesList: { display: "flex", flexDirection: "column", gap: "1rem" },
  recipeRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #f0f0f0",
    backgroundColor: "#fafafa",
  },
  thumbnail: {
    width: "64px",
    height: "64px",
    borderRadius: "8px",
    objectFit: "cover",
    flexShrink: 0,
  },
  thumbnailPlaceholder: {
    width: "64px",
    height: "64px",
    borderRadius: "8px",
    backgroundColor: "#ffeaea",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    flexShrink: 0,
  },
  recipeInfo: { flex: 1 },
  recipeName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "0.4rem",
  },
  recipeMeta: { display: "flex", gap: "1rem", alignItems: "center" },
  categoryPill: {
    backgroundColor: "#ffeaea",
    color: "#e74c3c",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  actions: { display: "flex", gap: "0.5rem" },
  deleteBtn: {
    backgroundColor: "#fff",
    color: "#e74c3c",
    border: "1px solid #e74c3c",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
};

export default Dashboard;
