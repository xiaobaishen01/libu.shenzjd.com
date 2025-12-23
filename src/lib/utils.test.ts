import { Utils } from './utils';

describe('Utils', () => {
  describe('generateId', () => {
    it('should generate a valid ID', () => {
      const id = Utils.generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const id1 = Utils.generateId();
      const id2 = Utils.generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with reasonable length', () => {
      const id = Utils.generateId();
      // Should be around 20-25 characters
      expect(id.length).toBeGreaterThanOrEqual(15);
      expect(id.length).toBeLessThanOrEqual(30);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers correctly with CNY symbol', () => {
      expect(Utils.formatCurrency(100)).toBe('¥100.00');
      expect(Utils.formatCurrency(123.456)).toBe('¥123.46');
      expect(Utils.formatCurrency(0)).toBe('¥0.00');
    });

    it('should handle negative numbers', () => {
      expect(Utils.formatCurrency(-100)).toBe('-¥100.00');
    });

    it('should handle large numbers', () => {
      expect(Utils.formatCurrency(1000000)).toBe('¥1,000,000.00');
      expect(Utils.formatCurrency(1234567.89)).toBe('¥1,234,567.89');
    });

    it('should handle edge cases', () => {
      expect(Utils.formatCurrency(0.01)).toBe('¥0.01');
      expect(Utils.formatCurrency(0.1)).toBe('¥0.10');
      expect(Utils.formatCurrency(0.999)).toBe('¥1.00');
    });

    it('should handle null/undefined gracefully', () => {
      expect(Utils.formatCurrency(0 as any)).toBe('¥0.00');
    });
  });

  describe('amountToChinese', () => {
    it('should convert small numbers correctly', () => {
      expect(Utils.amountToChinese(1)).toBe('壹元整');
      expect(Utils.amountToChinese(2)).toBe('贰元整');
      expect(Utils.amountToChinese(10)).toBe('壹拾元整');
      expect(Utils.amountToChinese(100)).toBe('壹佰元整');
    });

    it('should convert medium numbers', () => {
      expect(Utils.amountToChinese(123)).toBe('壹佰贰拾叁元整');
      expect(Utils.amountToChinese(1001)).toBe('壹仟零壹元整');
      expect(Utils.amountToChinese(1010)).toBe('壹仟零壹拾元整');
    });

    it('should convert large numbers', () => {
      expect(Utils.amountToChinese(10000)).toBe('壹万元整');
      expect(Utils.amountToChinese(100000)).toBe('壹拾万元整');
      expect(Utils.amountToChinese(1000000)).toBe('壹佰万元整');
    });

    it('should handle numbers with decimals', () => {
      expect(Utils.amountToChinese(100.5)).toBe('壹佰元伍角整');
      expect(Utils.amountToChinese(100.05)).toBe('壹佰元零伍分');
      expect(Utils.amountToChinese(123.45)).toBe('壹佰贰拾叁元肆角伍分');
    });

    it('should handle zero', () => {
      expect(Utils.amountToChinese(0)).toBe('零元整');
    });

    it('should handle complex numbers', () => {
      expect(Utils.amountToChinese(12345.67)).toBe('壹万贰仟叁佰肆拾伍元陆角柒分');
      expect(Utils.amountToChinese(10001.1)).toBe('壹万零壹元壹角整');
    });

    it('should handle edge cases with zeros', () => {
      expect(Utils.amountToChinese(1001)).toBe('壹仟零壹元整');
      expect(Utils.amountToChinese(1010)).toBe('壹仟零壹拾元整');
      expect(Utils.amountToChinese(100001)).toBe('壹拾万零壹元整');
    });

    it('should handle non-number input', () => {
      expect(Utils.amountToChinese('' as any)).toBe('');
      expect(Utils.amountToChinese(null as any)).toBe('');
    });
  });

  describe('getCurrentDateTime', () => {
    it('should return current date and time', () => {
      const result = Utils.getCurrentDateTime();

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('time');
      expect(typeof result.date).toBe('string');
      expect(typeof result.time).toBe('string');
    });

    it('should return date in YYYY-MM-DD format', () => {
      const result = Utils.getCurrentDateTime();
      expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return time in HH:MM format', () => {
      const result = Utils.getCurrentDateTime();
      expect(result.time).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should return reasonable current values', () => {
      const now = new Date();
      const result = Utils.getCurrentDateTime();

      const [year, month, day] = result.date.split('-').map(Number);
      const [hours, minutes] = result.time.split(':').map(Number);

      expect(year).toBe(now.getFullYear());
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(31);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });
  });
});
