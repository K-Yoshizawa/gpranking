import React from 'react';

function Rule() {
  return (
    <div className="rule-container">
      <h1 className="title">Rule</h1>
      <h2>概要</h2>
      <p>毎週開催の AtCoder Beginner Contest (以降 ABC) で MCC 内競争をしよう！</p>
      <h2>Season について</h2>
      <p>1 年間を 3 ヶ月で区切り、次のように Season を設定しています。</p>
      <ul>
        <li>4 月 ~ 6 月 : Spring Season</li>
        <li>7 月 ~ 9 月 : Summer Season</li>
        <li>10 月 ~ 12 月 : Autumn Season</li>
        <li>1 月 ~ 3 月 : Winter Season</li>
      </ul>
      <h2>Rank GP の計算</h2>
      <p>毎回の ABC の MCC 内順位に応じて、以下の Rank GP が与えられます。</p>
      <p>ただし、順位の対象となるのは次の 2 パターンのどちらかに当てはまる場合のみです。</p>
      <ul>
        <li>その ABC 時点での Rating が 2000 以上</li>
        <li>その ABC 時点での Rating が 1999 以下かつ、コンテストに Rated で参加</li>
      </ul>
      <div className="table-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <table className="results-table" style={{ width: 'auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>MCC 内順位</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Rank GP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='gold'>1</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='gold'>20</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='silver'>2</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='silver'>18</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='silver'>3</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='silver'>16</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='bronze'>4</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='bronze'>14</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='bronze'>5</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='bronze'>12</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='bronze'>6</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }} className='bronze'>10</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>7</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>9</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>8</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>8</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>9</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>7</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>10</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>6</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>11</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>5</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>12</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>5</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>13</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>4</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>14</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>4</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>15</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>3</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>16</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>3</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>17</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>2</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>18</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>2</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>19</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>1</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>20 以下</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Update GP の計算</h2>
      <p>各 Season 開始時点での Highest Rating から更新した Rating の値(以降 Highest Δ)に応じて Update GP が与えられます。</p>
      <p>Update GP の計算は、Highest Δ を 4 で割った値の小数点以下切り捨てした値になります。</p>
      <ul>
        <li>例 1 : Highest Δ = 20 の場合、Update GP は 5 となります。</li>
        <li>例 2 : Highest Δ = 2 の場合、Update GP は 0 となります。</li>
        <li>例 3 : Highest Δ = 99 の場合、Update GP は 24 となります。</li>
      </ul>
    </div>
  );
}

export default Rule;