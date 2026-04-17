import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format.js';

export function ImageCard({ image, onLike }) {
  return (
    <article className="image-card">
      <img className="card-image" src={image.imageUrl} alt={image.title} />

      <div className="card-body">
        <div className="card-top">
          <div>
            <h3 className="card-title">{image.title}</h3>
            <p className="card-author">by {image.authorName}</p>
          </div>
          <span className="tag-pill">{image.tag}</span>
        </div>

        <p className="card-description">{image.description}</p>

        <div className="meta-grid">
          <div>
            <span className="meta-label">Platform</span>
            <span className="meta-value">{image.platform}</span>
          </div>
          <div>
            <span className="meta-label">Created</span>
            <span className="meta-value">{formatDate(image.createdAt)}</span>
          </div>
          <div>
            <span className="meta-label">Likes</span>
            <span className="meta-value">{image.likes}</span>
          </div>
          <div>
            <span className="meta-label">Comments</span>
            <span className="meta-value">{image.commentsCount || 0}</span>
          </div>
        </div>

        <details className="prompt-box">
          <summary>Prompt</summary>
          <p>{image.prompt}</p>
        </details>

        <div className="card-actions card-actions--spaced">
          <button type="button" className="secondary-btn" onClick={() => onLike(image.id)}>
            Like
          </button>
          <Link className="ghost-btn ghost-btn--link" to={`/images/${image.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
