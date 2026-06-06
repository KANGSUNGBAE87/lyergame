import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PeekModal from '../src/components/PeekModal.jsx';
import { I18nProvider } from '../src/i18n/I18nProvider.jsx';

function renderPeekModal(props) {
  return renderToStaticMarkup(
    React.createElement(
      I18nProvider,
      null,
      React.createElement(PeekModal, {
        active: true,
        isLiar: false,
        category: '디저트',
        word: '요거트',
        liarHint: true,
        ...props,
      }),
    ),
  );
}

describe('PeekModal', () => {
  it('does not render the secret word while inactive', () => {
    const html = renderPeekModal({ active: false });

    expect(html).toBe('');
  });

  it('renders the secret word when active for a citizen', () => {
    const html = renderPeekModal({});

    expect(html).toContain('디저트');
    expect(html).toContain('요거트');
  });

  it('shows category to a liar only when category hint is enabled', () => {
    const withHint = renderPeekModal({ isLiar: true, liarHint: true });
    const withoutHint = renderPeekModal({ isLiar: true, liarHint: false });

    expect(withHint).toContain('카테고리: 디저트');
    expect(withHint).not.toContain('요거트');
    expect(withoutHint).not.toContain('카테고리: 디저트');
    expect(withoutHint).not.toContain('요거트');
  });
});
