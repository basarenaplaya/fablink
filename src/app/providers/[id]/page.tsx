'use client';

import { use } from 'react';

import { ProviderProfileView } from '@/components/profile/ProviderProfileView';
import { useProvider } from '@/hooks/useProvider';

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const { id } = use(params);
  const { provider, loading, error } = useProvider(id);

  return (
    <ProviderProfileView provider={provider} loading={loading} error={error} />
  );
}
