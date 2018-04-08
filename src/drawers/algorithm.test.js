import { dynamicTimeWarping } from './algorithms';

it('computes dynamic time warping of two empty series', () => {
  expect(dynamicTimeWarping([], [])).toEqual(
    {
      distance: 0,
      path: [],
    }
  );
});

it('computes dynamic time warping of to series', () => {
  const a = [1, 0.5, 8, 4];
  const b = [2, 1, 4, 4];
  expect(dynamicTimeWarping(a, b)).toEqual(
    {
      distance: Math.sqrt(17.25),
      path: [[3, 3], [2, 2], [1, 1], [0, 0]],
    }
  );
})