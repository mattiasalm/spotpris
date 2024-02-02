import { FC } from 'react';
import { NordPoolPrices } from 'nordpool-prices';
import { toPrecision } from '@/utils/toPrecision';
import { GraphData } from '@/components/Graph/Graph';
import GraphArea from '@/components/GraphArea';

const getTodayDate = () => {
  const currentDate = new Date();
  const DD = currentDate.getDate();
  const MM = currentDate.getMonth() + 1;
  const YYYY = currentDate.getFullYear();

  return `${DD}-${MM}-${YYYY}`;
};

const getTomorrowDate = () => {
  const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const DD = currentDate.getDate();
  const MM = currentDate.getMonth() + 1;
  const YYYY = currentDate.getFullYear();

  return `${DD}-${MM}-${YYYY}`;
};

const getData = async (): Promise<{
  today: GraphData[];
  tomorrow: GraphData[];
}> => {
  const areas = ['SE1', 'SE2', 'SE3', 'SE4'];
  const currency = 'SEK';
  const dataToday = await NordPoolPrices.hourly({
    areas,
    currency,
    endDate: getTodayDate() as any,
  });
  const dataTomorrow = await NordPoolPrices.hourly({
    areas,
    currency,
    endDate: getTomorrowDate() as any,
  });
  let today: GraphData[] = [];
  let tomorrow: GraphData[] = [];

  dataToday.datePrices.forEach((d) => {
    d.areas.forEach(({ area, price }, index) => {
      const areaData = today[index]?.data ?? [];
      today[index] = {
        name: area,
        data: [
          ...areaData,
          [
            new Date(d.startDate).setMinutes(0, 0, 0).valueOf(),
            price !== null ? toPrecision.round((price / 10) * 1.25, 1) : null,
          ],
        ],
      };
    });
  });

  dataTomorrow.datePrices.forEach((d) => {
    d.areas.forEach(({ area, price }, index) => {
      const areaData = tomorrow[index]?.data ?? [];
      tomorrow[index] = {
        name: area,
        data: [
          ...areaData,
          [
            new Date(d.startDate).setMinutes(0, 0, 0).valueOf(),
            price !== null ? toPrecision.round((price / 10) * 1.25, 1) : null,
          ],
        ],
      };
    });
  });

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
