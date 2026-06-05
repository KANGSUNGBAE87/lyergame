import Scoreboard from '../components/Scoreboard.jsx';
import { useGame } from '../store/gameStore.jsx';

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const isLastRound = state.round >= state.config.totalRounds;

  return (
    <div className="screen result">
      <h2 className="section-title">{state.lastLiarWon ? '라이어 승리' : '시민 승리'}</h2>
      <p className="hint">
        제시어 <b>{state.word}</b> · {state.category}<br />
        라이어 {state.liarIndices.map(index => index + 1).join(', ')}번
      </p>
      <Scoreboard scores={state.scores} delta={state.lastDelta} liarIndices={state.liarIndices} />
      <button className="primary-btn" type="button" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
        {isLastRound ? '최종 결과 보기' : `다음 라운드 ${state.round + 1}/${state.config.totalRounds}`}
      </button>
    </div>
  );
}
