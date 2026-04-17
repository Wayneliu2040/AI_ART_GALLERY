import { useEffect, useState } from 'react';
import { imageApi } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';
import { formatDate } from '../utils/format.js';

const initialState = {
  title: '',
  tag: 'landscape',
  platform: 'Azure OpenAI + Prompt Workflow',
  description: '',
  prompt: '',
  file: null
};

const tagOptions = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'anime', label: 'Anime' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'nature', label: 'Nature' },
  { value: 'surreal', label: 'Surreal' }
];

export function UploadPage() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialState);
  const [submitState, setSubmitState] = useState('idle');

  useEffect(() => {
    async function loadImages() {
      setStatus('loading');
      setError('');

      try {
        const nextImages = await imageApi.list({ onlyMine: true }, user);
        setImages(nextImages);
        setStatus('ready');
      } catch (nextError) {
        setError(nextError.message);
        setStatus('error');
      }
    }

    loadImages();
  }, [user]);

  function openModal() {
    setError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setForm(initialState);
    setSubmitState('idle');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState('submitting');
    setError('');

    try {
      const created = await imageApi.upload(form, user);
      setImages((current) => [created, ...current]);
      closeModal();
    } catch (nextError) {
      setError(nextError.message);
      setSubmitState('error');
    }
  }

  return (
    <div className="page-stack">
      <section className="content-panel">
        <div className="section-heading">
          <div>
            <span className="section-tag">Upload Image</span>
            <h2>Your Uploaded Images</h2>
          </div>
          <span className="upload-summary-count">{images.length} image{images.length === 1 ? '' : 's'}</span>
        </div>

        {status === 'loading' ? <div className="info-card">Loading your uploaded images...</div> : null}
        {status === 'error' ? <div className="message-box error">{error}</div> : null}

        {status === 'ready' && images.length === 0 ? (
          <div className="empty-panel">
            <h3>No uploads yet</h3>
            <p>You have not uploaded any images yet.</p>
          </div>
        ) : null}

        {status === 'ready' && images.length > 0 ? (
          <section className="upload-preview-grid">
            {images.map((image) => (
              <article key={image.id} className="upload-preview-card">
                <img src={image.imageUrl} alt={image.title} className="upload-preview-card__image" />
                <div className="upload-preview-card__body">
                  <h3>{image.title}</h3>
                  <p>{formatDate(image.createdAt)}</p>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </section>

      <section className="upload-callout">
        <div>
          <span className="section-tag">Share</span>
          <h2>Share your AI artwork</h2>
          <p>Upload a new image and add the metadata that will later be stored in Azure SQL Database and Azure Blob Storage.</p>
        </div>
        <button type="button" className="primary-btn" onClick={openModal}>
          Upload
        </button>
      </section>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="modal-panel" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-tag">Upload Form</span>
                <h2>Upload a new AI artwork</h2>
              </div>
              <button type="button" className="ghost-btn" onClick={closeModal}>
                Close
              </button>
            </div>

            <form className="stack-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label htmlFor="upload-title">Title</label>
                  <input
                    id="upload-title"
                    type="text"
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Crimson Nebula Garden"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="upload-tag">Tag</label>
                  <select
                    id="upload-tag"
                    value={form.tag}
                    onChange={(event) => setForm((current) => ({ ...current, tag: event.target.value }))}
                  >
                    {tagOptions.map((tag) => (
                      <option key={tag.value} value={tag.value}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="upload-platform">Platform</label>
                  <input
                    id="upload-platform"
                    type="text"
                    value={form.platform}
                    onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))}
                    placeholder="DALL·E"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="upload-file">Image file</label>
                  <div className="file-input-shell">
                    <input
                      id="upload-file"
                      className="file-input-native"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          file: event.target.files?.[0] || null
                        }))
                      }
                      required
                    />
                    <label htmlFor="upload-file" className="file-input-trigger">
                      Choose File
                    </label>
                    <span className="file-input-name">{form.file ? form.file.name : 'No file selected'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="upload-description">Description</label>
                <textarea
                  id="upload-description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Describe the mood, composition, and intended use of this image."
                  rows="4"
                  required
                />
              </div>

              <div>
                <label htmlFor="upload-prompt">Prompt</label>
                <textarea
                  id="upload-prompt"
                  value={form.prompt}
                  onChange={(event) => setForm((current) => ({ ...current, prompt: event.target.value }))}
                  placeholder="Paste the generation prompt here..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn" disabled={submitState === 'submitting'}>
                  {submitState === 'submitting' ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>

            {error ? <div className="message-box error">{error}</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
