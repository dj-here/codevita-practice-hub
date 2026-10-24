# Editorial: The Royal Enigma Modular Decryption

## Problem Analysis
Compute A^(-1) mod P once using pow(A, P - 2, P) by Fermat's Little Theorem in O(log P). Then decrypt each ciphertext in O(1) time.

## Complexity Analysis
- **Time Complexity:** O(log P + K)
- **Space Complexity:** O(K)
