export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="hero-panel">
      <div>
        {eyebrow ? <span className="section-tag">{eyebrow}</span> : null}
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="hero-actions">{actions}</div> : null}
    </section>
  );
}
