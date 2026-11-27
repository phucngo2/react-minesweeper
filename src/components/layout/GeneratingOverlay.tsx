import { isGeneratingBoardAtom } from "@app/stores";
import { useAtomValue } from "jotai";

// Fades in after a short delay, so the usual near-instant generation doesn't flash.
export const GeneratingOverlay = () => {
  const isGenerating = useAtomValue(isGeneratingBoardAtom);
  if (!isGenerating) return null;
  return (
    <div
      role="status"
      className="absolute inset-0 z-5 flex flex-col items-center justify-center gap-3 p-4 text-center generating-veil board-card"
    >
      <span className="spinner" aria-hidden />
      <span className="text-sm font-medium">Generating a no-guess board…</span>
    </div>
  );
};
