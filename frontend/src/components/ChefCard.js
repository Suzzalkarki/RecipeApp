import { Link } from 'react-router-dom';

const ChefCard = ({ chef }) => {
  return (
    // ✅ Added className for hover effect
    <div style={styles.card} className="hover-lift">
      <div style={styles.imageContainer}>
        {chef.profileImage ? (
          <img
            src={chef.profileImage}
            alt={chef.name}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=Chef';
            }}
          />
        ) : (
          <div style={styles.avatar}>
            {chef.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{chef.name}</h3>
        <p style={styles.bio}>
          {chef.bio
            ? chef.bio.length > 100
              ? chef.bio.substring(0, 100) + '...'
              : chef.bio
            : 'Passionate chef sharing amazing recipes.'}
        </p>
      </div>

      <Link to={`/chefs/${chef._id}`} style={styles.button}>
        View Profile →
      </Link>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
    gap: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  info: {
    textAlign: 'center',
    flex: 1,
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
  },
  bio: {
    fontSize: '0.875rem',
    color: '#666',
    lineHeight: '1.5',
  },
  button: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
    textAlign: 'center',
    width: '100%',
  },
};

export default ChefCard;