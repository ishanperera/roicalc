import { describe, it, expect } from 'vitest';
import { generateSensitivityMatrix } from '@/lib/finance/sensitivity';
import { DEFAULT_PROFORMA } from '@/lib/finance/defaults';

describe('generateSensitivityMatrix', () => {
  it('generates a 7x6 matrix by default', () => {
    const matrix = generateSensitivityMatrix(DEFAULT_PROFORMA);
    expect(matrix.cells.length).toBe(7);
    expect(matrix.cells[0].length).toBe(6);
  });

  it('has correct labels', () => {
    const matrix = generateSensitivityMatrix(DEFAULT_PROFORMA);
    expect(matrix.rowLabel).toBe('Exit Cap Rate (%)');
    expect(matrix.colLabel).toBe('Vacancy Rate (%)');
  });

  it('has base row and column indices', () => {
    const matrix = generateSensitivityMatrix(DEFAULT_PROFORMA);
    expect(matrix.baseRowIndex).toBeGreaterThanOrEqual(0);
    expect(matrix.baseRowIndex).toBeLessThan(7);
    expect(matrix.baseColIndex).toBeGreaterThanOrEqual(0);
    expect(matrix.baseColIndex).toBeLessThan(6);
  });

  it('each cell has IRR and CoC values', () => {
    const matrix = generateSensitivityMatrix(DEFAULT_PROFORMA);
    for (const row of matrix.cells) {
      for (const cell of row) {
        expect(typeof cell.irr).toBe('number');
        expect(typeof cell.coc).toBe('number');
        expect(typeof cell.rowParam).toBe('number');
        expect(typeof cell.colParam).toBe('number');
      }
    }
  });

  it('higher vacancy reduces CoC', () => {
    const matrix = generateSensitivityMatrix(DEFAULT_PROFORMA);
    const baseRow = matrix.cells[matrix.baseRowIndex];
    // Compare first col (low vacancy) vs last col (high vacancy)
    expect(baseRow[0].coc).toBeGreaterThan(baseRow[baseRow.length - 1].coc);
  });

  it('accepts custom dimensions', () => {
    const matrix = generateSensitivityMatrix(DEFAULT_PROFORMA, 5, 4);
    expect(matrix.cells.length).toBe(5);
    expect(matrix.cells[0].length).toBe(4);
  });

  it('completes in reasonable time (< 2s for 42 cells)', () => {
    const start = performance.now();
    generateSensitivityMatrix(DEFAULT_PROFORMA);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(2000);
  });
});
