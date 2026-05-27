export function createCommentApi(apiUrl) {
  const base = apiUrl.replace(/\/$/, '');

  return {
    async getComments(prototypeId) {
      const res = await fetch(`${base}/api/prototypes/${prototypeId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json();
    },

    async createComment(prototypeId, data) {
      const res = await fetch(`${base}/api/prototypes/${prototypeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create comment');
      return res.json();
    },

    async updateComment(commentId, data) {
      const res = await fetch(`${base}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update comment');
      return res.json();
    },

    async deleteComment(commentId) {
      const res = await fetch(`${base}/api/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete comment');
    },

    async createReply(commentId, data) {
      const res = await fetch(`${base}/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create reply');
      return res.json();
    },

    async deleteReply(commentId, replyId) {
      const res = await fetch(`${base}/api/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete reply');
    }
  };
}
