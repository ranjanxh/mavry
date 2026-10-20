import { useRef, useState, type PointerEvent } from 'react';

/** Lets a positioned element be dragged with the pointer. Controls inside it stay clickable. */
export function useDrag() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const origin = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    origin.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
    setDragging(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const o = origin.current;
    if (!o) return;
    setPos({ x: o.x + e.clientX - o.px, y: o.y + e.clientY - o.py });
  };
  const end = (e: PointerEvent<HTMLElement>) => {
    if (!origin.current) return;
    origin.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return { pos, dragging, bind: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end } };
}
