import { useState, useEffect } from "react";
import ChefCard from "../components/ChefCard";
import API from "../utils/api";

const Home = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const { data } = await API.get("/chefs");
        setChefs(data);
      } catch (err) {
        setError("Failed to load chefs.");
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  const filteredChefs = chefs
    .filter((chef) => chef.role === "chef" || !chef.role)
    .filter((chef) => chef.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <div
            className="badge-green"
            style={{ display: "inline-block", marginBottom: "1.5rem" }}
          >
            ✦ Discover Amazing Culinary Art
          </div>
          <h1 style={styles.heroTitle}>
            Where Great Chefs
            <br />
            <span style={styles.heroAccent}>Share Their Magic</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Explore recipes crafted by talented chefs from around the world.
            Every dish tells a story.
          </p>

          {/* Search */}
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search chefs by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Decorative circles */}
        <div style={styles.circle1} />
        <div style={styles.circle2} />
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>{chefs.length}+</span>
          <span style={styles.statLabel}>Expert Chefs</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>100%</span>
          <span style={styles.statLabel}>Original Recipes</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>Free</span>
          <span style={styles.statLabel}>Always</span>
        </div>
      </div>

      {/* Chefs Grid */}
      <div style={styles.container}>
        {!loading && !error && (
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Chefs</h2>
            <p style={styles.sectionCount}>
              {filteredChefs.length} chef{filteredChefs.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
        )}

        {loading && (
          <div style={styles.centered}>
            // Find every loader div and add this style
            <div
              style={{
                ...styles.loader,
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={styles.loadingText}>Discovering chefs...</p>
          </div>
        )}

        {error && (
          <div style={styles.centered}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div style={styles.grid}>
            {filteredChefs.length > 0 ? (
              filteredChefs.map((chef) =>
                chef && chef._id ? (
                  <ChefCard key={chef._id} chef={chef} />
                ) : null,
              )
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>🔍</p>
                <p style={styles.emptyTitle}>No chefs found</p>
                <p style={styles.emptyText}>Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#0a0a0a",
  },
  hero: {
    position: "relative",
    padding: "6rem 2rem 5rem",
    textAlign: "center",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: { position: "relative", zIndex: 1 },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1.15",
    marginBottom: "1.25rem",
    letterSpacing: "-1px",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #10b981, #34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSubtitle: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.55)",
    maxWidth: "500px",
    margin: "0 auto 2.5rem",
    fontWeight: "400",
    lineHeight: "1.7",
  },
  searchWrapper: {
    position: "relative",
    maxWidth: "480px",
    margin: "0 auto",
  },
  searchIcon: {
    position: "absolute",
    left: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1rem",
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    padding: "16px 20px 16px 50px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "50px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "Poppins, sans-serif",
    backdropFilter: "blur(10px)",
    boxSizing: "border-box",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  circle1: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    border: "1px solid rgba(16,185,129,0.08)",
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    bottom: "-150px",
    left: "-150px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    border: "1px solid rgba(16,185,129,0.05)",
    pointerEvents: "none",
  },
  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3rem",
    padding: "2rem",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexWrap: "wrap",
  },
  statItem: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#10b981",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "500",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "rgba(255,255,255,0.08)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 2rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2.5rem",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  sectionCount: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  centered: {
    textAlign: "center",
    padding: "5rem 0",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(16,185,129,0.2)",
    borderTop: "3px solid #10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 1rem",
  },
  loadingText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.95rem",
  },
  errorText: {
    color: "#f87171",
    fontSize: "1rem",
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "5rem 0",
  },
  emptyIcon: { fontSize: "3rem", marginBottom: "1rem" },
  emptyTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "0.5rem",
  },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" },
};

export default Home;
