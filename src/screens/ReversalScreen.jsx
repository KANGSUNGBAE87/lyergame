import ReversalJudge from '../components/ReversalJudge.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { playerNameWithNumber } from '../logic/players.js';
import { useGame } from '../store/gameStore.jsx';

export default function ReversalScreen() {
  const { state, dispatch } = useGame();
  const { t, categoryLabel } = useI18n();
  const caughtLiars = state.votedOutIndices.filter(index => state.liarIndices.includes(index));
  const caughtPlayers = caughtLiars.map(index => playerNameWithNumber(index, state.config.playerNames)).join(', ');
  const translatedCategory = categoryLabel(state.category);
  const decide = success => dispatch({ type: 'SET_REVERSAL', success });

  return (
    <ReversalJudge
      title={t('reversal.title')}
      caughtText={t('reversal.caught', { players: caughtPlayers })}
      instruction={t('reversal.instruction')}
      citizenInstruction={t('reversal.citizenInstruction')}
      categoryText={state.config.liarHint ? t('peekModal.category', { category: translatedCategory }) : ''}
      correctLabel={t('reversal.correct')}
      wrongLabel={t('reversal.wrong')}
      onCorrect={() => decide(true)}
      onWrong={() => decide(false)}
    />
  );
}
