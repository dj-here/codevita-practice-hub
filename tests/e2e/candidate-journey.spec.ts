import { test, expect } from '@playwright/test';

test.describe('End-to-End Candidate Journey', () => {
  const timestamp = Date.now();
  const testCandidate = {
    name: `Candidate ${timestamp}`,
    email: `candidate_${timestamp}@codevita.hub`,
    password: 'Password123!',
  };

  test('Signup -> Login -> Browse Problem -> Submit Solution -> See Accepted', async ({
    page,
    request,
  }) => {
    // 1. Candidate visits registration page
    await page.goto('/register');
    await expect(page).toHaveTitle(/CodeVita/i);

    // Fill registration form
    await page.fill('input[type="text"]', testCandidate.name);
    await page.fill('input[type="email"]', testCandidate.email);
    const passwordInputs = await page.locator('input[type="password"]').all();
    await passwordInputs[0].fill(testCandidate.password);
    await passwordInputs[1].fill(testCandidate.password);

    // Submit registration
    await page.click('button[type="submit"]');

    // 2. Expect redirect to login page with registered notice
    await expect(page).toHaveURL(/\/login/);

    // 3. Candidate logs in with newly created credentials
    await page.fill('input[type="email"]', testCandidate.email);
    await page.fill('input[type="password"]', testCandidate.password);
    await page.click('button[type="submit"]');

    // Wait for NextAuth authentication redirect to complete
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });

    // 4. Candidate is authenticated and navigates to the Practice Problem Bank
    await page.goto('/problems');
    await expect(page.locator('h1')).toContainText(/CodeVita Problem Arena/i);

    // 5. Select Problem cv001-divisor-strength
    const problemLink = page.locator('a[href="/problems/cv001-divisor-strength"]');
    await expect(problemLink).toBeVisible({ timeout: 10000 });
    await problemLink.click();

    // 6. Problem Arena loads
    await expect(page).toHaveURL(/\/problems\/cv001-divisor-strength/);
    await expect(page.locator('h1')).toContainText(/Divisor Strength/i);

    // 7. Execute Submit Solution
    // We can trigger the submission directly through the authenticated session
    const correctSolutionPython = `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    count = 0
    i = 1
    while i * i <= n:
        if n % i == 0:
            count += 1
            if i * i != n:
                count += 1
        i += 1
    print(count)

if __name__ == '__main__':
    solve()
`;

    // Submit solution via the frontend API with cookies from current authenticated browser context
    const submitResponse = await page.evaluate(async (code) => {
      const res = await fetch('/api/judge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSlug: 'cv001-divisor-strength',
          language: 'PYTHON',
          code,
        }),
      });
      return res.json();
    }, correctSolutionPython);

    expect(submitResponse.verdict).toBe('ACCEPTED');
    expect(submitResponse.passedCases).toBe(submitResponse.totalCases);

    // 8. Reload page to assert "Accepted" badge and solved checkmark are rendered
    await page.reload();
    await expect(page.locator('text=Accepted').first()).toBeVisible({ timeout: 10000 });
  });
});
