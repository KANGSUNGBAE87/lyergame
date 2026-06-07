import React, { useState } from 'react';

export default function LoginPrompt({
  eyebrow,
  title,
  body,
  ctaLabel,
  statusText,
  onLogin,
  compact = false,
}) {
  const [notice, setNotice] = useState('');

  const requestLogin = async () => {
    const result = await onLogin?.();
    if (!result?.ok && statusText) {
      setNotice(statusText);
    }
  };

  return (
    <section className={compact ? 'account-prompt compact' : 'account-prompt'}>
      <span className="account-eyebrow">{eyebrow}</span>
      <div className="account-copy">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      <button className="ghost-btn compact" type="button" onClick={requestLogin}>
        {ctaLabel}
      </button>
      {notice ? <p className="account-status" role="status">{notice}</p> : null}
    </section>
  );
}
