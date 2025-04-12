import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import MenuBar from './MenuBar';
import Rule from './Rule';
import Rating from './Rating';

// season_result の型
type SeasonResult = {
  user: string;
  season: string;
  final_rating: number;
  update_highest: number;
  place_gp: number;
  update_gp: number;
  total_gp: number;
  final_highest: number;
};

// contest_result の型
type ContestResult = {
  user: string;
  abc: number;
  tuat_place: number | null;
};

// place_gp を計算する関数
const calculatePlaceGp = (tuat_place: number | null): number => {
  if (tuat_place === null) return 0;
  if (1 <= tuat_place && tuat_place <= 6) return 20 - (tuat_place - 1) * 2;
  if (7 <= tuat_place && tuat_place <= 10) return 9 - (tuat_place - 7);
  if (11 <= tuat_place && tuat_place <= 12) return 5;
  if (13 <= tuat_place && tuat_place <= 14) return 4;
  if (15 <= tuat_place && tuat_place <= 16) return 3;
  if (17 <= tuat_place && tuat_place <= 18) return 2;
  return 1;
};

// Final Rating に応じた文字色を取得する関数
const getRatingColor = (rating: number): string => {
  if (rating >= 2000) return '#c0c000';
  if (rating >= 1600) return '#0000ff';
  if (rating >= 1200) return '#00c0c0';
  if (rating >= 800) return '#008000';
  if (rating >= 400) return '#804000';
  if (rating >= 1) return '#c0c0c0';
  return '#000000'; // デフォルトの文字色
};

