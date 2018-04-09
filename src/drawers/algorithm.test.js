import { dynamicTimeWarpingMatches } from './algorithms';

it('computes dynamic time warping of two empty series', () => {
  expect(dynamicTimeWarpingMatches([], [])).toEqual([]);
});

it('computes dynamic time warping of to series', () => {
  const a = [1, 0.5, 8, 4];
  const b = [2, 1, 4, 4];
  expect(dynamicTimeWarpingMatches(a, b)).toEqual(
    [[3, 3], [2, 2], [1, 1], [0, 0]]
  );
})