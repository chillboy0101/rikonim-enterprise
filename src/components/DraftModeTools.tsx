import { draftMode } from 'next/headers';
import { VisualEditingOverlay } from '@/components/VisualEditingOverlay';

export async function DraftModeTools() {
  const { isEnabled } = await draftMode();
  return <VisualEditingOverlay enabled={isEnabled} />;
}
