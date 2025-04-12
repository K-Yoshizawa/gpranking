import React, { useEffect, useState } from 'react';
import './App.css'; // CSSファイルをインポート

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
  const [sortColumn, setSortColumn] = useState<'newRating' | 'highest'>('newRating');

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);

      // 現在の日付を取得し、YYYYMM形式に変換
      const now = new Date();
      const currentPeriod = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;

      // users.json を取得
      const usersResponse = await fetch('/users.json');
      const users: string[] = await usersResponse.json();

      // user_periods.json を取得
      const periodsResponse = await fetch('/user_periods.json');
      const userPeriods: Record<string, { start: string; end: string }> = await periodsResponse.json();

      const results: UserRating[] = [];

      for (const user of users) {
        const period = userPeriods[user];

        // ユーザーの期間が現在の日付より終了している場合はスキップ
        if (period && period.end < currentPeriod) {
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

      // 初期ソート: Highest ABC New Rating 列の降順
      results.sort((a, b) => b.newRating - a.newRating);

      setRatings(results);
      setLoading(false);
    };

    fetchRatings();
  }, []);

  const handleSort = (column: 'newRating' | 'highest') => {
    setSortColumn(column);
    setRatings((prevRatings) =>
      [...prevRatings].sort((a, b) => b[column] - a[column])
    );
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
                <th onClick={() => handleSort('newRating')} style={{ cursor: 'pointer' }}>
                  Current Rating
                </th>
                <th onClick={() => handleSort('highest')} style={{ cursor: 'pointer' }}>
                  Highest Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating, index) => (
                <tr key={rating.user}>
                  <td>{index + 1}</td>
                  <td>
                    <a
                      href={`https://atcoder.jp/users/${rating.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: getRatingColor(rating.newRating),
                        textDecoration: 'none',
                      }}
                    >
                      {rating.user}
                    </a>
                  </td>
                  <td style={{ color: getRatingColor(rating.newRating) }}>{rating.newRating}</td>
                  <td style={{ color: getRatingColor(rating.highest) }}>{rating.highest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Rating;