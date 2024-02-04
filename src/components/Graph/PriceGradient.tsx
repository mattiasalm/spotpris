import { FC } from 'react';

type PriceGradientProps = {
  min: number;
  max: number;
  id: string;
};

const MID = 70;
const HIGH = 150;
const TRANSITION = 20;

const PriceGradient: FC<PriceGradientProps> = ({ min, max, id }) => {
  const range = max - min;
  const midOffset = (100 * (MID - min)) / range;
  const highOffset = (100 * (HIGH - min)) / range;

  return (
    <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
      <stop
        offset="0%"
        stop-color="var(--curve-low-price)"
        stop-opacity="1"
      ></stop>
      {max >= MID && (
        <>
          <stop
            offset={midOffset - TRANSITION / 2 + '%'}
            stop-color="var(--curve-low-price)"
            stop-opacity="1"
          ></stop>
          <stop
            offset={midOffset + TRANSITION / 2 + '%'}
            stop-color="var(--curve-mid-price)"
            stop-opacity="1"
          ></stop>
        </>
      )}
      {max >= HIGH && (
        <>
          <stop
            offset={highOffset - TRANSITION / 2 + '%'}
            stop-color="var(--curve-mid-price)"
            stop-opacity="1"
          ></stop>
          <stop
            offset={highOffset + TRANSITION / 2 + '%'}
            stop-color="var(--curve-high-price)"
            stop-opacity="1"
          ></stop>
        </>
      )}
    </linearGradient>
  );
};

export default PriceGradient;
