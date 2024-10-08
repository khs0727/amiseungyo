'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/nav';
import ProtectedRoute from '@/components/protected-route';
import { TEAMSTYLES } from '@/constants/teams';
import { Game, useGameStore } from '@/store/game-store';
import { useThemeStore } from '@/store/theme-store';
import SortGames, { SortType } from './_components/sort-games';
import GamesPagination from './_components/pagination';
import SearchBar from './_components/seacch-bar';

export default function MyGames() {
  const [sortType, setSortType] = useState<SortType>('최신순');
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const team = useThemeStore((state) => (userId ? state.team[userId] : undefined));

  const teamStyles = team ? TEAMSTYLES[team] : TEAMSTYLES.default;

  useEffect(() => {
    if (userId) {
      const userGames = useGameStore.getState().games[userId] || [];
      setGames(userGames);
    }
  }, [userId]);

  const filteredGames = games.filter(
    (game) =>
      game.player?.includes(searchTerm) ||
      game.review?.includes(searchTerm) ||
      game.team.includes(searchTerm) ||
      game.date.toString().includes(searchTerm) ||
      game.scoreResult?.result.includes(searchTerm),
  );

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortType === '최신순') {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // 최신순
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime(); // 오래된순
  });

  const deleteGame = useGameStore((state) => state.deleteGame);

  const handleDeleteGame = (gameId: string) => {
    deleteGame(gameId);
    setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
  };

  return (
    <ProtectedRoute>
      <Nav />

      <div
        className={`flex flex-col items-center max-w-full w-screen min-h-screen ${teamStyles.bg.light} px-6 pt-10`}
      >
        <div className="max-w-[1200px] w-full mb-8">
          <div className="flex justify-between">
            <h2 className={`text-3xl underline mb-8 ${teamStyles.text}`}>나의 경기</h2>
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
            <SortGames onSortChange={setSortType} />
          </div>
          {games.length === 0 ? (
            <p className="text-3xl flex justify-center mt-10">등록된 게임이 없습니다.</p>
          ) : (
            <GamesPagination games={sortedGames} onDeleteGame={handleDeleteGame} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
