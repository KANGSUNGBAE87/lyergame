import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ReversalOutcomeStep from '../src/components/ReversalOutcomeStep.jsx';

const labels = {
  handoffTitle: '지목된 라이어에게 넘겨주세요',
  handoffHelp: '{players} 라이어가 결과를 확인합니다.',
  handoffCta: '라이어는 결과 확인하기',
  correctTitle: '맞습니다!',
  wrongTitle: '틀렸습니다!',
  correctHelp: '라이어가 제시어를 맞혔습니다.',
  wrongHelp: '라이어가 제시어를 맞히지 못했습니다.',
  answerCta: '정답 확인하기',
  answerTitle: '정답 확인',
  answerLabel: '정답',
  resultCta: '라운드 결과 보기',
};

describe('ReversalOutcomeStep', () => {
  it('asks the group to hand the phone to the caught liar without showing the answer', () => {
    const html = renderToStaticMarkup(React.createElement(ReversalOutcomeStep, {
      step: 'handoff',
      success: true,
      caughtPlayers: '333(3번)',
      word: '오븐',
      categoryText: '카테고리: 가전제품',
      labels,
      onNext: () => {},
    }));

    expect(html).toContain('지목된 라이어에게 넘겨주세요');
    expect(html).toContain('333(3번) 라이어가 결과를 확인합니다.');
    expect(html).toContain('라이어는 결과 확인하기');
    expect(html).not.toContain('오븐');
  });

  it('shows whether the liar guess was correct before revealing the answer', () => {
    const html = renderToStaticMarkup(React.createElement(ReversalOutcomeStep, {
      step: 'judgment',
      success: false,
      caughtPlayers: '333(3번)',
      word: '오븐',
      categoryText: '카테고리: 가전제품',
      labels,
      onNext: () => {},
    }));

    expect(html).toContain('틀렸습니다!');
    expect(html).toContain('라이어가 제시어를 맞히지 못했습니다.');
    expect(html).toContain('정답 확인하기');
    expect(html).not.toContain('오븐');
  });

  it('reveals the answer before moving to the round result', () => {
    const html = renderToStaticMarkup(React.createElement(ReversalOutcomeStep, {
      step: 'answer',
      success: false,
      caughtPlayers: '333(3번)',
      word: '오븐',
      categoryText: '카테고리: 가전제품',
      labels,
      onNext: () => {},
    }));

    expect(html).toContain('정답 확인');
    expect(html).toContain('정답');
    expect(html).toContain('오븐');
    expect(html).toContain('카테고리: 가전제품');
    expect(html).toContain('라운드 결과 보기');
  });
});
