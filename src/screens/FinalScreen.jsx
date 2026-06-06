import { useEffect, useRef } from 'react';
import Scoreboard from '../components/Scoreboard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { deriveFinalRecap } from '../logic/highlights.js';
import { playerNameWithNumber } from '../logic/players.js';
import { saveGameRecord, useGame } from '../store/gameStore.jsx';

function formatPlayers(indices = [], playerNames = []) {
  return indices.map(index => playerNameWithNumber(index, playerNames)).join(', ');
}

export default function FinalScreen() {
  const { state, dispatch } = useGame();
  const { t } = useI18n();
  const saved = useRef(false);
  const maxScore = Math.max(...state.scores);
  const recap = deriveFinalRecap({ scores: state.scores, perRound: state.perRound });
  const winners = formatPlayers(recap.winners.indices, state.config.playerNames);

  useEffect(() => {
    if (!saved.current) {
      saved.current = true;
      void saveGameRecord(state);
    }
  }, [state]);

  return (
    <div className="screen final">
      <h1 className="big-title">{t('final.title')}</h1>
      <p className="hint">{t('final.winner', { winners, score: maxScore })}</p>
      <div className="recap-list">
        <div className="recap-row">
          <span>{t('final.recap.winner')}</span>
          <b>{winners}</b>
        </div>
        {recap.suspicionKing.votes > 0 ? (
          <div className="recap-row">
            <span>{t('final.recap.suspicion')}</span>
            <b>{formatPlayers(recap.suspicionKing.indices, state.config.playerNames)} · {t('result.highlight.votes', { count: recap.suspicionKing.votes })}</b>
          </div>
        ) : null}
        {recap.unfairCitizen.votes > 0 ? (
          <div className="recap-row">
            <span>{t('final.recap.unfair')}</span>
            <b>{formatPlayers(recap.unfairCitizen.indices, state.config.playerNames)}</b>
          </div>
        ) : null}
        {recap.bestLiar.wins > 0 ? (
          <div className="recap-row">
            <span>{t('final.recap.bestLiar')}</span>
            <b>{formatPlayers(recap.bestLiar.indices, state.config.playerNames)} · {t('final.recap.wins', { count: recap.bestLiar.wins })}</b>
          </div>
        ) : null}
        {recap.reversalHero.count > 0 ? (
          <div className="recap-row">
            <span>{t('final.recap.reversal')}</span>
            <b>{formatPlayers(recap.reversalHero.indices, state.config.playerNames)}</b>
          </div>
        ) : null}
      </div>
      <Scoreboard scores={state.scores} playerNames={state.config.playerNames} />
      <button className="primary-btn wide" type="button" onClick={() => dispatch({ type: 'RESTART_SAME' })}>{t('final.sameGame')}</button>
      <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'RESET' })}>{t('final.newGame')}</button>
      <button className="ghost-btn" type="button" onClick={() => dispatch({ type: 'GO', phase: 'history' })}>{t('final.history')}</button>
    </div>
  );
}
