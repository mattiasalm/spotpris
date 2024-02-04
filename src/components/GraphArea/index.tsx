'use client';

import { FC, PropsWithChildren, useState } from 'react';
import { GraphData } from '../Graph/Graph';
import Graph from '../Graph';
import classNames from 'classnames';

type GraphAreaProps = {
  today: GraphData[];
  tomorrow: GraphData[];
};

const Button: FC<
  PropsWithChildren<{ onClick: () => void; active: boolean }>
> = ({ onClick, children, active }) => {
  return (
    <button
      className={classNames(
        'p-2 bg-emerald-200 border-4 text-emerald-700 rounded-md',
        active ? 'border-emerald-700' : 'border-transparent',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const GraphArea: FC<GraphAreaProps> = ({ today, tomorrow }) => {
  const [area, setArea] = useState('SE3');
  const [range, setRange] = useState<'today' | 'tomorrow' | null>(null);

  return (
    <>
      <div className="p-4 grid gap-4 grid-cols-4">
        <Button active={area === 'SE1'} onClick={() => setArea('SE1')}>
          SE1
        </Button>
        <Button active={area === 'SE2'} onClick={() => setArea('SE2')}>
          SE2
        </Button>
        <Button active={area === 'SE3'} onClick={() => setArea('SE3')}>
          SE3
        </Button>
        <Button active={area === 'SE4'} onClick={() => setArea('SE4')}>
          SE4
        </Button>
      </div>

      <div className="p-4 grid gap-4 grid-cols-4">
        <Button active={range === 'today'} onClick={() => setRange('today')}>
          Today
        </Button>
        <Button
          active={range === 'tomorrow'}
          onClick={() => setRange('tomorrow')}
        >
          Tomorrow
        </Button>
        <Button active={!range} onClick={() => setRange(null)}>
          Both
        </Button>
      </div>
      <div className="">
        <Graph
          today={
            range !== 'tomorrow' ? today.find((d) => d.name === area) : null
          }
          tomorrow={
            range !== 'today' ? tomorrow.find((d) => d.name === area) : null
          }
        />
      </div>
    </>
  );
};

export default GraphArea;
