'use client';

import { CircleSubject, Connector } from '@visx/annotation';
import { AnimatedLineSeries, Annotation, Axis, XYChart } from '@visx/xychart';
import React, { FC, useState } from 'react';
import PriceGradient from './PriceGradient';
import { Grid, GridColumns } from '@visx/grid';
import { scaleBand, scaleLinear } from '@visx/scale';

export type GraphData = {
  name: string;
  data: [number, number | null][];
};

type PricePoint = {
  date: number;
  price: number | null;
};

type GraphProps = {
  today?: GraphData | null;
  tomorrow?: GraphData | null;
};

const getTimeRange = (date: number) => {
  const startHour = new Date(date).getHours();

  return (
    `0${startHour}`.slice(-2) +
    '-' +
    `0${startHour === 23 ? 0 : startHour + 1}`.slice(-2)
  );
};

const accessors = {
  xAccessor: ({ date }: PricePoint) => date,
  yAccessor: ({ price }: PricePoint) => price,
};

const Graph: FC<GraphProps> = ({ today, tomorrow }) => {
  const dataPoints: PricePoint[] = [
    ...(today ? today.data : []),
    ...(tomorrow ? tomorrow.data : []),
  ].map(([date, price]) => ({ date, price }));

  const nowX = new Date().setMinutes(0, 0, 0).valueOf();
  const [annotationSubject, setAnnotationSubject] = useState<PricePoint | null>(
    dataPoints.find(({ date }) => date === nowX) ?? null,
  );
  const prices = [...dataPoints.map(({ price }) => price)].filter(
    (price) => price !== null,
  ) as number[];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b-2 price-info">
        <div className="text-3xl">
          {annotationSubject ? annotationSubject.price : ' '}
          <span className="text-sm"> öre</span>
        </div>
        <div>
          {annotationSubject ? getTimeRange(annotationSubject.date) : ' '}
        </div>
      </div>

      <XYChart
        height={400}
        margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
      >
        <PriceGradient min={minPrice} max={maxPrice} id="line-gradient" />

        {/* {tomorrow && today && (
          <Annotation
            dataKey="data"
            datum={{ date: tomorrow.data[0][0], price: tomorrow.data[0][1] }}
            dx={0}
            dy={40}
          >
            <Connector
              stroke="var(--divider-line)"
              type="line"
              className="translate-y-[20px]"
            />
          </Annotation>
        )} */}

        {/* <GridColumns
          scale={scaleBand({})}
          height={300}
          tickValues={[tomorrow!.data[0][0]]}
          // rows={false}
          // stroke="var(--divider-line)"
        /> */}

        <Axis
          hideAxisLine
          hideTicks
          orientation="bottom"
          numTicks={100}
          tickComponent={({ formattedValue, x, y }) => (
            <text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="hanging"
              pointerEvents="none"
              fill="var(--axis-ticks)"
              fontSize={formattedValue === '00' ? 16 : 12}
            >
              {formattedValue}
            </text>
          )}
          tickFormat={(d: number) => {
            const hour = new Date(d).getHours();

            return hour % 6 ? '' : `0${hour}`.slice(-2);
          }}
        />
        <Axis
          hideAxisLine
          hideTicks
          orientation="left"
          tickComponent={({ formattedValue, x, y }) => (
            <text
              x={x}
              y={y}
              textAnchor="end"
              alignmentBaseline="middle"
              pointerEvents="none"
              fill="var(--axis-ticks)"
              stroke="none"
              fontSize={16}
            >
              {formattedValue}
            </text>
          )}
        />

        <AnimatedLineSeries<any, any, PricePoint>
          onPointerMove={(d: any): void => {
            setAnnotationSubject(d.datum as any);
          }}
          dataKey="data"
          strokeWidth={2}
          data={[
            ...dataPoints,
            // {
            //   price: null,
            //   date: new Date(dataPoints.at(-1)!.date + 24 * 60 * 60 * 1000)
            //     .setHours(0, 0, 0, 0)
            //     .valueOf(),
            // },
          ]}
          stroke="url(#line-gradient)"
          {...accessors}
        />
        <AnimatedLineSeries<any, any, PricePoint>
          dataKey="dataEnd"
          data={[
            {
              price: null,
              date: new Date(dataPoints.at(-1)!.date + 24 * 60 * 60 * 1000)
                .setHours(0, 0, 0, 0)
                .valueOf(),
            },
          ]}
          {...accessors}
        />

        {annotationSubject && (
          <Annotation
            dataKey="data"
            datum={annotationSubject}
            dx={0}
            dy={10000}
          >
            <Connector
              pathProps={{ strokeWidth: 1 }}
              stroke="var(--annotation-line)"
              type="line"
            />
            <CircleSubject
              stroke="var(--annotation-line)"
              fill="var(--annotation-line)"
              radius={6}
            />
          </Annotation>
        )}
      </XYChart>
    </>
  );
};

export default Graph;
