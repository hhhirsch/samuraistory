// Helper functions to manage game state in localStorage

// Player names
export const getPlayerNames = (): { player1Name: string; player2Name: string } => {
  const player1Name = localStorage.getItem('player1Name') || 'Samurai 1';
  const player2Name = localStorage.getItem('player2Name') || 'Samurai 2';
  return { player1Name, player2Name };
};

export const setPlayerNames = (player1Name: string, player2Name: string): void => {
  localStorage.setItem('player1Name', player1Name);
  localStorage.setItem('player2Name', player2Name);
};

// Score management
export const getScore = (player: 'player1' | 'player2'): number => {
  const score = localStorage.getItem(`score_${player}`);
  return score ? parseInt(score, 10) : 0;
};

export const setScore = (player: 'player1' | 'player2', score: number): void => {
  localStorage.setItem(`score_${player}`, score.toString());
};

export const incrementScore = (player: 'player1' | 'player2', points: number = 1): void => {
  const currentScore = getScore(player);
  setScore(player, currentScore + points);
};

// Chapter progress
export const getCurrentChapter = (): number => {
  const chapter = localStorage.getItem('currentChapter');
  return chapter ? parseInt(chapter, 10) : 1;
};

export const setCurrentChapter = (chapter: number): void => {
  localStorage.setItem('currentChapter', chapter.toString());
};

// Reset game state
export const resetGameState = (): void => {
  localStorage.removeItem('player1Name');
  localStorage.removeItem('player2Name');
  localStorage.removeItem('score_player1');
  localStorage.removeItem('score_player2');
  localStorage.removeItem('currentChapter');
};