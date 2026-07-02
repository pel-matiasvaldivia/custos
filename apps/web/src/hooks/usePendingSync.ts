import { useEffect, useState } from 'react';
import { subscribePending } from '../offline/outbox';

/** Cantidad de acciones offline pendientes de sincronizar (reactivo). */
export const usePendingSync = (): number => {
  const [count, setCount] = useState(0);
  useEffect(() => subscribePending(setCount), []);
  return count;
};
