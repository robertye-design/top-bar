import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

export class JsonStorage {
  constructor(dataDir) {
    this.dataDir = dataDir;
    mkdirSync(dataDir, { recursive: true });
  }

  _filePath(prototypeId) {
    const dir = join(this.dataDir, 'prototypes', prototypeId);
    mkdirSync(dir, { recursive: true });
    return join(dir, 'comments.json');
  }

  _read(prototypeId) {
    const path = this._filePath(prototypeId);
    try {
      return JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      return [];
    }
  }

  _write(prototypeId, comments) {
    const path = this._filePath(prototypeId);
    writeFileSync(path, JSON.stringify(comments, null, 2));
  }

  _allPrototypeIds() {
    const prototypesDir = join(this.dataDir, 'prototypes');
    if (!existsSync(prototypesDir)) return [];
    return readdirSync(prototypesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  }

  _findCommentAcrossPrototypes(commentId) {
    for (const pid of this._allPrototypeIds()) {
      const comments = this._read(pid);
      const index = comments.findIndex(c => c.id === commentId);
      if (index !== -1) {
        return { prototypeId: pid, comments, index };
      }
    }
    return null;
  }

  getComments(prototypeId) {
    return this._read(prototypeId);
  }

  addComment(prototypeId, data) {
    const comment = {
      id: randomUUID(),
      type: data.type,
      componentId: data.componentId || null,
      componentLabel: data.componentLabel || null,
      isSelector: data.isSelector || false,
      position: data.position,
      viewport: data.viewport || null,
      region: data.region || null,
      authorName: data.authorName,
      text: data.text,
      timestamp: Date.now(),
      resolved: false,
      replies: []
    };
    const comments = this._read(prototypeId);
    comments.push(comment);
    this._write(prototypeId, comments);
    return comment;
  }

  updateComment(commentId, updates) {
    const found = this._findCommentAcrossPrototypes(commentId);
    if (!found) return null;

    const { prototypeId, comments, index } = found;
    if (updates.text !== undefined) comments[index].text = updates.text;
    if (updates.resolved !== undefined) comments[index].resolved = updates.resolved;
    this._write(prototypeId, comments);
    return comments[index];
  }

  deleteComment(commentId) {
    const found = this._findCommentAcrossPrototypes(commentId);
    if (!found) return false;

    const { prototypeId, comments, index } = found;
    comments.splice(index, 1);
    this._write(prototypeId, comments);
    return true;
  }

  addReply(commentId, data) {
    const found = this._findCommentAcrossPrototypes(commentId);
    if (!found) return null;

    const { prototypeId, comments, index } = found;
    const reply = {
      id: randomUUID(),
      authorName: data.authorName,
      text: data.text,
      timestamp: Date.now()
    };
    if (!comments[index].replies) comments[index].replies = [];
    comments[index].replies.push(reply);
    this._write(prototypeId, comments);
    return reply;
  }

  deleteReply(commentId, replyId) {
    const found = this._findCommentAcrossPrototypes(commentId);
    if (!found) return false;

    const { prototypeId, comments, index } = found;
    const replies = comments[index].replies || [];
    const replyIndex = replies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) return false;

    replies.splice(replyIndex, 1);
    this._write(prototypeId, comments);
    return true;
  }
}
