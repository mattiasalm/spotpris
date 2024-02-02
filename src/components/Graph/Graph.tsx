'use client';

import { CircleSubject, Connector } from '@visx/annotation';
import { AnimatedLineSeries, Annotation, Axis, XYChart } from '@visx/xychart';
import React, { FC, useState } from 'react';

export type GraphData = {
  name: string;
  data: [number, number | null][];
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
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y,
};

const Graph: FC<GraphProps> = ({ today, tomorrow }) => {
  const dataPoints = [
    ...(today ? today.data : []),
    ...(tomorrow ? tomorrow.data : []),
  ].map(([x, y]) => ({ x, y }));

  const nowX = new Date().setMinutes(0, 0, 0).valueOf();
  const [annotationSubject, setAnnotationSubject] = useState<{
    x: number;
    y: number | null;
  } | null>(dataPoints.find(({ x }) => x === nowX) ?? null);

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b-4 border-[orange] text-[orange]">
        <div className="text-3xl">
          {annotationSubject ? annotationSubject.y : ' '}
          <span className="text-sm"> öre</span>
        </div>
        <div>{annotationSubject ? getTimeRange(annotationSubject.x) : ' '}</div>
      </div>
      <XYChart
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
        onPointerUp={(d) => {
          setAnnotationSubject(d.datum as any);
        }}
        onPointerMove={(d) => {
          setAnnotationSubject(d.datum as any);
        }}
      >
        <Axis orientation="bottom">
          {(props) => {
            console.log(props);

            return <></>;
          }}
        </Axis>
        <Axis orientation="left" />

        <AnimatedLineSeries dataKey="data" data={dataPoints} {...accessors} />

        {annotationSubject && (
          <Annotation
            dataKey="data"
            datum={annotationSubject}
            dx={0}
            dy={-1000}
          >
            <Connector stroke="orange" type="line" />
            <CircleSubject stroke="orange" />
            {/* <HtmlLabel
            showAnchorLine={false}
            // anchorLineStroke="orange"
            verticalAnchor="middle"
          >
            <div className="p-4 bg-white">
              <pre>{JSON.stringify(annotationSubject, null, 1)}</pre>
            </div>
          </HtmlLabel> */}
            {/* <AnnotationLabel title="hej" subtitle="hejsan" /> */}
          </Annotation>
        )}
      </XYChart>
    </>
  );
};

export default Graph;
