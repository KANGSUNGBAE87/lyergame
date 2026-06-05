import { useEffect, useState } from 'react';
import { recordsRepository } from '../records/recordsRepository.js';
import { useGame } from '../store/gameStore.jsx';

const difficultyLabel = {
  0: '전체',
  1: '쉬움',
  2: '보통',
  3: '어려움',
};

export default function HistoryScreen() {
  const { state, dispatch } = useGame();
  const [games, setGames] = useState(null);
  const backPhase = state.prevFrom && state.prevFrom !== 'history' ? state.prevFrom : 'setup';

  useEffect(() => {
    recordsRepository.listGames().then(setGames);
  }, []);

  return (
    <div className="screen history">
      <h2 className="section-title">지난 기록</h2>
      {games === null ? <p className="hint">불러오는 중</p> : null}
      {games?.length === 0 ? <p className="hint">아직 기록이 없습니다.</p> : null}
      {games?.length ? (
        <div className="hist-list">
          {games.map((game, index) => (
            <div className="hist-row" key={`${game.date}-${index}`}>
              <div className="hist-date">{new Date(game.date).toLocaleString('ko-KR')}</div>
              <div className="hist-meta">
                {game.playerCount}명 · {game.rounds}R · {difficultyLabel[game.difficulty] ?? '전체'} · 우승 {game.winnerIndices.map(i => i + 1).join(', ')}번
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="login-note">로그인 기반 영구 기록은 다음 버전에서 연결 예정</div>
      <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: backPhase })}>돌아가기</button>
    </div>
  );
}
