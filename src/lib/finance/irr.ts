const MAX_ITERATIONS = 100;
const TOLERANCE = 1e-7;

/**
 * Calculate Net Present Value for a series of cash flows at a given rate.
 */
function npv(rate: number, cashFlows: number[]): number {
  let total = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    total += cashFlows[i] / Math.pow(1 + rate, i);
  }
  return total;
}

/**
 * Derivative of NPV with respect to rate.
 */
function npvDerivative(rate: number, cashFlows: number[]): number {
  let total = 0;
  for (let i = 1; i < cashFlows.length; i++) {
    total -= (i * cashFlows[i]) / Math.pow(1 + rate, i + 1);
  }
  return total;
}

/**
 * Calculate Internal Rate of Return using Newton-Raphson with bisection fallback.
 *
 * @param cashFlows - Array of cash flows where index 0 is the initial investment (negative)
 * @returns IRR as a percentage, or NaN if it cannot converge
 */
export function calcIRR(cashFlows: number[]): number {
  if (cashFlows.length < 2) return NaN;

  // Check if all cash flows are the same sign (no IRR exists)
  const hasNegative = cashFlows.some((cf) => cf < 0);
  const hasPositive = cashFlows.some((cf) => cf > 0);
  if (!hasNegative || !hasPositive) return NaN;

  // Try Newton-Raphson first
  let rate = 0.1; // Initial guess: 10%

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const fValue = npv(rate, cashFlows);
    const fDerivative = npvDerivative(rate, cashFlows);

    if (Math.abs(fValue) < TOLERANCE) {
      return rate * 100;
    }

    if (Math.abs(fDerivative) < TOLERANCE) {
      break; // Derivative too small, fall through to bisection
    }

    const newRate = rate - fValue / fDerivative;

    // Guard against divergence
    if (newRate < -0.99 || newRate > 10) {
      break; // Fall through to bisection
    }

    rate = newRate;
  }

  // Bisection fallback
  let low = -0.99;
  let high = 10.0;
  let lowNpv = npv(low, cashFlows);

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    const midNpv = npv(mid, cashFlows);

    if (Math.abs(midNpv) < TOLERANCE || (high - low) / 2 < TOLERANCE) {
      return mid * 100;
    }

    if ((midNpv > 0) === (lowNpv > 0)) {
      low = mid;
      lowNpv = midNpv;
    } else {
      high = mid;
    }
  }

  return ((low + high) / 2) * 100;
}
