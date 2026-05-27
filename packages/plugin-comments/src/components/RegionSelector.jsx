import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

export function RegionSelector({ active, onSelect, onCancel }) {
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(null);
  const [current, setCurrent] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setDragging(false);
      setStart(null);
      setCurrent(null);
    }
  }, [active]);

  if (!active) return null;

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const point = { x: e.pageX, y: e.pageY };
    setStart(point);
    setCurrent(point);
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setCurrent({ x: e.pageX, y: e.pageY });
  };

  const handleMouseUp = (e) => {
    if (!dragging || !start) return;
    setDragging(false);

    const end = { x: e.pageX, y: e.pageY };
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    if (dx < 5 && dy < 5) {
      onSelect({ type: 'point', position: { x: start.x, y: start.y }, region: null });
    } else {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      onSelect({
        type: 'region',
        position: { x, y },
        region: { x, y, width: dx, height: dy }
      });
    }

    setStart(null);
    setCurrent(null);
  };

  const rect = start && current ? {
    left: Math.min(start.x, current.x),
    top: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y)
  } : null;

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100vh',
        height: `${document.documentElement.scrollHeight}px`,
        cursor: 'crosshair',
        pointerEvents: 'auto',
        zIndex: 99995
      }}
    >
      {rect && rect.width > 2 && rect.height > 2 && (
        <div style={{
          position: 'absolute',
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          border: '1.5px dashed rgba(23,23,23,0.4)',
          background: 'rgba(23,23,23,0.03)',
          borderRadius: '8px',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
}
