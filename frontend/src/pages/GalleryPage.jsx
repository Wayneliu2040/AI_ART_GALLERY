import { useEffect, useMemo, useState } from 'react';
import { ImageCard } from '../components/ImageCard.jsx';
import { imageApi } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';

const PAGE_SIZE = 8;
const filterTags = ['all', 'landscape', 'cyberpunk', 'portrait', 'fantasy', 'abstract', 'anime', 'sci-fi', 'architecture', 'nature', 'surreal'];

export function GalleryPage() {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  async function loadImages(page = 1) {
    const nextSkip = (page - 1) * PAGE_SIZE;

    setIsPageLoading(true);
    setStatus('loading');
    setError('');

    try {
      const nextImages = await imageApi.list({ keyword, tag: activeTag, skip: nextSkip, take: PAGE_SIZE }, user);
      setImages(nextImages);
      setCurrentPage(page);
      setHasNextPage(nextImages.length === PAGE_SIZE);
      setStatus('ready');
    } catch (nextError) {
      setError(nextError.message);
      setStatus('error');
    } finally {
      setIsPageLoading(false);
    }
  }

  useEffect(() => {
    loadImages(1);
  }, [activeTag]);

  async function handleSearch(event) {
    event.preventDefault();
    await loadImages(1);
  }

  async function handlePreviousPage() {
    if (currentPage <= 1 || isPageLoading) {
      return;
    }

    await loadImages(currentPage - 1);
  }

  async function handleNextPage() {
    if (!hasNextPage || isPageLoading) {
      return;
    }

    await loadImages(currentPage + 1);
  }

  async function handleLike(imageId) {
    const result = await imageApi.addLike(imageId);
    setImages((current) =>
      current.map((image) =>
        String(image.id) === String(result.imageId)
          ? {
              ...image,
              likes: Number.isInteger(result.likes) ? result.likes : image.likes + 1,
              isLikedByCurrentUser: result.isLikedByCurrentUser ?? true
            }
          : image
      )
    );
  }

  const summary = useMemo(
    () => `${images.length} artwork${images.length === 1 ? '' : 's'} on this page`,
    [images.length]
  );

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
          <>
            <section className="gallery-grid">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} onLike={handleLike} />
              ))}
            </section>

            <div className="pagination-row">
              <button
                type="button"
                className="secondary-btn"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || isPageLoading}
              >
                Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleNextPage}
                disabled={!hasNextPage || isPageLoading}
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
