'use client';

import { CircleSubject, Connector, HtmlLabel } from '@visx/annotation';
import {
  AnimatedLineSeries,
  Annotation,
  AnnotationCircleSubject,
  AnnotationConnector,
  AnnotationLabel,
  Axis,
  Tooltip,
  XYChart,
} from '@visx/xychart';
import React, { FC, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// import {
//   HtmlLabel,
//   Label,
//   Connector,
//   CircleSubject,
//   LineSubject,
//   Annotation,
// } from '@visx/annotation';

export type GraphData = {
  name: string;
  data: [number, number | null][];
};

type GraphProps = {
  today?: GraphData | null;
  tomorrow?: GraphData | null;
};

const Graph: FC<GraphProps> = ({ today, tomorrow }) => {
  // const lastDate = tomorrow?.data.at(-1)?.[0] ?? null;
  // const dividerX =
  //   lastDate && today
  //     ? new Date(lastDate).setHours(0, 0, 0, 0).valueOf()
  //     : null;

  const dataPoints = [
    ...(today ? today.data : []),
    ...(tomorrow ? tomorrow.data : []),
  ].map(([x, y]) => ({ x, y }));
  // const data: GraphData = {
  //   name: today?.name || tomorrow?.name || '',
  //   data: dataPoints,
  // };

  // const now = new Date();
  // const nowX = new Date().setMinutes(0, 0, 0).valueOf();
  // const nowValue = dataPoints.find((point) => point[0] === nowX)?.[1] ?? null;

  // const data1 = [
  //   { x: '2020-01-01', y: 50 },
  //   { x: '2020-01-02', y: 10 },
  //   { x: '2020-01-03', y: 20 },
  // ];
  const accessors = {
    xAccessor: (d: any) => d.x,
    yAccessor: (d: any) => d.y,
  };
  const nowX = new Date().setMinutes(0, 0, 0).valueOf();
  const [annotationSubject, setAnnotationSubject] = useState<{
    x: number;
    y: number | null;
  } | null>(dataPoints.find(({ x }) => x === nowX) ?? null);

  const getTimeRange = (date: number) => {
    const startHour = new Date(date).getHours();

    return (
      `0${startHour}`.slice(-2) +
      '–' +
      `0${startHour === 23 ? 0 : startHour + 1}`.slice(-2)
    );
  };

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
            <Connector stroke="orange" type="elbow" />
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

        {/* <Annotation x={dataPoints[2].x} y={dataPoints[2].y!}>
        <Connector stroke="orange" type="elbow" />
        <CircleSubject />
        <Label title="Context about this point" subtitle="More deets" />
      </Annotation> */}

        {/* <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) =>
          tooltipData && colorScale ? (
            <div>
              <div style={{ color: colorScale(tooltipData.nearestDatum!.key) }}>
                {tooltipData.nearestDatum?.key}
              </div>
              {accessors.xAccessor(tooltipData.nearestDatum!.datum)}
              {', '}
              {accessors.yAccessor(tooltipData.nearestDatum!.datum)}
            </div>
          ) : null
        }
      /> */}
      </XYChart>
    </>
    // <div>
    //   <XYChart
    //     height={600}
    //     width={600}
    //     // theme={theme}
    //     // xScale={config.x}
    //     // yScale={config.y}
    //     // height={Math.min(400, height)}
    //     // captureEvents={!editAnnotationLabelPosition}
    //     // onPointerUp={(d) => {
    //     //   setAnnotationDataKey(d.key as 'New York' | 'San Francisco' | 'Austin');
    //     //   setAnnotationDataIndex(d.index);
    //     // }}
    //   >
    //     <LineSeries
    //       dataKey={data.name}
    //       data={data1}
    //       {...accessors}
    //       // xAccessor={accessors.x.Austin}
    //       // yAccessor={accessors.y.Austin}
    //       // curve={curve}
    //     />
    //   </XYChart>
    // </div>
    // <ReactApexChart
    //   series={[data]}
    //   type="line"
    //   height="100%"
    //   options={{
    //     stroke: {
    //       curve: 'stepline',
    //     },
    //     annotations: {
    //       xaxis: [
    //         {
    //           x: dividerX,
    //           strokeDashArray: 0,
    //         },
    //         ...(nowValue !== null
    //           ? [
    //               {
    //                 x: now.valueOf(),
    //                 strokeDashArray: 0,
    //                 label: {
    //                   position: 'bottom',
    //                   orientation: 'horizontal',
    //                   text: `${nowValue} öre${now.getHours()}:${now.getMinutes()}`,
    //                 },
    //               },
    //             ]
    //           : []),
    //       ],
    //       // points: [
    //       //   {
    //       //     x: new Date('27 Nov 2017').getTime(),
    //       //     y: 8500.9,
    //       //     marker: {
    //       //       size: 6,
    //       //       fillColor: '#fff',
    //       //       strokeColor: '#2698FF',
    //       //       radius: 2,
    //       //     },
    //       //     label: {
    //       //       borderColor: '#FF4560',
    //       //       offsetY: 0,
    //       //       style: {
    //       //         color: '#fff',
    //       //         background: '#FF4560',
    //       //       },

    //       //       text: 'Point Annotation (XY)',
    //       //     },
    //       //   },
    //       // ],
    //     },
    //     chart: {
    //       type: 'area',
    //       stacked: false,
    //       height: '100%',
    //       zoom: {
    //         enabled: false,
    //       },
    //       toolbar: {
    //         show: false,
    //       },
    //       animations: {
    //         enabled: false,
    //       },
    //       events: {
    //         updated: function (chartContext, config) {
    //           console.log(chartContext, config);
    //         },
    //       },
    //     },
    //     dataLabels: {
    //       enabled: false,
    //     },
    //     markers: {
    //       size: 0,
    //       strokeWidth: 0,
    //     },
    //     yaxis: {
    //       labels: {
    //         formatter: (value: number) => `${Math.round(value)}`,
    //       },
    //     },
    //     xaxis: {
    //       tooltip: {
    //         enabled: false,
    //       },
    //       axisTicks: {
    //         show: false,
    //       },
    //       labels: {
    //         style: {
    //           cssClass: 'apexcharts-xaxis-label',
    //         },
    //         formatter: (_, timestamp) => {
    //           if (!timestamp) {
    //             return '';
    //           }

    //           const d = new Date(timestamp).getHours();

    //           return d % 6 ? '' : `0${d}`.slice(-2);
    //         },
    //       },
    //     },
    //     tooltip: {
    //       shared: true,
    //       fixed: {
    //         enabled: true,
    //         position: 'topLeft',
    //       },
    //       custom: function ({ dataPointIndex, w }) {
    //         const values: { name: string; value: string }[] =
    //           w.globals.initialSeries.map((serie: any) => ({
    //             name: serie.name,
    //             value: serie.data[dataPointIndex][1],
    //           }));
    //         const startDate =
    //           w.globals.initialSeries[0].data[dataPointIndex][0];
    //         const startHour = new Date(startDate).getHours();
    //         const timePeriod =
    //           `0${startHour}`.slice(-2) +
    //           '–' +
    //           `0${startHour === 23 ? 0 : startHour + 1}`.slice(-2);

    //         if (values.some((d) => d.value === null)) {
    //           return null;
    //         }

    //         return (
    //           '<div class="p-4">' +
    //           values.reduce(
    //             (acc, curr) => acc + `${curr.name}: ${curr.value} öre<br/>`,
    //             '',
    //           ) +
    //           timePeriod +
    //           '</div>'
    //         );
    //       },
    //     },
    //   }}
    // />
  );
};

export default Graph;
