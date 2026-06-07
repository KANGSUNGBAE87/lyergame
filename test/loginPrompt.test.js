import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LoginPrompt from '../src/components/LoginPrompt.jsx';

describe('LoginPrompt', () => {
  it('renders optional login copy without blocking guest play', () => {
    const html = renderToStaticMarkup(React.createElement(LoginPrompt, {
      eyebrow: '선택 로그인',
      title: '기록을 안전하게 보관하세요',
      body: '로그인하면 기기 변경 후에도 기록을 이어갈 수 있습니다.',
      ctaLabel: '로그인',
      statusText: '현재 빌드는 게스트 모드입니다.',
      onLogin: () => {},
    }));

    expect(html).toContain('account-prompt');
    expect(html).toContain('선택 로그인');
    expect(html).toContain('기록을 안전하게 보관하세요');
    expect(html).toContain('로그인하면 기기 변경 후에도 기록을 이어갈 수 있습니다.');
    expect(html).toContain('로그인');
  });
});
