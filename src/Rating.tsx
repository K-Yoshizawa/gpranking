import { useEffect, useState } from 'react';
import './App.css'; // CSSファイルをインポート

const seasonOrder: Record<string, number> = {
  spring: 0,
  summer: 1,
  autumn: 2,
  winter: 3,
};
function parseSeason(season: string): { year: number; order: number } {
  const m = season.match(/(\d+)(\w+)/);
  if (!m) return { year: 0, order: 0 };
  return { year: +m[1], order: seasonOrder[m[2].toLowerCase()] };
}

type UserRating = {
  user: string;
  newRating: number;
  highest: number;
};

const getRatingColor = (rating: number): string => {
  if (rating >= 2000) return '#c0c000';
  if (rating >= 1600) return '#0000ff';
  if (rating >= 1200) return '#00c0c0';
  if (rating >= 800) return '#008000';
  if (rating >= 400) return '#804000';
  if (rating >= 1) return '#c0c0c0';
  return '#000000'; // デフォルトの文字色
};

function Rating() {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPeriods, setUserPeriods] = useState<Record<string, { start: string; end: string; begin: string }>>({});

  // 現在の日付からシーズンを算出
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  let currentPeriod = `${y}${(m).toString().padStart(2, '0')}`;;
  let currentSeason = '';
  if (4 <= m && m <= 6) currentSeason = `${y}spring`;
  else if (7 <= m && m <= 9) currentSeason = `${y}summer`;
  else if (10 <= m && m <= 12) currentSeason = `${y}autumn`;
  else currentSeason = `${y - 1}winter`;
  const { year: cy, order: co } = parseSeason(currentSeason);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);

      try {
        // users.json を取得
        const usersResponse = await fetch(`${import.meta.env.BASE_URL}users.json`);
        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users.json: ${usersResponse.status} ${usersResponse.statusText}`);
        }
        const users: string[] = await usersResponse.json();

        // user_periods.json を取得
        const periodsResponse = await fetch(`${import.meta.env.BASE_URL}user_periods.json`);
        if (!periodsResponse.ok) {
          throw new Error(`Failed to fetch user_periods.json: ${periodsResponse.status} ${periodsResponse.statusText}`);
        }
        const periods: Record<string, { start: string; end: string; begin: string }> = await periodsResponse.json();
        setUserPeriods(periods);

        const results: UserRating[] = [];

        for (const user of users) {
          const period = periods[user];
          // const periodEnd = period?.end ?? 'N/A';
          // console.log('user: %s, period.end: %s, currentPeriod', user, periodEnd, currentPeriod);

          // ユーザーの期間が現在の日付より終了している場合はスキップ
          if (period && period.end < currentPeriod) {
            // console.log('user: %s -> skip', user)
            continue;
          }

          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/contest_result?user=eq.${user}&order=abc.desc&limit=1`,
            {
              headers: {
                apikey: import.meta.env.VITE_SUPABASE_API_KEY,
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
              },
            }
          );

          const data = await res.json();

          if (data.length > 0) {
            results.push({
              user,
              newRating: data[0].new_rating,
              highest: data[0].highest,
            });
          }
        }
        
        results.sort((a, b) => b.newRating - a.newRating);

        setRatings(results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const handleSort = (column: 'newRating' | 'highest') => {
    setRatings((prev) => [...prev].sort((a, b) => b[column] - a[column]));
  };

  return (
    <div className="rating-container">
      <h1 className="title">Rating</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>League</th>
                <th onClick={() => handleSort('newRating')} style={{ cursor: 'pointer' }}>
                  Current Rating
                </th>
                <th onClick={() => handleSort('highest')} style={{ cursor: 'pointer' }}>
                  Highest Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating, index) => {
                // League 判定
                const begin = userPeriods[rating.user]?.begin || '';
                const { year: by, order: bo } = parseSeason(begin);
                const e = (cy - by) + (co - bo) / 4;
                const h = rating.highest;
                console.log('user: %s, begin: %s, cy: %d, by: %d, co: %d, bo: %d, e: %d, h: %d', rating.user, begin, cy, by, co, bo, e, h)
                let league = 'N';
                if (e >= 1 || h >= 400) league = 'C';
                if (e >= 3 || h >= 800) league = 'B';
                if (h >= 1200) league = 'A';

                return (
                  <tr key={rating.user}>
                    <td>{index + 1}</td>
                    <td>
                      <a
                        href={`https://atcoder.jp/users/${rating.user}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: getRatingColor(rating.newRating),
                          fontWeight: 'bold',
                          textDecoration: 'none',
                        }}
                      >
                        {rating.user}
                      </a>
                    </td>
                    <td>{league}</td>
                    <td style={{ color: getRatingColor(rating.newRating) }}>{rating.newRating}</td>
                    <td style={{ color: getRatingColor(rating.highest) }}>{rating.highest}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Rating;