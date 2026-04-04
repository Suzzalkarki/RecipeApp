import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';

const ChefProfile = () => {
  const { id } = useParams();  // gets the :id from the URL
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChefProfile = async () => {
      try {
        // This returns { chef, recipes } from our backend
        const { data } = await API.get(`/chefs/${id}`);
        setChef(data.chef);
        setRecipes(data.recipes);
      } catch (err) {
        setError('Chef not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchChefProfile();
  }, [id]);  // re-fetch if URL id changes

  if (loading) return <div style={styles.centered}>Loading profile...</div>;
  if (error) return <div style={styles.centered}>{error}</div>;

  return (
    <div style={styles.page}>

      {/* Chef Profile Header */}
      <div style={styles.profileHeader}>
        {/* Avatar or Image */}
        {chef.profileImage ? (
          <img
            src={chef.profileImage}
            alt={chef.name}
            style={styles.profileImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={styles.profileAvatar}>
            {chef.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div style={styles.profileInfo}>
          <h1 style={styles.chefName}>{chef.name}</h1>
          <p style={styles.chefEmail}>{chef.email}</p>
          <p style={styles.chefBio}>
            {chef.bio || 'This chef has not added a bio yet.'}
          </p>
          <div style={styles.badge}>
            {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>
          Recipes by {chef.name}
        </h2>

        {recipes.length === 0 ? (
          <p style={styles.emptyText}>
            This chef hasn't shared any recipes yet.
          </p>
        ) : (
          <div style={styles.recipesGrid}>
            {recipes.map((recipe) => (
              <div key={recipe._id} style={styles.recipeCard}>
                {/* Recipe Image */}
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={styles.recipeImage}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}

                <div style={styles.recipeInfo}>
                  {/* Category Badge */}
                  <span style={styles.categoryBadge}>
                    {recipe.category}
                  </span>

                  <h3 style={styles.recipeTitle}>{recipe.title}</h3>
                  <p style={styles.recipeDesc}>
                    {recipe.description.length > 100
                      ? recipe.description.substring(0, 100) + '...'
                      : recipe.description}
                  </p>

                  <div style={styles.recipeMeta}>
                    <span>⏱ {recipe.cookingTime} mins</span>
                    <Link
                      to={`/recipes/${recipe._id}`}
                      style={styles.viewBtn}
                    >
                      View Recipe
                    </Link>
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

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', backgroundColor: '#f8f9fa' },
  centered: { textAlign: 'center', padding: '4rem', color: '#666' },
  profileHeader: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '2.5rem',
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  profileImage: {
    width: '120px', height: '120px',
    borderRadius: '50%', objectFit: 'cover',
    border: '3px solid #e74c3c',
  },
  profileAvatar: {
    width: '120px', height: '120px',
    borderRadius: '50%', backgroundColor: '#e74c3c',
    color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '3rem', fontWeight: '700', flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  chefName: { fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem' },
  chefEmail: { color: '#666', fontSize: '0.9rem', marginBottom: '0.75rem' },
  chefBio: { color: '#444', lineHeight: '1.6', marginBottom: '1rem' },
  badge: {
    display: 'inline-block',
    backgroundColor: '#ffeaea',
    color: '#e74c3c',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1a1a' },
  emptyText: { color: '#888', textAlign: 'center', padding: '2rem' },
  recipesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
  },
  recipeImage: { width: '100%', height: '180px', objectFit: 'cover' },
  recipeInfo: { padding: '1rem' },
  categoryBadge: {
    backgroundColor: '#ffeaea', color: '#e74c3c',
    padding: '3px 10px', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: '600',
  },
  recipeTitle: { fontSize: '1.1rem', fontWeight: '700', margin: '0.5rem 0', color: '#1a1a1a' },
  recipeDesc: { fontSize: '0.875rem', color: '#666', lineHeight: '1.5', marginBottom: '1rem' },
  recipeMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  viewBtn: {
    backgroundColor: '#e74c3c', color: '#fff',
    padding: '6px 14px', borderRadius: '6px',
    fontSize: '0.85rem', fontWeight: '600',
  },
};

export default ChefProfile;