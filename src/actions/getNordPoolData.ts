'use server';

import { GraphData } from '@/components/Graph/Graph';
import { toPrecision } from '@/utils/toPrecision';
import { EndDate, NordPoolPrices, ParsedResponse } from 'nordpool-prices';
import { put, list } from '@vercel/blob';

const formatDate = (date: Date) => {
  const DD = date.getDate();
  const MM = date.getMonth() + 1;
  const YYYY = date.getFullYear();

  return `${DD}-${MM}-${YYYY}` as EndDate;
};

const formatData = ({ datePrices }: ParsedResponse) => {
  let formatted: GraphData[] = [];

  datePrices.forEach((d) =>
    d.areas.forEach(({ area, price }, index) => {
      const areaData = formatted[index]?.data ?? [];
      formatted[index] = {
        name: area,
        data: [
          ...areaData,
          [
            new Date(d.startDate).setMinutes(0, 0, 0).valueOf(),
            price !== null ? toPrecision.round((price / 10) * 1.25, 1) : null,
          ],
        ],
      };
    }),
  );

  return formatted;
};

const isGraphDataValid = (graphData: GraphData[]) =>
  graphData.every(({ data }) => data.every(([_, price]) => price !== null));

export const getNordPoolData = async (date: Date): Promise<GraphData[]> => {
  const areas = ['SE1', 'SE2', 'SE3', 'SE4'];
  const currency = 'SEK';
  const endDate = formatDate(date);

  const filePath = `${endDate}/${areas.join('_')}`;

  const { blobs } = await list({ prefix: endDate });
  const existingFile = blobs.find((b) => b.pathname === filePath);
  if (existingFile) {
    const fileData = await fetch(existingFile.url, {
      next: { revalidate: 120 },
    }).then((res) => res.json());

    return fileData;
  } else {
    const data = await NordPoolPrices.hourly({
      areas,
      currency,
      endDate,
    });
    const formatted = formatData(data);
    if (isGraphDataValid(formatted)) {
      await put(filePath, JSON.stringify(formatted), {
        access: 'public',
        contentType: 'text/plain',
        addRandomSuffix: false,
      });
    }

    return formatted;
  }
};
