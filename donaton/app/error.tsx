'use client'; 

import AlertaDocker from '@/componentes/AlertaDocker';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logueamos el error para saber qué pasó exactamente
    console.error("Error capturado por el Global Boundary:", error);
  }, [error]);

  return (
    <AlertaDocker />
  );
}