function App() {
  const [seasonResults, setSeasonResults] = useState<SeasonResult[]>([]);
  const [contestResults, setContestResults] = useState<ContestResult[]>([]);
  const [abcColumns, setAbcColumns] = useState<number[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('2025spring');

  useEffect(() => {
    const fetchSeasons = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/season_result`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
          },
        }
      );
      const json: SeasonResult[] = await res.json();

      const uniqueSeasons = Array.from(new Set(json.map((result) => result.season)));
      const seasonOrder = ['winter', 'autumn', 'summer', 'spring'];
      uniqueSeasons.sort((a, b) => {
        const [yearA, seasonA] = a.match(/(\d+)(\w+)/)!.slice(1);
        const [yearB, seasonB] = b.match(/(\d+)(\w+)/)!.slice(1);

        if (yearA !== yearB) {
          return parseInt(yearB) - parseInt(yearA);
        }
        return seasonOrder.indexOf(seasonA) - seasonOrder.indexOf(seasonB);
      });

      setSeasons(uniqueSeasons);
    };

    fetchSeasons();
  }, []);

  useEffect(() => {
    const fetchSeasonResults = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/season_result?season=eq.${selectedSeason}`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
          },
        }
      );
      const json = await res.json();

      const sortedResults = json.sort((a: SeasonResult, b: SeasonResult) => {
        if (b.total_gp === a.total_gp) {
          return b.place_gp - a.place_gp;
        }
        return b.total_gp - a.total_gp;
      });

      setSeasonResults(sortedResults);
    };

    const fetchContestResults = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/contest_result?season=eq.${selectedSeason}`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_API_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
          },
        }
      );
      const json: ContestResult[] = await res.json();

      const abcSet = new Set<number>();
      json.forEach((result) => {
        abcSet.add(result.abc);
      });

      const sortedAbcColumns = Array.from(abcSet).sort((a, b) => a - b);
      setAbcColumns(sortedAbcColumns);

      setContestResults(json);
    };

    fetchSeasonResults();
    fetchContestResults();
  }, [selectedSeason]);

  return (
    <Router>
      <div className="app-container">
        <MenuBar />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                seasons={seasons}
                seasonResults={seasonResults}
                abcColumns={abcColumns}
                contestResults={contestResults}
              />
            }
          />
          <Route path="/rule" element={<Rule />} />
          <Route path="/rating" element={<Rating />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({
  selectedSeason,
  setSelectedSeason,
  seasons,
  seasonResults,
  abcColumns,
  contestResults,
}: {
  selectedSeason: string;
  setSelectedSeason: React.Dispatch<React.SetStateAction<string>>;
  seasons: string[];
  seasonResults: SeasonResult[];
  abcColumns: number[];
  contestResults: ContestResult[];
}) {
  const [sortedResults, setSortedResults] = useState<SeasonResult[]>([]);

  useEffect(() => {
    // デフォルトで Total GP で降順ソート
    const sorted = [...seasonResults].sort((a, b) => b.total_gp - a.total_gp);
    setSortedResults(sorted);
  }, [seasonResults]);

  const handleSort = (column: 'final_rating' | 'total_gp' | 'final_highest' | 'update_highest' | 'place_gp' | 'update_gp' | number) => {
    const sorted = [...sortedResults].sort((a, b) => {
      if (typeof column === 'number') {
        // ABC 列のソート
        const contestA = contestResults.find((r) => r.user === a.user && r.abc === column);
        const contestB = contestResults.find((r) => r.user === b.user && r.abc === column);

        const placeA = contestA?.tuat_place || Infinity; // null の場合は最下位扱い
        const placeB = contestB?.tuat_place || Infinity;

        return placeA - placeB; // 昇順ソート（順位が小さいほど上位）
      } else {
        // 他の列のソート
        return b[column] - a[column];
      }
    });

    setSortedResults(sorted);
  };

  return (
    <div>
      <h1 className="title">TUAT ABC GP Ranking</h1>
      <div className="season-selector">
        <label htmlFor="season-select">Select Season: </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>
      {sortedResults.length > 0 ? (
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th onClick={() => handleSort('final_rating')} style={{ cursor: 'pointer' }}>
                  Final Rating
                </th>
                <th onClick={() => handleSort('total_gp')} style={{ cursor: 'pointer' }}>
                  Total GP
                </th>
                <th onClick={() => handleSort('final_highest')} style={{ cursor: 'pointer' }}>
                  Highest
                </th>
                <th onClick={() => handleSort('update_highest')} style={{ cursor: 'pointer' }}>
                  Highest Δ
                </th>
                <th onClick={() => handleSort('place_gp')} style={{ cursor: 'pointer' }}>
                  Rank GP
                </th>
                <th onClick={() => handleSort('update_gp')} style={{ cursor: 'pointer' }}>
                  Update GP
                </th>
                {abcColumns.map((abc) => (
                  <th key={abc} onClick={() => handleSort(abc)} style={{ cursor: 'pointer' }}>
                    {`ABC ${abc}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => (
                <tr key={result.user}>
                  <td>{index + 1}</td>
                  <td>
                    <a
                      href={`https://atcoder.jp/users/${result.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: getRatingColor(result.final_rating),
                        textDecoration: 'none',
                      }}
                    >
                      {result.user}
                    </a>
                  </td>
                  <td style={{ color: getRatingColor(result.final_rating) }}>{result.final_rating}</td>
                  <td>{result.total_gp}</td>
                  <td style={{ color: getRatingColor(result.final_highest) }}>{result.final_highest}</td>
                  <td>+{result.update_highest}</td>
                  <td>{result.place_gp}</td>
                  <td>{result.update_gp}</td>
                  {abcColumns.map((abc) => {
                    const contestResult = contestResults.find(
                      (r) => r.user === result.user && r.abc === abc
                    );
                    const placeGp = calculatePlaceGp(contestResult?.tuat_place || null);

                    let cellClass = '';
                    if (placeGp >= 20) {
                      cellClass = 'gold';
                    } else if (placeGp >= 16) {
                      cellClass = 'silver';
                    } else if (placeGp >= 10) {
                      cellClass = 'bronze';
                    }

                    return (
                      <td key={abc} className={cellClass}>
                        {placeGp || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;