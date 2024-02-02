import { FC } from 'react';
import { GraphData } from '@/components/Graph/Graph';
import GraphArea from '@/components/GraphArea';
import { getNordPoolData } from '@/actions/getNordPoolData';

const getData = async (): Promise<{
  today: GraphData[];
  tomorrow: GraphData[];
}> => {
  const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const today = await getNordPoolData(new Date());
  const tomorrow = await getNordPoolData(tomorrowDate);

  return { today, tomorrow };
};

const HomePage: FC = async () => {
  const { today, tomorrow } = await getData();

  return (
    <div className="mx-auto max-w-[800px]">
      <GraphArea today={today} tomorrow={tomorrow} />
    </div>
  );
};

export default HomePage;
