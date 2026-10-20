/** Tiny change bus: services announce writes, views refetch. Replaces ad-hoc prop drilling. */
type Listener = () => void;
const listeners = new Set<Listener>();

export function onDataChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function emitDataChange(): void {
  listeners.forEach((l) => l());
}
