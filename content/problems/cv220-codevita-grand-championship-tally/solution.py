import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = int(data[0])
    
    # Track per-user, per-problem state
    # user -> problem -> {'solved': bool, 'wa_before': int, 'time': int}
    user_prob = defaultdict(lambda: defaultdict(lambda: {'solved': False, 'wa_before': 0, 'time': 0}))
    all_users = set()
    
    idx = 1
    for _ in range(s):
        user = data[idx]
        prob = data[idx+1]
        verdict = data[idx+2]
        t = int(data[idx+3])
        idx += 4
        
        all_users.add(user)
        entry = user_prob[user][prob]
        if entry['solved']:
            continue # Submissions after first AC are ignored
        if verdict == 'AC':
            entry['solved'] = True
            entry['time'] = t
        else:
            entry['wa_before'] += 1
            
    leaderboard = []
    for user in all_users:
        solved_count = 0
        total_penalty = 0
        for prob, info in user_prob[user].items():
            if info['solved']:
                solved_count += 1
                total_penalty += info['time'] + 20 * info['wa_before']
        leaderboard.append((solved_count, total_penalty, user))
        
    # Sort: solved DESC, penalty ASC, username ASC
    leaderboard.sort(key=lambda x: (-x[0], x[1], x[2]))
    
    for rank, (solved, penalty, user) in enumerate(leaderboard, 1):
        print(f"{rank} {user} {solved} {penalty}")

if __name__ == '__main__':
    solve()
