import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

const ChefProfile = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChefProfile = async () => {
      try {
        const { data } = await API.get(`/chefs/${id}`);
        setChef(data.chef);
        setRecipes(data.recipes);
      } catch (err) {
        setError("Chef not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchChefProfile();
  }, [id]);

  if (loading)
    return (
      <div style={styles.centered}>
        // Find every loader div and add this style
        <div
          style={{
            ...styles.loader,
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div style={styles.centered}>
        <p style={styles.errorText}>{error}</p>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    );

  if (!chef)
    return (
      <div style={styles.centered}>
        <p style={styles.errorText}>Chef not found.</p>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Hero Header */}
      <div style={styles.heroHeader}>
        <div style={styles.heroGlow} />
        <div style={styles.heroInner}>
          <Link to="/" style={styles.backBtn}>
            ← Back
          </Link>

          <div style={styles.profileRow}>
            {/* Avatar */}
            <div style={styles.avatarWrapper}>
              {chef.profileImage ? (
                <img
                  src={chef.profileImage}
                  alt={chef.name}
                  style={styles.avatar}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div style={styles.avatarFallback}>
                  {chef.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={styles.profileInfo}>
              <div
                className="badge-green"
                style={{ display: "inline-block", marginBottom: "0.75rem" }}
              >
                👨‍🍳 Professional Chef
              </div>
              <h1 style={styles.chefName}>{chef.name}</h1>
              <p style={styles.chefEmail}>{chef.email}</p>
              <p style={styles.chefBio}>
                {chef.bio || "This chef has not added a bio yet."}
              </p>

              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <span style={styles.statNum}>{recipes.length}</span>
                  <span style={styles.statLbl}>Recipes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes */}
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Recipes by <span style={styles.nameAccent}>{chef.name}</span>
          </h2>
        </div>

        {recipes.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🍳</p>
            <p style={styles.emptyTitle}>No recipes yet</p>
            <p style={styles.emptyText}>
              This chef hasn't shared any recipes yet.
            </p>
          </div>
        ) : (
          <div style={styles.recipesGrid}>
            {recipes.map((recipe) =>
              recipe && recipe._id ? (
                <div
                  key={recipe._id}
                  style={styles.recipeCard}
                  className="hover-lift"
                >
                  {recipe.image && (
                    <div style={styles.recipeImageWrapper}>
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        style={styles.recipeImage}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div style={styles.recipeImageOverlay} />
                      <span style={styles.categoryFloat}>
                        {recipe.category}
                      </span>
                    </div>
                  )}

                  {!recipe.image && (
                    <div style={styles.recipeNoImage}>
                      <span style={styles.categoryFloat}>
                        {recipe.category}
                      </span>
                    </div>
                  )}

                  <div style={styles.recipeBody}>
                    <h3 style={styles.recipeTitle}>{recipe.title}</h3>
                    <p style={styles.recipeDesc}>
                      {recipe.description && recipe.description.length > 100
                        ? recipe.description.substring(0, 100) + "..."
                        : recipe.description}
                    </p>

                    <div style={styles.recipeMeta}>
                      <span style={styles.recipeTime}>
                        ⏱ {recipe.cookingTime} mins
                      </span>
                      <Link
                        to={`/recipes/${recipe._id}`}
                        style={styles.viewBtn}
                      >
                        View Recipe →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "calc(100vh - 70px)", backgroundColor: "#0a0a0a" },
  centered: {
    textAlign: "center",
    padding: "6rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(16,185,129,0.2)",
    borderTop: "3px solid #10b981",
    borderRadius: "50%",
    margin: "0 auto",
  },
  loadingText: { color: "rgba(255,255,255,0.4)", fontSize: "0.95rem" },
  errorText: { color: "#f87171", fontSize: "1rem" },
  backLink: { color: "#10b981", fontWeight: "600", fontSize: "0.9rem" },
  heroHeader: {
    position: "relative",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    padding: "3rem 0 3rem",
  },
  heroGlow: {
    position: "absolute",
    top: "50%",
    left: "10%",
    transform: "translateY(-50%)",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 2rem",
    position: "relative",
    zIndex: 1,
  },
  backBtn: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.875rem",
    fontWeight: "500",
    display: "inline-block",
    marginBottom: "2rem",
    transition: "color 0.2s",
  },
  profileRow: {
    display: "flex",
    gap: "2.5rem",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  avatar: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(16,185,129,0.4)",
    boxShadow: "0 0 30px rgba(16,185,129,0.2)",
  },
  avatarFallback: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3.5rem",
    fontWeight: "700",
    border: "3px solid rgba(16,185,129,0.4)",
    boxShadow: "0 0 30px rgba(16,185,129,0.2)",
  },
  profileInfo: { flex: 1 },
  chefName: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-1px",
    marginBottom: "0.25rem",
  },
  chefEmail: {
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.875rem",
    marginBottom: "0.75rem",
    fontWeight: "400",
  },
  chefBio: {
    color: "rgba(255,255,255,0.6)",
    lineHeight: "1.7",
    fontSize: "0.95rem",
    maxWidth: "500px",
    marginBottom: "1.5rem",
    fontWeight: "400",
  },
  statsRow: { display: "flex", gap: "2rem" },
  stat: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  statNum: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#10b981",
    letterSpacing: "-0.5px",
  },
  statLbl: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.35)",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" },
  sectionHeader: { marginBottom: "2rem" },
  sectionTitle: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  nameAccent: { color: "#10b981" },
  emptyState: { textAlign: "center", padding: "4rem 0" },
  emptyIcon: { fontSize: "3rem", marginBottom: "1rem" },
  emptyTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "0.5rem",
  },
  emptyText: { color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" },
  recipesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  recipeCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
  },
  recipeImageWrapper: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  recipeImageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
  },
  recipeNoImage: {
    height: "80px",
    background: "rgba(16,185,129,0.05)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryFloat: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "rgba(16,185,129,0.9)",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "50px",
    fontSize: "0.72rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  recipeBody: { padding: "1.25rem" },
  recipeTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "0.5rem",
    letterSpacing: "-0.2px",
  },
  recipeDesc: {
    fontSize: "0.825rem",
    color: "rgba(255,255,255,0.4)",
    lineHeight: "1.6",
    marginBottom: "1rem",
    fontWeight: "400",
  },
  recipeMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: "1rem",
  },
  recipeTime: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.35)",
    fontWeight: "500",
  },
  viewBtn: {
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    padding: "6px 14px",
    borderRadius: "50px",
    fontSize: "0.8rem",
    fontWeight: "600",
    border: "1px solid rgba(16,185,129,0.25)",
    transition: "all 0.2s",
  },
};

export default ChefProfile;
