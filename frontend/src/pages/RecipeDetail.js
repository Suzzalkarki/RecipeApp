import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await API.get(`/recipes/${id}`);
        setRecipe(data);
      } catch (err) {
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
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
        <p style={styles.loadingText}>Loading recipe...</p>
      </div>
    );

  if (error || !recipe)
    return (
      <div style={styles.centered}>
        <p style={styles.errorText}>{error || "Recipe not found."}</p>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* Hero Image */}
      <div style={styles.heroSection}>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={styles.heroImage}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <Link to="/" style={styles.backBtn}>
            ← Back
          </Link>
          <div style={styles.heroBadges}>
            <span style={styles.categoryBadge}>{recipe.category}</span>
            <span style={styles.timeBadge}>⏱ {recipe.cookingTime} mins</span>
          </div>
          <h1 style={styles.heroTitle}>{recipe.title}</h1>
          <p style={styles.heroDesc}>{recipe.description}</p>

          {recipe.chefId && (
            <Link to={`/chefs/${recipe.chefId._id}`} style={styles.chefLink}>
              <div style={styles.chefAvatar}>
                {recipe.chefId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={styles.chefBy}>Recipe by</p>
                <p style={styles.chefName}>{recipe.chefId.name}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.container}>
        <div style={styles.twoCol}>
          {/* Ingredients */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🥗</span>
              <h2 style={styles.cardTitle}>Ingredients</h2>
            </div>
            <ul style={styles.ingredientsList}>
              {recipe.ingredients.map((item, i) => (
                <li key={i} style={styles.ingredientItem}>
                  <span style={styles.ingredientDot} />
                  <span style={styles.ingredientText}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📋</span>
              <h2 style={styles.cardTitle}>Instructions</h2>
            </div>
            <p style={styles.instructions}>{recipe.instructions}</p>
          </div>
        </div>
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
  errorText: { color: "#f87171" },
  backLink: { color: "#10b981", fontWeight: "600" },
  heroSection: {
    position: "relative",
    minHeight: "420px",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
    backgroundColor: "#111",
  },
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.4,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.3) 100%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem",
    width: "100%",
  },
  backBtn: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.875rem",
    fontWeight: "500",
    display: "inline-block",
    marginBottom: "1.5rem",
  },
  heroBadges: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  categoryBadge: {
    background: "rgba(16,185,129,0.2)",
    color: "#10b981",
    border: "1px solid rgba(16,185,129,0.3)",
    padding: "5px 14px",
    borderRadius: "50px",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  timeBadge: {
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "5px 14px",
    borderRadius: "50px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: "2.8rem",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-1px",
    marginBottom: "0.75rem",
    lineHeight: "1.15",
  },
  heroDesc: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "1rem",
    lineHeight: "1.7",
    maxWidth: "600px",
    marginBottom: "1.5rem",
    fontWeight: "400",
  },
  chefLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "50px",
    padding: "8px 16px 8px 8px",
    backdropFilter: "blur(10px)",
  },
  chefAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "700",
    flexShrink: 0,
  },
  chefBy: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.35)",
    fontWeight: "500",
    lineHeight: 1,
  },
  chefName: {
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#fff",
    lineHeight: 1.3,
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1.8fr",
    gap: "1.5rem",
    alignItems: "start",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "1.75rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  cardIcon: { fontSize: "1.3rem" },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  ingredientsList: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  ingredientItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  ingredientDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    flexShrink: 0,
    boxShadow: "0 0 6px rgba(16,185,129,0.5)",
  },
  ingredientText: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "400",
  },
  instructions: {
    color: "rgba(255,255,255,0.65)",
    lineHeight: "1.85",
    fontSize: "0.9rem",
    whiteSpace: "pre-line",
    fontWeight: "400",
  },
};

export default RecipeDetail;
