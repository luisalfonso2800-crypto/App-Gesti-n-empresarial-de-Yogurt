const Decimal = require('decimal.js');
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

const toDecimal = (v) => {
  if (v === null || v === undefined) return new Decimal(0);
  return new Decimal(v.toString());
};
const toNumber = (d) => Number(d.toString());
const add = (a, b) => toDecimal(a).plus(toDecimal(b));
const sub = (a, b) => toDecimal(a).minus(toDecimal(b));
const mul = (a, b) => toDecimal(a).times(toDecimal(b));
const div = (a, b) => toDecimal(a).dividedBy(toDecimal(b));

module.exports = { Decimal, toDecimal, toNumber, add, sub, mul, div };
module.exports.default = module.exports;
