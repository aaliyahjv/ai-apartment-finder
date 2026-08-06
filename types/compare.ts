export const MAX_COMPARE_APARTMENTS = 3;

export const COMPARE_SELECTION_STORAGE_KEY = "apartment-compare-ids";

/** Stable empty snapshot for useSyncExternalStore (must not allocate per call). */
const EMPTY_COMPARE_SELECTION: string[] = [];

export function readCompareSelectionFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.sessionStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function writeCompareSelectionToStorage(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(
    COMPARE_SELECTION_STORAGE_KEY,
    JSON.stringify(ids.slice(0, MAX_COMPARE_APARTMENTS)),
  );
}

let cachedSelectionIds: string[] | null = null;
const selectionListeners = new Set<() => void>();

function notifyCompareSelectionChange() {
  selectionListeners.forEach((listener) => listener());
}

export function subscribeCompareSelection(listener: () => void) {
  selectionListeners.add(listener);
  return () => {
    selectionListeners.delete(listener);
  };
}

export function getCompareSelectionServerSnapshot(): string[] {
  return EMPTY_COMPARE_SELECTION;
}

export function getCompareSelectionSnapshot(): string[] {
  if (typeof window === "undefined") {
    return EMPTY_COMPARE_SELECTION;
  }
  if (cachedSelectionIds === null) {
    const fromStorage = readCompareSelectionFromStorage();
    cachedSelectionIds =
      fromStorage.length === 0 ? EMPTY_COMPARE_SELECTION : fromStorage;
  }
  return cachedSelectionIds;
}

export function updateCompareSelection(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  const next = ids.slice(0, MAX_COMPARE_APARTMENTS);
  cachedSelectionIds =
    next.length === 0 ? EMPTY_COMPARE_SELECTION : next;
  writeCompareSelectionToStorage(next);
  notifyCompareSelectionChange();
}
