import { useState, useEffect } from 'react';
import ChefCard from '../components/ChefCard';
import API from '../utils/api';

const Home = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');  // search input value

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const { data } = await API.get('/chefs');
        setChefs(data);
      } catch (err) {
        setError('Failed to load chefs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  // Filter chefs by search term — runs on every render
  // No API call needed — we filter the already-fetched data
  const filteredChefs = chefs.filter((chef) =>
    chef.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover Amazing Chefs</h1>
        <p style={styles.heroSubtitle}>
          Explore recipes from talented chefs around the world
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search chefs by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Main Content */}
      <div style={styles.container}>

        {/* Results count */}
        {!loading && !error && (
          <p style={styles.resultsText}>
            {filteredChefs.length === 0
              ? 'No chefs found'
              : `${filteredChefs.length} chef${filteredChefs.length !== 1 ? 's' : ''} found`}
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.centered}>
            <p style={styles.loadingText}>Loading chefs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.centered}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Chef Grid */}
        {!loading && !error && (
          <div style={styles.grid}>
            {filteredChefs.length > 0 ? (
              filteredChefs.map((chef) => (
                <ChefCard key={chef._id} chef={chef} />
              ))
            ) : (
              <div style={styles.centered}>
                <p style={styles.emptyText}>
                  No chefs match your search. Try a different name!
                </p>
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
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f8f9fa',
  },
  hero: {
    backgroundColor: '#e74c3c',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.75rem',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '2rem',
  },
  searchInput: {
    width: '100%',
    maxWidth: '480px',
    padding: '12px 20px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  resultsText: {
    color: '#666',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  centered: {
    textAlign: 'center',
    padding: '4rem 0',
    width: '100%',
  },
  loadingText: {
    color: '#666',
    fontSize: '1.1rem',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '1.1rem',
  },
  emptyText: {
    color: '#888',
    fontSize: '1rem',
  },
};

export default Home;