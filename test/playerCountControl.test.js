import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PlayerCountControl from '../src/components/PlayerCountControl.jsx';

describe('PlayerCountControl', () => {
  it('shows player count as a prominent stepper with quick presets', () => {
    const html = renderToStaticMarkup(React.createElement(PlayerCountControl, {
      value: 6,
      min: 3,
      max: 12,
      presets: [3, 4, 5, 6, 8, 10, 12],
      label: '인원수',
      help: '3명부터 12명까지 플레이할 수 있습니다.',
      valueLabel: '6명',
      decreaseLabel: '인원수 줄이기',
      increaseLabel: '인원수 늘리기',
      presetLabel: value => `${value}명으로 설정`,
      onChange: () => {},
    }));

    expect(html).toContain('인원수');
    expect(html).toContain('6명');
    expect(html).toContain('aria-label="인원수 줄이기"');
    expect(html).toContain('aria-label="인원수 늘리기"');
    expect(html).toContain('3명으로 설정');
    expect(html).toContain('12명으로 설정');
    expect(html).not.toContain('type="range"');
  });
});
