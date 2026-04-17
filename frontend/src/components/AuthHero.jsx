export function AuthHero({ badge, title, subtitle, highlights }) {
  return (
    <section className="brand-panel">
      <div className="brand-badge">{badge}</div>
      <h1>{title}</h1>
      <p className="brand-subtitle">{subtitle}</p>

      <div className="feature-list">
        {highlights.map((item) => (
          <article key={item.title} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
