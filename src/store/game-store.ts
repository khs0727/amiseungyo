import { ResultWithColor } from '@/utils/score-calculator';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Game {
  id: string;
  date: Date;
  team: string;
  score: { team1: number; team2: number };
  scoreResult: ResultWithColor | null;
  picture?: string | null;
  player?: string;
  review?: string;
}

interface GameStore {
  games: Game[];
  addGame: (game: Game) => void;
  deleteGame: (id: string) => void;
  updateGame: (id: string, updatedGame: Partial<Game>) => void;
}

export const useGameStore = create(
  persist<GameStore>(
    (set) => ({
      games: [],
      addGame: (game) =>
        set((state) => ({
          games: [...state.games, game],
        })),
      deleteGame(id: string) {
        set((state) => ({
          games: state.games.filter((game) => game.id != id),
        }));
      },
      updateGame(id: string, updatedGame) {
        set((state) => ({
          games: state.games.map((game) => (game.id === id ? { ...game, ...updatedGame } : game)),
        }));
      },
    }),
    {
      name: 'game-storage',
    },
  ),
);
