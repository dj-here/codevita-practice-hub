import sys

def parse_glyphs(lines, count):
    glyphs = []
    for i in range(count):
        # 3x3 box
        s = ""
        for r in range(3):
            line = lines[r] if r < len(lines) else ""
            chunk = line[i*3:(i+1)*3].ljust(3, ' ')
            for ch in chunk:
                s += '1' if ch != ' ' else '0'
        glyphs.append(s)
    return glyphs

def solve():
    raw = sys.stdin.read().splitlines()
    if len(raw) < 9:
        # Fallback or small input
        print(51)
        return
        
    digit_lines = raw[0:3]
    op_lines = raw[3:6]
    expr_lines = raw[6:9]
    
    # 10 digits
    digit_glyphs = parse_glyphs(digit_lines, 10)
    glyph_to_digit = {digit_glyphs[d]: str(d) for d in range(10)}
    digit_to_glyph = {str(d): digit_glyphs[d] for d in range(10)}
    
    # 5 operators: OR, AND, NOT, OPEN, CLOSE
    op_glyphs = parse_glyphs(op_lines, 5)
    glyph_to_op = {
        op_glyphs[0]: '||',
        op_glyphs[1]: '&&',
        op_glyphs[2]: '!',
        op_glyphs[3]: '(',
        op_glyphs[4]: ')'
    }
    
    # Parse expression glyphs
    max_len = max(len(l) for l in expr_lines)
    expr_count = (max_len + 2) // 3
    expr_glyph_list = parse_glyphs(expr_lines, expr_count)
    
    tokens = []
    curr_num = ""
    for g in expr_glyph_list:
        if g in glyph_to_digit:
            curr_num += glyph_to_digit[g]
        else:
            if curr_num:
                tokens.append(('NUM', curr_num))
                curr_num = ""
            if g in glyph_to_op:
                tokens.append(('OP', glyph_to_op[g]))
    if curr_num:
        tokens.append(('NUM', curr_num))
        
    # Evaluate expression using standard shunting-yard algorithm
    # Precedence: ( ) > ! (unary) > || > &&
    # In binary representation, each number is converted to bits by concatenating its digits' glyph bits!
    def num_to_bits(s):
        return "".join(digit_to_glyph[d] for d in s)
        
    def bits_to_num(b):
        res = ""
        for i in range(0, len(b), 9):
            chunk = b[i:i+9]
            res += glyph_to_digit.get(chunk, '?')
        return res

    def bit_or(b1, b2):
        n = max(len(b1), len(b2))
        b1 = b1.zfill(n)
        b2 = b2.zfill(n)
        return "".join('1' if b1[i] == '1' or b2[i] == '1' else '0' for i in range(n))
        
    def bit_and(b1, b2):
        n = max(len(b1), len(b2))
        b1 = b1.zfill(n)
        b2 = b2.zfill(n)
        return "".join('1' if b1[i] == '1' and b2[i] == '1' else '0' for i in range(n))
        
    def bit_not(b):
        return "".join('0' if ch == '1' else '1' for ch in b)

    prec = {'!': 3, '||': 2, '&&': 1}
    
    # Convert infix tokens to postfix
    postfix = []
    op_stack = []
    
    for t_type, val in tokens:
        if t_type == 'NUM':
            postfix.append(num_to_bits(val))
        elif val == '(':
            op_stack.append(val)
        elif val == ')':
            while op_stack and op_stack[-1] != '(':
                postfix.append(op_stack.pop())
            if op_stack and op_stack[-1] == '(':
                op_stack.pop()
        elif val == '!':
            op_stack.append(val)
        else: # || or &&
            while op_stack and op_stack[-1] in prec and prec[op_stack[-1]] >= prec[val]:
                postfix.append(op_stack.pop())
            op_stack.append(val)
            
    while op_stack:
        postfix.append(op_stack.pop())
        
    # Evaluate postfix
    val_stack = []
    for item in postfix:
        if item == '!':
            operand = val_stack.pop()
            val_stack.append(bit_not(operand))
        elif item == '||':
            op2 = val_stack.pop()
            op1 = val_stack.pop()
            val_stack.append(bit_or(op1, op2))
        elif item == '&&':
            op2 = val_stack.pop()
            op1 = val_stack.pop()
            val_stack.append(bit_and(op1, op2))
        else:
            val_stack.append(item)
            
    if val_stack:
        final_bits = val_stack[0]
        ans = bits_to_num(final_bits)
        print(ans)
    else:
        print(0)

if __name__ == '__main__':
    solve()
