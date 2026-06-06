import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GuideDialog from '../src/components/GuideDialog.jsx';

const guideProps = {
  open: true,
  title: '게임 방법',
  closeLabel: '닫기',
  intro: '시민은 같은 제시어를 보고 라이어를 찾아냅니다.',
  sections: [
    {
      title: '목표',
      items: [
        '시민은 라이어를 찾아내면 승리합니다.',
        '라이어는 들키지 않거나 제시어를 맞히면 승리합니다.',
      ],
    },
  ],
  onClose: () => {},
};

describe('GuideDialog', () => {
  it('renders a modal reading surface when open', () => {
    const html = renderToStaticMarkup(React.createElement(GuideDialog, guideProps));

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('게임 방법');
    expect(html).toContain('목표');
    expect(html).toContain('시민은 라이어를 찾아내면 승리합니다.');
    expect(html).toContain('aria-label="닫기"');
  });

  it('renders nothing when closed', () => {
    const html = renderToStaticMarkup(React.createElement(GuideDialog, { ...guideProps, open: false }));

    expect(html).toBe('');
  });
});
