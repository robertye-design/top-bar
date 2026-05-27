import { Router } from 'express';

export function createCommentRoutes(storage) {
  const router = Router();

  router.get('/prototypes/:prototypeId/comments', (req, res) => {
    try {
      const comments = storage.getComments(req.params.prototypeId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    }
  });

  router.post('/prototypes/:prototypeId/comments', (req, res) => {
    try {
      const { type, position, viewport, region, authorName, text } = req.body;

      if (!type || !position || !authorName || !text) {
        return res.status(400).json({ error: 'Missing required fields: type, position, authorName, text' });
      }

      if (type === 'region' && !region) {
        return res.status(400).json({ error: 'Region data required when type is "region"' });
      }

      const comment = storage.addComment(req.params.prototypeId, {
        type, position, viewport, region, authorName, text
      });
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  router.put('/comments/:commentId', (req, res) => {
    try {
      const { text, resolved } = req.body;
      const updated = storage.updateComment(req.params.commentId, { text, resolved });

      if (!updated) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update comment' });
    }
  });

  router.delete('/comments/:commentId', (req, res) => {
    try {
      const deleted = storage.deleteComment(req.params.commentId);

      if (!deleted) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  });

  router.post('/comments/:commentId/replies', (req, res) => {
    try {
      const { authorName, text } = req.body;

      if (!authorName || !text) {
        return res.status(400).json({ error: 'Missing required fields: authorName, text' });
      }

      const reply = storage.addReply(req.params.commentId, { authorName, text });

      if (!reply) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.status(201).json(reply);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create reply' });
    }
  });

  router.delete('/comments/:commentId/replies/:replyId', (req, res) => {
    try {
      const deleted = storage.deleteReply(req.params.commentId, req.params.replyId);

      if (!deleted) {
        return res.status(404).json({ error: 'Reply not found' });
      }

      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete reply' });
    }
  });

  return router;
}
