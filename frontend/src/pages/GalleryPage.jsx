import { useEffect, useMemo, useState } from 'react';
import { ImageCard } from '../components/ImageCard.jsx';
import { imageApi } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';

const filterTags = ['all', 'landscape', 'cyberpunk', 'portrait', 'fantasy'];

export function GalleryPage() {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  async function loadImages() {
    setStatus('loading');
    setError('');

    try {
      const nextImages = await imageApi.list({ keyword, tag: activeTag }, user);
      setImages(nextImages);
      setStatus('ready');
    } catch (nextError) {
      setError(nextError.message);
      setStatus('error');
    }
  }

  useEffect(() => {
    loadImages();
  }, [activeTag]);

  async function handleSearch(event) {
    event.preventDefault();
    await loadImages();
  }

  async function handleLike(imageId) {
    const updatedImage = await imageApi.addLike(imageId);
    setImages((current) =>
      current.map((image) => (String(image.id) === String(updatedImage.id) ? updatedImage : image))
    );
  }

  const summary = useMemo(() => `${images.length} artwork${images.length === 1 ? '' : 's'} available`, [images.length]);

  return (
    <div className="page-stack">
      <section className="toolbar-panel">
        <div className="toolbar-heading">
          <h2>Explore</h2>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search title, tag, prompt, or creator..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" className="secondary-btn">
            Search
          </button>
        </form>

        <div className="toolbar-meta">
          <span>{summary}</span>
          <span>Mode: {import.meta.env.VITE_ENABLE_MOCKS !== 'false' ? 'Mock Ready' : 'Live API'}</span>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <h2>Curated Collection</h2>
          </div>
        </div>

        <section className="filters">
          {filterTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`chip${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag === 'all' ? 'All' : tag}
            </button>
          ))}
        </section>

        {status === 'loading' ? <div className="info-card">Loading gallery...</div> : null}
        {status === 'error' ? <div className="message-box error">{error}</div> : null}
        {status === 'ready' && images.length === 0 ? (
          <div className="empty-panel">
            <h3>No images found</h3>
            <p>Try another keyword or tag, or upload the first example image for this category.</p>
          </div>
        ) : null}

        {status === 'ready' && images.length > 0 ? (
          <section className="gallery-grid">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} onLike={handleLike} />
            ))}
          </section>
        ) : null}
      </section>
    </div>
  );
}
