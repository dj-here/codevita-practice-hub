import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    A = int(data[0])
    B = int(data[1])
    P = int(data[2])
    K = int(data[3])
    ciphertexts = [int(x) for x in data[4:4+K]]
    
    # Fermat's Little Theorem for prime P: A^(P-2) mod P
    inv_A = pow(A, P - 2, P)
    
    plaintexts = []
    for c in ciphertexts:
        x = ((c - B) % P * inv_A) % P
        plaintexts.append(str(x))
        
    print(' '.join(plaintexts))

if __name__ == '__main__':
    solve()
