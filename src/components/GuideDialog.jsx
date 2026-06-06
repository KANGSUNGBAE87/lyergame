import React, { useEffect } from 'react';

export default function GuideDialog({ open, title, intro, sections, closeLabel, onClose }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="guide-modal" role="presentation" onClick={onClose}>
      <section
        className="guide-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onClick={event => event.stopPropagation()}
      >
        <div className="guide-panel-head">
          <h2 id="guide-title">{title}</h2>
          <button className="guide-close" type="button" aria-label={closeLabel} onClick={onClose}>
            <span aria-hidden="true">X</span>
          </button>
        </div>
        <p className="guide-intro">{intro}</p>
        <div className="guide-sections">
          {sections.map(section => (
            <section key={section.title} className="guide-section">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
