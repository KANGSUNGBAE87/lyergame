import Timer from '../components/Timer.jsx';
import { useGame } from '../store/gameStore.jsx';

export default function DiscussScreen() {
  const { state, dispatch } = useGame();
  const goVote = () => dispatch({ type: 'GO_VOTE' });

  return (
    <div className="screen discuss">
      <h2 className="section-title">토론 시간</h2>
      {state.config.timerMin > 0 ? <Timer minutes={state.config.timerMin} onDone={goVote} /> : <p className="hint">시간 제한 없음</p>}
      <button className="primary-btn" type="button" onClick={goVote}>투표하러 가기</button>
    </div>
  );
}
