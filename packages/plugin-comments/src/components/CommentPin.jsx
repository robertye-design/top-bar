import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export function CommentPin({ comment, number, isSelected, onClick }) {
  const hasRegion = comment.region;
  const [position, setPosition] = useState(comment.position);
  const [regionDimensions, setRegionDimensions] = useState(comment.region);

  useEffect(() => {
    const updatePosition = () => {
      // V1.1: Component-based positioning
      if (comment.componentId && comment.type === 'component') {
        // Find element by componentId or CSS selector
        const selector = comment.isSelector
          ? comment.componentId
          : `[data-comment-id="${comment.componentId}"]`;

        const element = document.querySelector(selector);

        if (element) {
          // Use getBoundingClientRect for perfect positioning
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

          setPosition({
            x: rect.left + scrollLeft + (rect.width / 2),  // Center of element
            y: rect.top + scrollTop + 10  // Slightly below top
          });

          // Update region to match element bounds
          if (comment.region) {
            setRegionDimensions({
              x: rect.left + scrollLeft,
              y: rect.top + scrollTop,
              width: rect.width,
              height: rect.height
            });
          }
          return;
        }
        // Element not found - fall through to legacy positioning
      }

      // Legacy positioning (V1.0 - percentage based)
      if (comment.position.xPercent) {
        const currentDocWidth = document.documentElement.scrollWidth;
        const scaledPosition = {
          x: (comment.position.xPercent / 100) * currentDocWidth,
          y: comment.position.y
        };
        setPosition(scaledPosition);

        if (comment.region && comment.region.widthPercent) {
          setRegionDimensions({
            x: (comment.position.xPercent / 100) * currentDocWidth,
            y: comment.position.y,
            width: (comment.region.widthPercent / 100) * currentDocWidth,
            height: comment.region.height
          });
        } else if (comment.region) {
          setRegionDimensions(comment.region);
        }
        return;
      }

      // Fallback: Use stored pixel position
      setPosition(comment.position);
      setRegionDimensions(comment.region);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
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
