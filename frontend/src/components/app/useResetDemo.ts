import { useCallback } from 'react';
import { services } from '../../services';
import { useConfirm } from '../ui/ConfirmDialog';

/** Confirm, clear demo state, reload so every view starts from the seed again. */
export function useResetDemo(): () => Promise<void> {
  const confirm = useConfirm();
  return useCallback(async () => {
    const ok = await confirm({
      title: 'Reset demo data?',
      body: 'Projects you created or deleted in this browser go back to the original sample data. Nothing outside this browser is affected.',
      confirmLabel: 'Reset demo data', danger: true,
    });
    if (!ok) return;
    services.resetDemoData();
    window.location.reload();
  }, [confirm]);
}
