import { useState } from 'react';
import Card from '../components/Card.jsx';
import PeekModal from '../components/PeekModal.jsx';
import { haptic } from '../core/haptic.js';
import { useGame } from '../store/gameStore.jsx';

export default function PeekScreen() {
  const { state, dispatch } = useGame();
  const [peeking, setPeeking] = useState(false);
  const [peekIdx, setPeekIdx] = useState(-1);
  const done = state.revealed.filter(Boolean).length;
  const isLiar = state.liarIndices.includes(peekIdx);

  const reveal = index => {
    if (peeking || state.revealed[index]) return;
    setPeeking(true);
    setPeekIdx(index);
    haptic();
    setTimeout(() => {
      setPeeking(false);
      setPeekIdx(-1);
      dispatch({ type: 'REVEAL', idx: index });
    }, 2000);
  };

  return (
    <div className="screen game">
      <div className="game-header">
        <p className="game-title">라운드 {state.round}</p>
        <p className="progress">{done} / {state.config.playerCount} 확인 완료</p>
      </div>
      <div className="cards-area">
        {state.revealed.map((used, index) => (
          <Card key={index} idx={index} used={used} onClick={() => reveal(index)} />
        ))}
      </div>
      <PeekModal
        active={peeking}
        isLiar={isLiar}
        category={state.category}
        word={state.word}
        liarHint={state.config.liarHint}
      />
    </div>
  );
}
