import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const { chef, updateChef } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const timerRef = useRef(null);

  // Add recipe
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', ingredients: '',
    instructions: '', cookingTime: '', category: 'Other', image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Edit recipe
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Profile edit
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    name: chef.name, bio: chef.bio || '', profileImage: chef.profileImage || '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const { data } = await API.get(`/chefs/${chef._id}`);
        setRecipes(data.recipes);
      } catch (err) {
        setError('Failed to load your recipes.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyRecipes();
  }, [chef._id]);

  const showSuccess = (msg) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSuccessMsg(msg);
    timerRef.current = setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title || !formData.description || !formData.ingredients || !formData.instructions)
      return setFormError('Please fill all required fields');

    try {
      setFormLoading(true);
      let imageUrl = formData.image;

      if (imageFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const { data: uploadResult } = await API.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResult.url;
        setUploading(false);
      }

      const ingredientsArray = formData.ingredients.split(',').map(i => i.trim()).filter(i => i !== '');
      if (ingredientsArray.length === 0) return setFormError('Please add at least one ingredient');

      const { data } = await API.post('/recipes', {
        ...formData, image: imageUrl, ingredients: ingredientsArray,
        cookingTime: Number(formData.cookingTime) || 0,
      });

      setRecipes([data, ...recipes]);
      showSuccess('Recipe added successfully! 🎉');
      setFormData({ title: '', description: '', ingredients: '', instructions: '', cookingTime: '', category: 'Other', image: '' });
      setImageFile(null);
      setImagePreview('');
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add recipe');
      setUploading(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await API.delete(`/recipes/${recipeId}`);
      setRecipes(recipes.filter(r => r._id !== recipeId));
      showSuccess('Recipe deleted.');
    } catch (err) {
      alert('Failed to delete recipe.');
    }
  };

  const handleEditClick = (recipe) => {
    setEditingId(recipe._id);
    setEditError('');
    setEditImageFile(null);
    setEditImagePreview('');
    setEditData({
      title: recipe.title, description: recipe.description,
      ingredients: recipe.ingredients.join(', '),
      instructions: recipe.instructions, cookingTime: recipe.cookingTime,
      category: recipe.category, image: recipe.image || '',
    });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setEditImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e, recipeId) => {
    e.preventDefault();
    setEditError('');
    try {
      setEditLoading(true);
      let imageUrl = editData.image;
      if (editImageFile) {
        const uploadData = new FormData();
        uploadData.append('image', editImageFile);
        const { data: uploadResult } = await API.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResult.url;
      }
      const ingredientsArray = editData.ingredients.split(',').map(i => i.trim()).filter(i => i !== '');
      const { data } = await API.put(`/recipes/${recipeId}`, {
        ...editData, image: imageUrl, ingredients: ingredientsArray,
        cookingTime: Number(editData.cookingTime) || 0,
      });
      setRecipes(recipes.map(r => r._id === recipeId ? data : r));
      setEditingId(null);
      showSuccess('Recipe updated! ✨');
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update recipe');
    } finally {
      setEditLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    try {
      setProfileLoading(true);
      let imageUrl = profileData.profileImage;
      if (profileImageFile) {
        const uploadData = new FormData();
        uploadData.append('image', profileImageFile);
        const { data: uploadResult } = await API.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResult.url;
      }
      const { data } = await API.put(`/chefs/${chef._id}`, { ...profileData, profileImage: imageUrl });
      updateChef({ name: data.name, bio: data.bio, profileImage: data.profileImage });
      showSuccess('Profile updated! 🌟');
      setShowProfileForm(false);
      setProfileImageFile(null);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── PROFILE SECTION AT TOP ── */}
        <div style={styles.profileCard}>
          <div style={styles.profileCardGlow} />
          <div style={styles.profileCardInner}>
            {/* Avatar */}
            <div style={styles.profileAvatarWrapper}>
              {chef.profileImage ? (
                <img src={chef.profileImage} alt={chef.name} style={styles.profileAvatar} />
              ) : (
                <div style={styles.profileAvatarFallback}>
                  {chef.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={styles.profileOnlineDot} />
            </div>

            {/* Info */}
            <div style={styles.profileDetails}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 style={styles.profileName}>{chef.name}</h1>
                <span className="badge-green">👨‍🍳 Chef</span>
              </div>
              <p style={styles.profileEmail}>{chef.email}</p>
              <p style={styles.profileBio}>{chef.bio || 'Add a bio to tell food lovers about yourself!'}</p>
              <div style={styles.profileStat}>
                <span style={styles.profileStatNum}>{recipes.length}</span>
                <span style={styles.profileStatLbl}>Recipes Published</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setShowProfileForm(!showProfileForm)}
              style={styles.editProfileBtn}
            >
              {showProfileForm ? '✕ Cancel' : '✎ Edit Profile'}
            </button>
          </div>

          {/* Edit Profile Form */}
          {showProfileForm && (
            <div style={styles.profileForm}>
              <div style={styles.profileFormDivider} />
              {profileError && <div style={styles.formError}>{profileError}</div>}
              <form onSubmit={handleProfileUpdate}>
                <div style={styles.profileFormGrid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Name</label>
                    <input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-dark"
                      placeholder="Your name"
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Profile Image</label>
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setProfileImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setProfileImagePreview(reader.result);
                        reader.readAsDataURL(file);
                      }}
                      style={styles.fileInput}
                    />
                    <input
                      value={profileData.profileImage}
                      onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                      className="input-dark"
                      placeholder="Or paste image URL..."
                      style={{ marginTop: '0.5rem' }}
                    />
                    {(profileImagePreview || profileData.profileImage) && (
                      <img
                        src={profileImagePreview || profileData.profileImage}
                        alt="preview"
                        style={styles.profilePreview}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="input-dark"
                    rows={2}
                    placeholder="Tell food lovers about yourself..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" disabled={profileLoading} className="btn-primary" style={{ marginTop: '0.5rem', opacity: profileLoading ? 0.7 : 1 }}>
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── SUCCESS MESSAGE ── */}
        {successMsg && (
          <div style={styles.successMsg}>
            ✓ {successMsg}
          </div>
        )}

        {/* ── MY RECIPES SECTION ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>My Recipes</h2>
              <p style={styles.sectionCount}>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} published</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
              {showForm ? '✕ Cancel' : '+ New Recipe'}
            </button>
          </div>

          {/* Add Recipe Form */}
          {showForm && (
            <div style={styles.formCard}>
              <h3 style={styles.formCardTitle}>Add New Recipe</h3>
              {formError && <div style={styles.formError}>{formError}</div>}
              <form onSubmit={handleAddRecipe}>
                <div style={styles.formGrid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Title *</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="input-dark" placeholder="Recipe title" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input-dark" style={styles.selectDark}>
                      {['Breakfast','Lunch','Dinner','Dessert','Snack','Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Cooking Time (mins)</label>
                    <input type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} className="input-dark" placeholder="30" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
                    <input name="image" value={formData.image} onChange={handleChange} className="input-dark" placeholder="Or paste URL..." style={{ marginTop: '0.5rem' }} />
                    {(imagePreview || formData.image) && (
                      <img src={imagePreview || formData.image} alt="preview"
                        style={styles.imgPreview}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="input-dark" rows={2} placeholder="Brief description..." style={{ resize: 'vertical' }} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Ingredients * (comma separated)</label>
                  <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} className="input-dark" rows={3} placeholder="Salt, pepper, olive oil..." style={{ resize: 'vertical' }} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Instructions *</label>
                  <textarea name="instructions" value={formData.instructions} onChange={handleChange} className="input-dark" rows={5} placeholder="Step 1: ..." style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={formLoading || uploading} className="btn-primary" style={{ opacity: (formLoading || uploading) ? 0.7 : 1 }}>
                  {uploading ? 'Uploading...' : formLoading ? 'Adding...' : '+ Add Recipe'}
                </button>
              </form>
            </div>
          )}

          {/* Recipes List */}
          {loading && <p style={styles.muted}>Loading your recipes...</p>}
          {error && <p style={styles.errorText}>{error}</p>}

          {!loading && recipes.length === 0 && !showForm && (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>🍳</p>
              <p style={styles.emptyTitle}>No recipes yet</p>
              <p style={styles.emptyText}>Click "+ New Recipe" to share your first recipe!</p>
            </div>
          )}

          <div style={styles.recipesList}>
            {recipes.map((recipe) => (
              <div key={recipe._id}>
                {/* Recipe Row */}
                <div style={styles.recipeRow}>
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} style={styles.thumbnail}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={styles.thumbnailFallback}>🍽️</div>
                  )}

                  <div style={styles.recipeInfo}>
                    <h3 style={styles.recipeName}>{recipe.title}</h3>
                    <div style={styles.recipeMeta}>
                      <span style={styles.recipeCat}>{recipe.category}</span>
                      <span style={styles.recipeMuted}>⏱ {recipe.cookingTime} mins</span>
                      <span style={styles.recipeMuted}>{recipe.ingredients.length} ingredients</span>
                    </div>
                  </div>

                  <div style={styles.recipeActions}>
                    <button
                      onClick={() => editingId === recipe._id ? setEditingId(null) : handleEditClick(recipe)}
                      style={styles.editBtn}
                    >
                      {editingId === recipe._id ? 'Cancel' : 'Edit'}
                    </button>
                    <button onClick={() => handleDelete(recipe._id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Inline Edit Form */}
                {editingId === recipe._id && (
                  <div style={styles.editForm}>
                    <h4 style={styles.editFormTitle}>✎ Editing: {recipe.title}</h4>
                    {editError && <div style={styles.formError}>{editError}</div>}
                    <form onSubmit={(e) => handleEditSubmit(e, recipe._id)}>
                      <div style={styles.formGrid}>
                        <div style={styles.field}>
                          <label style={styles.label}>Title</label>
                          <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="input-dark" />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Category</label>
                          <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} className="input-dark" style={styles.selectDark}>
                            {['Breakfast','Lunch','Dinner','Dessert','Snack','Other'].map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Cooking Time</label>
                          <input type="number" value={editData.cookingTime} onChange={(e) => setEditData({ ...editData, cookingTime: e.target.value })} className="input-dark" />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Image</label>
                          <input type="file" accept="image/*" onChange={handleEditImageChange} style={styles.fileInput} />
                          <input value={editData.image} onChange={(e) => setEditData({ ...editData, image: e.target.value })} className="input-dark" placeholder="Or paste URL..." style={{ marginTop: '0.5rem' }} />
                          {(editImagePreview || editData.image) && (
                            <img src={editImagePreview || editData.image} alt="preview" style={styles.imgPreview} onError={(e) => { e.target.style.display = 'none'; }} />
                          )}
                        </div>
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Description</label>
                        <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="input-dark" rows={2} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Ingredients (comma separated)</label>
                        <textarea value={editData.ingredients} onChange={(e) => setEditData({ ...editData, ingredients: e.target.value })} className="input-dark" rows={2} style={{ resize: 'vertical' }} />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Instructions</label>
                        <textarea value={editData.instructions} onChange={(e) => setEditData({ ...editData, instructions: e.target.value })} className="input-dark" rows={4} style={{ resize: 'vertical' }} />
                      </div>
                      <button type="submit" disabled={editLoading} className="btn-primary" style={{ opacity: editLoading ? 0.7 : 1 }}>
                        {editLoading ? 'Saving...' : 'Save Changes ✓'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: 'calc(100vh - 70px)', backgroundColor: '#0a0a0a', paddingBottom: '4rem' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },

  // Profile Card
  profileCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  profileCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
  },
  profileCardInner: {
    padding: '2rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  profileAvatarWrapper: { position: 'relative', flexShrink: 0 },
  profileAvatar: {
    width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover',
    border: '2px solid rgba(16,185,129,0.4)',
    boxShadow: '0 0 20px rgba(16,185,129,0.15)',
  },
  profileAvatarFallback: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2.2rem', fontWeight: '700',
    border: '2px solid rgba(16,185,129,0.4)',
    boxShadow: '0 0 20px rgba(16,185,129,0.15)',
  },
  profileOnlineDot: {
    position: 'absolute', bottom: '4px', right: '4px',
    width: '14px', height: '14px', borderRadius: '50%',
    backgroundColor: '#10b981', border: '2px solid #0a0a0a',
    boxShadow: '0 0 8px #10b981',
  },
  profileDetails: { flex: 1 },
  profileName: { fontSize: '1.6rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' },
  profileEmail: { color: 'rgba(255,255,255,0.35)', fontSize: '0.825rem', marginBottom: '0.5rem', fontWeight: '400' },
  profileBio: { color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem', fontWeight: '400' },
  profileStat: { display: 'flex', alignItems: 'baseline', gap: '0.5rem' },
  profileStatNum: { fontSize: '1.5rem', fontWeight: '800', color: '#10b981' },
  profileStatLbl: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
  editProfileBtn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)', padding: '8px 18px', borderRadius: '50px',
    cursor: 'pointer', fontSize: '0.825rem', fontWeight: '600',
    fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s', alignSelf: 'flex-start',
  },
  profileForm: { padding: '0 2rem 2rem' },
  profileFormDivider: { height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' },
  profileFormGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  profilePreview: { marginTop: '0.5rem', width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(16,185,129,0.4)' },

  // Success
  successMsg: {
    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
    color: '#10b981', padding: '12px 20px', borderRadius: '12px',
    fontSize: '0.875rem', fontWeight: '600',
  },

  // Section
  section: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px', padding: '2rem',
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '1.5rem',
  },
  sectionTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px' },
  sectionCount: { color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: '0.2rem' },
  addBtn: {
    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
    border: 'none', padding: '10px 20px', borderRadius: '50px',
    fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem',
    fontFamily: 'Poppins, sans-serif', boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
    whiteSpace: 'nowrap',
  },

  // Form Card
  formCard: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
  },
  formCardTitle: { fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', letterSpacing: '-0.2px' },
  formError: {
    background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
    color: '#f87171', padding: '10px 14px', borderRadius: '10px',
    marginBottom: '1rem', fontSize: '0.825rem',
  },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' },
  label: { fontSize: '0.72rem', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase' },
  fileInput: { color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' },
  imgPreview: { marginTop: '0.5rem', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' },
  selectDark: { backgroundColor: '#111', color: '#fff' },

  // Empty
  emptyState: { textAlign: 'center', padding: '3rem 0' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  emptyTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#fff', marginBottom: '0.4rem' },
  emptyText: { color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' },

  muted: { color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' },
  errorText: { color: '#f87171', fontSize: '0.875rem' },

  // Recipe List
  recipesList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  recipeRow: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1rem', borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
    transition: 'border-color 0.2s',
  },
  thumbnail: { width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 },
  thumbnailFallback: {
    width: '60px', height: '60px', borderRadius: '10px',
    background: 'rgba(16,185,129,0.08)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
  },
  recipeInfo: { flex: 1, minWidth: 0 },
  recipeName: { fontSize: '0.95rem', fontWeight: '600', color: '#fff', marginBottom: '0.35rem', letterSpacing: '-0.2px' },
  recipeMeta: { display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' },
  recipeCat: {
    background: 'rgba(16,185,129,0.15)', color: '#10b981',
    border: '1px solid rgba(16,185,129,0.25)',
    padding: '2px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '700',
    letterSpacing: '0.3px', textTransform: 'uppercase',
  },
  recipeMuted: { color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: '500' },
  recipeActions: { display: 'flex', gap: '0.5rem', flexShrink: 0 },
  editBtn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '50px',
    cursor: 'pointer', fontSize: '0.775rem', fontWeight: '600', fontFamily: 'Poppins, sans-serif',
  },
  deleteBtn: {
    background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
    color: '#f87171', padding: '6px 14px', borderRadius: '50px',
    cursor: 'pointer', fontSize: '0.775rem', fontWeight: '600', fontFamily: 'Poppins, sans-serif',
  },

  // Edit Form
  editForm: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
    borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '1.25rem',
    marginBottom: '0.25rem',
  },
  editFormTitle: { fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' },
};

export default Dashboard;