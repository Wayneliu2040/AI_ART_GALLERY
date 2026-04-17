import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader.jsx';
import { commentApi, imageApi } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';
import { formatDate } from '../utils/format.js';

export function ImageDetailPage() {
  const { imageId } = useParams();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDetail() {
      setStatus('loading');
      setError('');

      try {
        const [nextImage, nextComments] = await Promise.all([
          imageApi.getById(imageId),
          commentApi.list(imageId)
        ]);
        setImage(nextImage);
        setComments(nextComments);
        setStatus('ready');
      } catch (nextError) {
        setError(nextError.message);
        setStatus('error');
      }
    }

    loadDetail();
  }, [imageId]);

  async function handleLike() {
    const nextImage = await imageApi.addLike(imageId);
    setImage(nextImage);
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!commentDraft.trim()) {
      return;
    }

    const createdComment = await commentApi.create(imageId, commentDraft.trim(), user);
    setComments((current) => [createdComment, ...current]);
    setCommentDraft('');
    const nextImage = await imageApi.getById(imageId);
    setImage(nextImage);
  }

  if (status === 'loading') {
    return <div className="info-card">Loading artwork details...</div>;
  }

  if (status === 'error') {
    return <div className="message-box error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Image Detail"
        title={image.title}
        description="Review metadata, test interaction features, and verify the detail-page workflow that will be backed by Azure SQL and Blob data."
      />

      <section className="detail-grid">
        <div className="detail-visual">
          <img src={image.imageUrl} alt={image.title} className="detail-image" />
        </div>

        <div className="detail-panel">
          <div className="detail-header">
            <span className="tag-pill">{image.tag}</span>
            <span className="detail-date">{formatDate(image.createdAt)}</span>
          </div>

          <p className="detail-description">{image.description}</p>

          <div className="detail-meta-grid">
            <div>
              <span className="meta-label">Creator</span>
              <span className="meta-value">{image.authorName}</span>
            </div>
            <div>
              <span className="meta-label">Platform</span>
              <span className="meta-value">{image.platform}</span>
            </div>
            <div>
              <span className="meta-label">Likes</span>
              <span className="meta-value">{image.likes}</span>
            </div>
            <div>
              <span className="meta-label">Comments</span>
              <span className="meta-value">{comments.length}</span>
            </div>
          </div>

          <div className="prompt-box prompt-box--detail">
            <h3>Prompt</h3>
            <p>{image.prompt}</p>
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={handleLike}>
              Like This Image
            </button>
          </div>
        </div>
      </section>

      <section className="comments-panel">
        <div className="comments-header">
          <h3>Comments</h3>
          <p>Use this area to validate your `POST /api/images/:id/comments` integration.</p>
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value)}
            rows="4"
            placeholder="Write a comment about this image..."
          />
          <button type="submit" className="secondary-btn">
            Post Comment
          </button>
        </form>

        <div className="comment-list">
          {comments.length === 0 ? (
            <div className="empty-panel">
              <h3>No comments yet</h3>
              <p>Be the first person to test the comment flow for this artwork.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="comment-card">
                <div className="comment-card__top">
                  <strong>{comment.authorName}</strong>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p>{comment.content}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
