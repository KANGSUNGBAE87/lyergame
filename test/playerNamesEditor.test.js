import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PlayerNamesEditor from '../src/components/PlayerNamesEditor.jsx';

describe('PlayerNamesEditor', () => {
  it('renders a visible disclosure affordance for the optional name fields', () => {
    const html = renderToStaticMarkup(React.createElement(PlayerNamesEditor, {
      playerCount: 3,
      playerNames: ['', '', ''],
      label: '이름 입력',
      summary: '입력한 이름으로 진행',
      help: '선택 사항입니다.',
      closedLabel: '펼치기',
      openLabel: '접기',
      placeholderLabel: num => `${num}번 이름`,
      clearLabel: '이름 모두 지우기',
      onChange: () => {},
      onClear: () => {},
    }));

    expect(html).toContain('name-summary-main');
    expect(html).toContain('summary-chevron');
    expect(html).toContain('펼치기');
  });
});
