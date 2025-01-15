"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactNode, useState} from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface ProvidersProps {
  children: ReactNode;
}
export default function Providers({children} :ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}