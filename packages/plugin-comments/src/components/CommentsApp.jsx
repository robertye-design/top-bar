import { h } from 'preact';
import { createPortal } from 'preact/compat';
import { CommentPin } from './CommentPin.jsx';
import { CommentSidebar } from './CommentSidebar.jsx';
import { RegionSelector } from './RegionSelector.jsx';

export function CommentsApp({
  comments, commentMode, selectedCommentId, showSidebar, newCommentPosition,
  onSelect, onSave, onUpdate, onDelete, onReply, onDeleteReply,
  onPinClick, onCloseSidebar
}) {
  const sidebarRoot = document.querySelector('.pf-sidebar-root');

  return (
    <div className="pf-comments-app">
      <RegionSelector
        active={commentMode}
        onSelect={onSelect}
        onCancel={() => {}}
      />

      {comments.map((comment, i) => (
        <CommentPin
          key={comment.id}
          comment={comment}
          number={i + 1}
          isSelected={selectedCommentId === comment.id}
          onClick={onPinClick}
        />
      ))}

      {showSidebar && sidebarRoot && createPortal(
        <CommentSidebar
          comments={comments}
          selectedCommentId={selectedCommentId}
          newCommentPosition={newCommentPosition}
          onSave={onSave}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReply={onReply}
          onDeleteReply={onDeleteReply}
          onClose={onCloseSidebar}
          onSelect={onPinClick}
        />,
        sidebarRoot
      )}
    </div>
  );
}
