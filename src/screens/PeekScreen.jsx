import { useState } from 'react';
import Card from '../components/Card.jsx';
import PeekModal from '../components/PeekModal.jsx';
import { haptic } from '../core/haptic.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { getPeekInstructionKey, getPeekPostRevealStep } from '../logic/peekFlow.js';
import { playerLabel, playerNameWithNumber } from '../logic/players.js';
import { useGame } from '../store/gameStore.jsx';

export default function PeekScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
  const [peeking, setPeeking] = useState(false);
  const [peekIdx, setPeekIdx] = useState(-1);
  const done = state.revealed.filter(Boolean).length;
  const nextIndex = state.revealed.findIndex(used => !used);
  const isLiar = state.liarIndices.includes(peekIdx);
  const currentPlayer = nextIndex >= 0 ? playerNameWithNumber(nextIndex, state.config.playerNames) : '';
  const instructionKey = nextIndex >= 0 ? getPeekInstructionKey({ done }) : 'peek.help';

  const reveal = index => {
    if (peeking || state.revealed[index]) return;
    setPeeking(true);
    setPeekIdx(index);
    haptic();
    setTimeout(() => {
      const postRevealStep = getPeekPostRevealStep({ revealed: state.revealed, index });
      setPeeking(false);
      setPeekIdx(-1);
      if (postRevealStep === 'next-card' || postRevealStep === 'discussion') {
        dispatch({ type: 'REVEAL', idx: index });
      }
    }, 2000);
  };

  return (
    <div className="screen game">
      <div className="game-header">
        <p className="game-title">{t('peek.round', { round: state.round })}</p>
        <p className="progress">{t('peek.progress', { done, count: state.config.playerCount })}</p>
        <div className="turn-instruction-card peek-instruction-card">
          <span>{t('peek.instructionBadge')}</span>
          <p>{nextIndex >= 0 ? t(instructionKey, { player: currentPlayer }) : t(instructionKey)}</p>
        </div>
      </div>
      <div className="single-card-area">
        {nextIndex >= 0 ? (
          <Card
            idx={nextIndex}
            label={playerLabel(nextIndex, state.config.playerNames)}
            used={state.revealed[nextIndex]}
            onClick={() => reveal(nextIndex)}
          />
        ) : null}
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
