import requests
from supabase import create_client, Client
import re
from datetime import datetime
import sys
import json

# JSONファイルからデータを読み込む
with open('../public/users.json', 'r') as f:
    users = json.load(f)

with open('../public/user_periods.json', 'r') as f:
    user_periods = json.load(f)

def fetch_atcoder_data(user: str):
    """AtCoderからユーザーのコンテスト履歴を取得"""
    url = f"https://atcoder.jp/users/{user}/history/json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for {user}: {response.status_code}")
        return []

def extract_abc_data(contests: list, user: str):
    """AtCoder Beginner Contestのデータのみを抽出し、update_highestを計算"""
    abc_contests = []
    r = 0  # ユーザーごとの最高レートを追跡

    # ユーザーの集計期間を取得
    period = user_periods.get(user, {})
    start_period = period.get("start", "000000")  # デフォルト値: 無制限
    end_period = period.get("end", "999999")      # デフォルト値: 無制限

    for contest in contests:
        # 現在の最高レートを保存
        p = r
        r = max(r, contest["NewRating"])  # r を更新

        # Rating が 2000 未満かつ"IsRated" が false の場合はスキップ
        if not contest.get("IsRated", True) and int(contest.get("OldRating", None)) < 2000:
            continue

        # "EndTime" から日付を取得
        end_time = contest.get("EndTime", "")
        if end_time:
            dt = datetime.fromisoformat(end_time)
            contest_period = f"{dt.year}{dt.month:02d}"  # "YYYYMM"形式に変換

            # 集計期間外のデータをスキップ
            if contest_period < start_period or contest_period > end_period:
                continue

            # "EndTime" から season を決定
            if 1 <= dt.month <= 3:
                season = f"{dt.year-1}winter"
            elif 4 <= dt.month <= 6:
                season = f"{dt.year}spring"
            elif 7 <= dt.month <= 9:
                season = f"{dt.year}summer"
            elif 10 <= dt.month <= 12:
                season = f"{dt.year}autumn"
            else:
                season = f"{dt.year}unknown"  # 万が一のためのデフォルト値
        else:
            season = "unknown"  # "EndTime" がない場合

        # AtCoder Beginner Contest のデータを抽出
        contest_name = contest.get("ContestName", "")
        match = re.search(r"AtCoder Beginner Contest (\d+)", contest_name)
        if not match:
            continue  # 一致しない場合はスキップ

        abc_number = int(match.group(1))  # XXXを抽出

        # update_highest を計算
        update_highest = r - p

        # データをリストに追加
        abc_contests.append({
            "abc": abc_number,
            "general_place": contest["Place"],
            "old_rating": contest.get("OldRating", None),
            "new_rating": contest.get("NewRating", None),
            "highest": r,
            "performance": contest["Performance"],
            "season": season,
            "update_highest": update_highest,
        })

    return abc_contests

def upload_to_supabase(user: str, contests: list):
    """Supabaseにデータをアップロード"""
    for contest in contests:
        data = {
            "user": user,
            "abc": contest["abc"],
            "general_place": contest["general_place"],
            "old_rating": contest["old_rating"],
            "new_rating": contest["new_rating"],
            "highest": contest["highest"],
            "performance": contest["performance"],
            "season": contest["season"],  # season を追加
            "update_highest": contest["update_highest"],  # update_highest を追加
        }

        # 既存データの確認
        existing = supabase.table("contest_result").select("abc").eq("user", user).eq("abc", contest["abc"]).execute()
        if existing.data:
            # print(f"Data for user={user}, abc={contest['abc']} already exists. Skipping...")
            continue

        # データの挿入
        response = supabase.table("contest_result").insert(data).execute()

def main():
    all_results = {}
    for user in users:
        print(f"Fetching data for {user}...")
        contests = fetch_atcoder_data(user)
        abc_contests = extract_abc_data(contests, user)  # ABCデータを抽出
        all_results[user] = abc_contests
        print(f"Uploading ABC data for {user} to Supabase...")
        upload_to_supabase(user, abc_contests)

    # # ローカルにデータを保存
    # with open("results.json", "w") as f:
    #     json.dump(all_results, f, indent=2)
    # print("Data saved to results.json")

if __name__ == "__main__":
    global supabase
    SUPABASE_URL, SUPABASE_KEY = sys.argv[1], sys.argv[2]
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    main()