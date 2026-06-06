import { useState } from 'react';
import Card from '../components/Card.jsx';
import PeekModal from '../components/PeekModal.jsx';
import { haptic } from '../core/haptic.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerLabel, playerNameWithNumber } from '../logic/players.js';
import { useGame } from '../store/gameStore.jsx';

export default function PeekScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
  const [peeking, setPeeking] = useState(false);
  const [peekIdx, setPeekIdx] = useState(-1);
  const [handoffIdx, setHandoffIdx] = useState(-1);
  const done = state.revealed.filter(Boolean).length;
  const nextIndex = state.revealed.findIndex(used => !used);
  const isLiar = state.liarIndices.includes(peekIdx);
  const currentPlayer = nextIndex >= 0 ? playerNameWithNumber(nextIndex, state.config.playerNames) : '';
  const handoffDone = handoffIdx >= 0 ? done + 1 : done;
  const nextHandoffIndex = state.revealed.findIndex((used, index) => !used && index !== handoffIdx);
  const nextHandoffPlayer = nextHandoffIndex >= 0 ? playerNameWithNumber(nextHandoffIndex, state.config.playerNames) : '';

  const reveal = index => {
    if (peeking || handoffIdx >= 0 || state.revealed[index]) return;
    setPeeking(true);
    setPeekIdx(index);
    haptic();
    setTimeout(() => {
      setPeeking(false);
      setPeekIdx(-1);
      setHandoffIdx(index);
    }, 2000);
  };
  const continueAfterPeek = () => {
    const index = handoffIdx;
    setHandoffIdx(-1);
    dispatch({ type: 'REVEAL', idx: index });
  };

  if (handoffIdx >= 0) {
    const isLast = handoffDone >= state.config.playerCount;

    return (
      <div className="screen handoff">
        <div className="handoff-panel">
          <p className="eyebrow">{t('peek.handoff.done', { player: playerLabel(handoffIdx, state.config.playerNames) })}</p>
          <h2 className="section-title">{isLast ? t('peek.handoff.discussTitle') : t('peek.handoff.title')}</h2>
          <p className="hint">
            {isLast
              ? t('peek.handoff.discussHelp')
              : t('peek.handoff.next', { player: nextHandoffPlayer })}
          </p>
          <button className="primary-btn wide" type="button" onClick={continueAfterPeek}>
            {isLast ? t('peek.handoff.discussButton') : t('peek.handoff.nextButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen game">
      <div className="game-header">
        <p className="game-title">{t('peek.round', { round: state.round })}</p>
        <p className="progress">{t('peek.progress', { done, count: state.config.playerCount })}</p>
        <p className="screen-help">{nextIndex >= 0 ? t('peek.current', { player: currentPlayer }) : t('peek.help')}</p>
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
