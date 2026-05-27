import { h } from 'preact';
import { useState } from 'preact/hooks';
import { CommentThread } from './CommentThread.jsx';

const FONT = 'Geist, Inter, system-ui, -apple-system, sans-serif';

export function CommentSidebar({
  comments, selectedCommentId, newCommentPosition,
  onSave, onUpdate, onDelete, onReply, onDeleteReply, onClose, onSelect
}) {
  const [author, setAuthor] = useState(() => localStorage.getItem('pf-author') || '');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    localStorage.setItem('pf-author', author.trim());
    onSave({ authorName: author.trim(), text: text.trim() });
    setText('');
  };

  return (
    <div className="pf-sidebar" style={{
      position: 'fixed',
      top: '64px',
      right: 0,
      bottom: 0,
      width: '360px',
      background: '#ffffff',
      boxShadow: '0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f, inset 0 0 0 1px #ebebeb',
      zIndex: 99998,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: FONT,
      fontSize: '14px',
      letterSpacing: '-0.28px',
      lineHeight: '20px',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #ebebeb',
        flexShrink: 0
      }}>
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#171717', letterSpacing: '-0.28px' }}>Comments</h2>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          style={{
            background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
            color: '#888888', padding: '0 4px', lineHeight: 1,
            fontFamily: FONT
          }}
        >&times;</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {newCommentPosition && (
          <form onSubmit={handleSubmit} style={{
            padding: '16px 24px',
            borderBottom: '1px solid #ebebeb',
            background: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 500, color: '#171717', letterSpacing: '-0.28px' }}>
              New Comment
            </h3>
            <input
              type="text"
              placeholder="Your name"
              value={author}
              onInput={(e) => setAuthor(e.target.value)}
              required
              style={{
                width: '100%', height: '32px', padding: '0 12px',
                border: '1px solid #ebebeb', borderRadius: '6px',
                fontSize: '14px', letterSpacing: '-0.28px',
                marginBottom: '8px', boxSizing: 'border-box',
                fontFamily: FONT, color: '#171717', background: '#ffffff',
                outline: 'none'
              }}
            />
            <textarea
              placeholder="Write your comment..."
              value={text}
              onInput={(e) => setText(e.target.value)}
              required
              rows={3}
              style={{
                width: '100%', padding: '8px 12px',
                border: '1px solid #ebebeb', borderRadius: '6px',
                fontSize: '14px', letterSpacing: '-0.28px',
                resize: 'vertical', boxSizing: 'border-box',
                fontFamily: FONT, color: '#171717', background: '#ffffff',
                outline: 'none', lineHeight: '20px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} style={{
                padding: '0 12px', height: '32px', borderRadius: '100px',
                border: '1px solid #ebebeb', fontSize: '14px',
                fontWeight: 500, cursor: 'pointer', background: '#ffffff', color: '#171717',
                fontFamily: FONT, letterSpacing: '-0.28px'
              }}>Cancel</button>
              <button type="submit" style={{
                padding: '0 12px', height: '32px', borderRadius: '100px',
                border: 'none', fontSize: '14px',
                fontWeight: 500, cursor: 'pointer', background: '#171717', color: '#ffffff',
                fontFamily: FONT, letterSpacing: '-0.28px'
              }}>Save</button>
            </div>
          </form>
        )}

        {comments.length === 0 && !newCommentPosition ? (
          <p style={{ padding: '24px', color: '#888888', textAlign: 'center', fontSize: '14px' }}>
            No comments yet. Click "Add Comment" to get started.
          </p>
        ) : (
          comments.map((comment, i) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              number={i + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReply={onReply}
              onDeleteReply={onDeleteReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
