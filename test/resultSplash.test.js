import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ResultSplash from '../src/components/ResultSplash.jsx';

describe('ResultSplash', () => {
  it('renders a graphic reveal mark instead of visible tada text', () => {
    const html = renderToStaticMarkup(React.createElement(ResultSplash, {
      label: '결과 공개',
    }));

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="결과 공개"');
    expect(html).toContain('result-splash-art');
    expect(html).not.toContain('짜잔');
    expect(html).not.toContain('Ta-da');
  });
});
