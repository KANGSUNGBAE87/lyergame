import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RoundHighlightRow from '../src/components/RoundHighlightRow.jsx';

describe('RoundHighlightRow', () => {
  it('renders a visual badge alongside the highlight text', () => {
    const html = renderToStaticMarkup(React.createElement(RoundHighlightRow, {
      type: 'suspicious',
      label: '가장 의심받은 사람',
      value: '333(3번) · 2표',
    }));

    expect(html).toContain('highlight-icon suspicious');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('가장 의심받은 사람');
    expect(html).toContain('333(3번) · 2표');
  });
});
