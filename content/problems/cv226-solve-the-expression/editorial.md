# Editorial: Solve The Expression (TCS CodeVita Season 14 MockVita 2)

## Problem Overview
You are given a 9-line input representing:
1. Digits `0-9` rendered as 7-segment $3 \times 3$ glyphs.
2. Operators `||`, `&&`, `!`, `(`, `)` rendered as 7-segment $3 \times 3$ glyphs.
3. An expression in 7-segment notation.

Each $3 \times 3$ glyph turns into a 9-bit binary string (1 for non-space, 0 for space).
- Numbers are formed by concatenating the 9-bit strings of each digit.
- Bitwise operators are applied on these bit strings with precedence:
  $$\text{Brackets } () \quad > \quad \text{Logical NOT } ! \quad > \quad \text{Logical OR } || \quad > \quad \text{Logical AND } \&\&$$
- The final result string is partitioned into 9-bit chunks and matched back to digits to print the numeric result.

## Algorithm
1. **Glyph Parsing**:
   - Extract the 10 digit patterns (lines 1-3).
   - Extract the 5 operator patterns (lines 4-6).
   - Extract all expression glyphs (lines 7-9).
2. **Lexing & Tokenizing**:
   - Group contiguous digit glyphs into numbers.
   - Recognize operators and brackets.
3. **Expression Evaluation (Shunting-Yard)**:
   - Convert infix expression to postfix using an operator stack respecting the specified precedence ($\text{NOT} > \text{OR} > \text{AND}$).
   - Evaluate postfix:
     - `!`: bitwise NOT on the bit string.
     - `||`: bitwise OR on equal-length padded strings.
     - `&&`: bitwise AND on equal-length padded strings.
4. **Formatting**:
   - Translate each 9-bit substring of the evaluated bit sequence back into its corresponding decimal digit character.
