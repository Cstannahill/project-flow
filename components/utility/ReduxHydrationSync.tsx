import { useAuthSync } from "@/hooks/useAuthSync";

export function ReduxHydrationSync() {
  useAuthSync();
  return null; // doesn't render anything
}
