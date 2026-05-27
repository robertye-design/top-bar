import { h } from 'preact';
import { useState } from 'preact/hooks';

const FONT = 'Geist, Inter, system-ui, -apple-system, sans-serif';
const MONO = 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace';

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function CommentThread({ comment, number, onUpdate, onDelete, onReply, onDeleteReply }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState(() => localStorage.getItem('pf-author') || '');
  const [replyText, setReplyText] = useState('');

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    onUpdate(comment.id, { text: editText.trim() });
    setEditing(false);
  };

  const handleSubmitReply = () => {
    if (!replyAuthor.trim() || !replyText.trim()) return;
    localStorage.setItem('pf-author', replyAuthor.trim());
    onReply(comment.id, { authorName: replyAuthor.trim(), text: replyText.trim() });
    setReplyText('');
    setReplying(false);
  };

  return (
    <div className="pf-thread" style={{
      padding: '16px 24px',
      borderBottom: '1px solid #ebebeb',
      fontFamily: FONT,
      fontSize: '14px',
      letterSpacing: '-0.28px',
      lineHeight: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          background: '#171717',
          color: '#ffffff',
          width: '20px',
          height: '20px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 500,
          flexShrink: 0
        }}>{number}</span>
        <span style={{ fontWeight: 500, color: '#171717' }}>{comment.authorName}</span>
        <span style={{ color: '#888888', fontSize: '12px', fontFamily: MONO, marginLeft: 'auto' }}>
          {formatTime(comment.timestamp)}
        </span>
      </div>

      {editing ? (
        <div style={{ marginTop: '8px' }}>
          <textarea
            value={editText}
            onInput={(e) => setEditText(e.target.value)}
            style={{
              width: '100%', minHeight: '60px', padding: '8px 12px',
              border: '1px solid #ebebeb', borderRadius: '6px',
              fontSize: '14px', resize: 'vertical', boxSizing: 'border-box',
              fontFamily: FONT, color: '#171717', background: '#ffffff',
              letterSpacing: '-0.28px', lineHeight: '20px', outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={handleSaveEdit} style={btnPrimary}>Save</button>
            <button onClick={() => setEditing(false)} style={btnSecondary}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: '0 0 8px', color: '#4d4d4d', whiteSpace: 'pre-wrap' }}>{comment.text}</p>
      )}

      {!editing && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setEditing(true); setEditText(comment.text); }} style={btnLink}>Edit</button>
          <button onClick={() => { if (confirm('Delete this comment?')) onDelete(comment.id); }} style={btnLinkDanger}>Delete</button>
          <button onClick={() => setReplying(!replying)} style={btnLink}>Reply</button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '12px', paddingLeft: '16px', borderLeft: '1px solid #ebebeb' }}>
          {comment.replies.map(reply => (
            <div key={reply.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, fontSize: '13px', color: '#171717' }}>{reply.authorName}</span>
                <span style={{ color: '#888888', fontSize: '11px', fontFamily: MONO }}>{formatTime(reply.timestamp)}</span>
              </div>
              <p style={{ margin: 0, color: '#4d4d4d', fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: '18px' }}>{reply.text}</p>
              <button
                onClick={() => { if (confirm('Delete this reply?')) onDeleteReply(comment.id, reply.id); }}
                style={{ ...btnLinkDanger, fontSize: '11px', marginTop: '4px' }}
              >Delete</button>
            </div>
          ))}
        </div>
      )}

      {replying && (
        <div style={{ marginTop: '12px', paddingLeft: '16px' }}>
          <input
            type="text"
            placeholder="Your name"
            value={replyAuthor}
            onInput={(e) => setReplyAuthor(e.target.value)}
            style={{
              width: '100%', height: '32px', padding: '0 12px',
              border: '1px solid #ebebeb', borderRadius: '6px',
              fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box',
              fontFamily: FONT, color: '#171717', background: '#ffffff',
              letterSpacing: '-0.28px', outline: 'none'
            }}
          />
          <textarea
            placeholder="Write a reply..."
            value={replyText}
            onInput={(e) => setReplyText(e.target.value)}
            style={{
              width: '100%', minHeight: '50px', padding: '8px 12px',
              border: '1px solid #ebebeb', borderRadius: '6px',
              fontSize: '14px', resize: 'vertical', boxSizing: 'border-box',
              fontFamily: FONT, color: '#171717', background: '#ffffff',
              letterSpacing: '-0.28px', lineHeight: '20px', outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={handleSubmitReply} style={btnPrimary}>Reply</button>
            <button onClick={() => setReplying(false)} style={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary = {
  padding: '0 12px', height: '28px', borderRadius: '100px', border: 'none',
  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  background: '#171717', color: '#ffffff',
  fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
  letterSpacing: '-0.28px'
};

const btnSecondary = {
  padding: '0 12px', height: '28px', borderRadius: '100px',
  border: '1px solid #ebebeb',
  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  background: '#ffffff', color: '#171717',
  fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
  letterSpacing: '-0.28px'
};

const btnLink = {
  background: 'none', border: 'none', padding: 0, fontSize: '12px',
  color: '#4d4d4d', cursor: 'pointer', fontWeight: 500,
  fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
  letterSpacing: '-0.28px'
};

const btnLinkDanger = {
  ...btnLink,
  color: '#ee0000'
};
