"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 250;

/**
 * Wall-clock time is an external mutable source, so it is exposed as a proper
 * external store: one shared timer, a cached snapshot that React can compare,
 * and a server snapshot of 0 so hydration markup always matches.
 */
let now = typeof window === "undefined" ? 0 : Date.now();
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      for (const l of listeners) l();
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => now;
const getServerSnapshot = () => 0;

/** Re-renders the caller roughly four times a second. 0 until hydration. */
export function useClock(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const neverChanges = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

/**
 * False on the server and during hydration, true afterwards. Anything derived
 * from localStorage has to wait for this to avoid a markup mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(neverChanges, clientTrue, serverFalse);
}
