import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ReversalJudge from '../src/components/ReversalJudge.jsx';

describe('ReversalJudge', () => {
  it('asks citizens to judge the liar without revealing the answer word', () => {
    const html = renderToStaticMarkup(React.createElement(ReversalJudge, {
      title: '라이어 지목',
      voteResultLabel: '투표 결과',
      voteResultText: '3번 · 4표',
      verdictText: '판정: 라이어 지목 성공',
      caughtText: '3번이 제시어를 맞히면 역전승',
      instruction: '지목된 라이어는 제시어를 한 번 말하세요.',
      citizenInstruction: '시민들은 정답 여부를 판정하세요.',
      categoryText: '카테고리: 음식',
      correctLabel: '맞혔어요',
      wrongLabel: '틀렸어요',
      answerWord: '김치',
      onCorrect: () => {},
      onWrong: () => {},
    }));

    expect(html).toContain('지목된 라이어는 제시어를 한 번 말하세요.');
    expect(html).toContain('시민들은 정답 여부를 판정하세요.');
    expect(html).toContain('카테고리: 음식');
    expect(html).toContain('맞혔어요');
    expect(html).toContain('틀렸어요');
    expect(html).not.toContain('김치');
    expect(html).not.toContain('choice-grid');
    expect(html).toContain('3번 · 4표');
    expect(html).toContain('판정: 라이어 지목 성공');
    expect(html.indexOf('3번 · 4표')).toBeLessThan(html.indexOf('3번이 제시어를 맞히면 역전승'));
    expect(html.indexOf('판정: 라이어 지목 성공')).toBeLessThan(html.indexOf('3번이 제시어를 맞히면 역전승'));
  });
});
