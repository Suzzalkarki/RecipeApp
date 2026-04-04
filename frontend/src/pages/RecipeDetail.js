import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await API.get(`/recipes/${id}`);
        setRecipe(data);
      } catch (err) {
        setError('Recipe not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div style={styles.centered}>Loading recipe...</div>;
  if (error) return <div style={styles.centered}>{error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back Button */}
        <Link to="/" style={styles.backBtn}>
          ← Back to Home
        </Link>

        {/* Recipe Image */}
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={styles.heroImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        {/* Recipe Header */}
        <div style={styles.header}>
          <div style={styles.badges}>
            <span style={styles.categoryBadge}>{recipe.category}</span>
            <span style={styles.timeBadge}>⏱ {recipe.cookingTime} mins</span>
          </div>

          <h1 style={styles.title}>{recipe.title}</h1>
          <p style={styles.description}>{recipe.description}</p>

          {/* Chef Info */}
          {recipe.chefId && (
            <Link
              to={`/chefs/${recipe.chefId._id}`}
              style={styles.chefLink}
            >
              <div style={styles.chefAvatar}>
                {recipe.chefId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={styles.chefLabel}>Recipe by</p>
                <p style={styles.chefName}>{recipe.chefId.name}</p>
              </div>
            </Link>
          )}
        </div>

        {/* Two Column Layout */}
        <div style={styles.twoCol}>

          {/* Ingredients */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Ingredients</h2>
            <ul style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={styles.ingredientItem}>
                  <span style={styles.bullet}>•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Instructions</h2>
            <div style={styles.instructions}>
              {recipe.instructions}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', backgroundColor: '#f8f9fa' },
  centered: { textAlign: 'center', padding: '4rem', color: '#666' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' },
  backBtn: {
    display: 'inline-block',
    marginBottom: '1.5rem',
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  heroImage: {
    width: '100%',
    height: '380px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  header: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    marginBottom: '1.5rem',
  },
  badges: { display: 'flex', gap: '0.75rem', marginBottom: '1rem' },
  categoryBadge: {
    backgroundColor: '#ffeaea', color: '#e74c3c',
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '0.8rem', fontWeight: '600',
  },
  timeBadge: {
    backgroundColor: '#f0f0f0', color: '#555',
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '0.8rem', fontWeight: '600',
  },
  title: {
    fontSize: '2rem', fontWeight: '700',
    color: '#1a1a1a', marginBottom: '0.75rem',
  },
  description: {
    color: '#555', lineHeight: '1.7',
    fontSize: '1rem', marginBottom: '1.25rem',
  },
  chefLink: {
    display: 'flex', alignItems: 'center',
    gap: '0.75rem', textDecoration: 'none',
    borderTop: '1px solid #f0f0f0', paddingTop: '1rem',
  },
  chefAvatar: {
    width: '44px', height: '44px',
    borderRadius: '50%', backgroundColor: '#e74c3c',
    color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem', fontWeight: '700', flexShrink: 0,
  },
  chefLabel: { fontSize: '0.75rem', color: '#888', marginBottom: '2px' },
  chefName: { fontSize: '0.95rem', fontWeight: '600', color: '#1a1a1a' },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '1.5rem',
  },
  section: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '1.2rem', fontWeight: '700',
    color: '#1a1a1a', marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #ffeaea',
  },
  ingredientsList: { listStyle: 'none', padding: 0 },
  ingredientItem: {
    display: 'flex', gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f8f8f8',
    fontSize: '0.95rem', color: '#444',
  },
  bullet: { color: '#e74c3c', fontWeight: '700' },
  instructions: {
    color: '#444', lineHeight: '1.8',
    fontSize: '0.95rem', whiteSpace: 'pre-line',
  },
};

export default RecipeDetail;