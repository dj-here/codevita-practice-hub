import sys

MORSE = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
}

def solve():
    raw = sys.stdin.read().rstrip('\r\n')
    if not raw:
        return
    words = raw.split('   ')
    decoded_words = []
    for w in words:
        chars = w.split(' ')
        decoded_chars = [MORSE.get(c, '') for c in chars if c]
        decoded_words.append(''.join(decoded_chars))
    print(' '.join(decoded_words))

if __name__ == '__main__':
    solve()
