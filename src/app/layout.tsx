import type { Metadata } from 'next';
import './globals.css';
import { FC, PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Spotpris',
  description: '',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
