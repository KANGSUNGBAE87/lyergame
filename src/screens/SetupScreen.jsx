import { useState } from 'react';
import { CATEGORIES } from '../data/words.js';
import { useGame } from '../store/gameStore.jsx';

const difficulties = [
  [0, '전체'],
  [1, '쉬움'],
  [2, '보통'],
  [3, '어려움'],
];

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [config, setConfig] = useState({
    playerCount: 6,
    liarCount: 1,
    categories: [],
    difficulty: 0,
    liarHint: true,
    totalRounds: 3,
    timerMin: 0,
  });

  const set = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const setPlayerCount = playerCount => setConfig(prev => ({
    ...prev,
    playerCount,
    liarCount: playerCount < 6 ? 1 : prev.liarCount,
  }));
  const toggleCategory = category => setConfig(prev => ({
    ...prev,
    categories: prev.categories.includes(category)
      ? prev.categories.filter(item => item !== category)
      : [...prev.categories, category],
  }));

  return (
    <div className="screen setup">
      <div className="setup-head">
        <h1 className="title">라이어 게임</h1>
        <p className="subtitle">핸드폰 하나로 바로 시작</p>
      </div>

      <label className="field">
        <span>인원수 <b>{config.playerCount}명</b></span>
        <input
          type="range"
          min="3"
          max="10"
          value={config.playerCount}
          onChange={event => setPlayerCount(Number(event.target.value))}
        />
      </label>

      <div className="field">
        <span>라이어 수</span>
        <div className="seg">
          <button className={config.liarCount === 1 ? 'on' : ''} type="button" onClick={() => set('liarCount', 1)}>1명</button>
          <button className={config.liarCount === 2 ? 'on' : ''} type="button" disabled={config.playerCount < 6} onClick={() => set('liarCount', 2)}>2명</button>
        </div>
      </div>

      <div className="field">
        <span>난이도</span>
        <div className="seg">
          {difficulties.map(([value, label]) => (
            <button key={value} className={config.difficulty === value ? 'on' : ''} type="button" onClick={() => set('difficulty', value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>라운드</span>
        <div className="seg">
          {[3, 5].map(value => (
            <button key={value} className={config.totalRounds === value ? 'on' : ''} type="button" onClick={() => set('totalRounds', value)}>
              {value}R
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>타이머</span>
        <div className="seg">
          {[[0, '없음'], [1, '1분'], [2, '2분'], [3, '3분']].map(([value, label]) => (
            <button key={value} className={config.timerMin === value ? 'on' : ''} type="button" onClick={() => set('timerMin', value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="switch-row">
        <input type="checkbox" checked={config.liarHint} onChange={event => set('liarHint', event.target.checked)} />
        <span>라이어에게 카테고리 힌트</span>
      </label>

      <details className="field category-box">
        <summary>카테고리 {config.categories.length ? `${config.categories.length}개` : '전체'}</summary>
        <div className="cat-grid">
          {CATEGORIES.map(category => (
            <button key={category} className={config.categories.includes(category) ? 'on' : ''} type="button" onClick={() => toggleCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </details>

      <div className="setup-actions">
        <button className="primary-btn" type="button" onClick={() => dispatch({ type: 'START', config })}>게임 시작</button>
        <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>지난 기록</button>
      </div>
    </div>
  );
}
