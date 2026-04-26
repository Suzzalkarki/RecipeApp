import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChefCard = ({ chef }) => {
  const { chef: loggedInUser } = useAuth();

  if (!chef || !chef.name) return null;

  return (
    <div style={styles.card} className="hover-lift">
      {/* Green top accent line */}
      <div style={styles.topAccent} />

      {/* Avatar */}
      <div style={styles.avatarWrapper}>
        {chef.profileImage ? (
          <img
            src={chef.profileImage}
            alt={chef.name}
            style={styles.avatar}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={styles.avatarFallback}>
            {chef.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div style={styles.onlineDot} />
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.name}>{chef.name}</h3>
        <p style={styles.bio}>
          {chef.bio
            ? chef.bio.length > 90
              ? chef.bio.substring(0, 90) + '...'
              : chef.bio
            : 'Passionate about creating extraordinary culinary experiences.'}
        </p>
      </div>

      {/* Footer */}
      <div style={styles.cardFooter}>
        {loggedInUser ? (
          <Link to={`/chefs/${chef._id}`} style={styles.viewBtn}>
            View Profile <span style={styles.arrow}>→</span>
          </Link>
        ) : (
          <Link to="/login" style={styles.lockBtn}>
            🔒 Please Signup
          </Link>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1.5rem 1.5rem',
    gap: '1rem',
    cursor: 'pointer',
    position: 'relative',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
    borderRadius: '0 0 4px 4px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '90px',
    height: '90px',
  },
  avatar: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(16,185,129,0.4)',
  },
  avatarFallback: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '700',
    border: '2px solid rgba(16,185,129,0.4)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    border: '2px solid #0a0a0a',
    boxShadow: '0 0 8px #10b981',
  },
  info: {
    textAlign: 'center',
    flex: 1,
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem',
    letterSpacing: '-0.3px',
  },
  bio: {
    fontSize: '0.825rem',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  cardFooter: {
    width: '100%',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '1rem',
  },
  viewBtn: {
    display: 'block',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '0.875rem',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 15px rgba(16,185,129,0.25)',
    transition: 'all 0.3s',
  },
  lockBtn: {
    display: 'block',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.5)',
    padding: '10px 20px',
    borderRadius: '50px',
    fontWeight: '500',
    fontSize: '0.875rem',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  arrow: { marginLeft: '4px' },
};

export default ChefCard;