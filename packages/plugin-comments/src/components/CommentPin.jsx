import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export function CommentPin({ comment, number, isSelected, onClick }) {
  const hasRegion = comment.type === 'region' && comment.region;

  // Calculate scaled position based on viewport changes
  const [position, setPosition] = useState(comment.position);
  const [regionDimensions, setRegionDimensions] = useState(comment.region);

  useEffect(() => {
    const updatePosition = () => {
      if (!comment.position.xPercent) {
        // Legacy comment without percentage data - use original pixel position
        setPosition(comment.position);
        setRegionDimensions(comment.region);
        return;
      }

      // Calculate X position from percentage based on current document width
      // Keep Y position absolute (document height doesn't scale with viewport)
      const currentDocWidth = document.documentElement.scrollWidth;

      const scaledPosition = {
        x: (comment.position.xPercent / 100) * currentDocWidth,
        y: comment.position.y  // Keep Y absolute - vertical content doesn't scale
      };

      setPosition(scaledPosition);

      // Scale region width only, keep height and Y absolute
      if (comment.region && comment.region.widthPercent) {
        setRegionDimensions({
          x: (comment.position.xPercent / 100) * currentDocWidth,
          y: comment.position.y,  // Keep Y absolute
          width: (comment.region.widthPercent / 100) * currentDocWidth,
          height: comment.region.height  // Keep height absolute
        });
      } else if (comment.region) {
        // Legacy region without percentages
        setRegionDimensions(comment.region);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [comment]);

  return (
    <div
      className={`pf-pin ${isSelected ? 'pf-pin--selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        pointerEvents: 'auto',
        zIndex: 99996,
        transform: 'translate(-12px, -12px)',
        cursor: 'pointer'
      }}
      onClick={(e) => { e.stopPropagation(); onClick(comment); }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '9999px',
        background: isSelected ? '#171717' : '#171717',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
        boxShadow: isSelected
          ? '0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a, 0 0 0 2px #ffffff, 0 0 0 4px #171717'
          : '0px 1px 1px #00000005, 0px 2px 2px #0000000a',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)'
      }}>
        {number}
      </div>

      {hasRegion && regionDimensions && (
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          width: `${regionDimensions.width}px`,
          height: `${regionDimensions.height}px`,
          border: '1.5px solid rgba(23,23,23,0.35)',
          background: 'rgba(23,23,23,0.04)',
          borderRadius: '8px',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
}
