import { h, render } from 'preact';
import { createCommentApi } from './services/commentApi.js';
import { CommentsApp } from './components/CommentsApp.jsx';
import { TopBarUI } from './components/TopBarUI.jsx';
import './styles/comments.css';

export class CommentsPlugin {
  static pluginName = 'comments';

  constructor(framework) {
    this.framework = framework;
    this.api = createCommentApi(framework.config.apiUrl);
    this.comments = [];
    this.commentMode = false;
    this.selectedCommentId = null;
    this.showSidebar = false;
    this.newCommentPosition = null;
    this._appContainer = null;
    this._sidebarContainer = null;
  }

  init() {
    this._sidebarContainer = document.createElement('div');
    this._sidebarContainer.className = 'pf-sidebar-root';
    document.body.appendChild(this._sidebarContainer);

    this._loadComments();
    this._render();
  }

  destroy() {
    const overlay = this.framework.getOverlayContainer();
    render(null, overlay);
    render(null, this._sidebarContainer);
    this._sidebarContainer.remove();
  }

  getTopBarControls() {
    return h(TopBarUI, {
      getState: () => ({
        commentMode: this.commentMode,
        commentCount: this.comments.length
      }),
      eventBus: this.framework.eventBus,
      onToggleMode: () => this.toggleCommentMode()
    });
  }

  toggleCommentMode() {
    this.commentMode = !this.commentMode;
    if (!this.commentMode) {
      this.newCommentPosition = null;
    }
    this.showSidebar = false;
    this.selectedCommentId = null;
    this._emitStateChange();
    this._render();
  }

  async _loadComments() {
    try {
      this.comments = await this.api.getComments(this.framework.config.prototypeId);
      this._emitStateChange();
      this._render();
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }

  _emitStateChange() {
    this.framework.eventBus.emit('comments:statechange', {
      commentMode: this.commentMode,
      commentCount: this.comments.length
    });
    this.framework.eventBus.emit('topbar:update');
  }

  _handleSelect(selection) {
    this.newCommentPosition = selection;
    this.commentMode = false;
    this.showSidebar = true;
    this._emitStateChange();
    this._render();
  }

  async _handleSave(formData) {
    try {
      const data = {
        type: this.newCommentPosition.type,
        position: this.newCommentPosition.position,
        viewport: this.newCommentPosition.viewport,
        region: this.newCommentPosition.region,
        authorName: formData.authorName,
        text: formData.text
      };
      const created = await this.api.createComment(this.framework.config.prototypeId, data);
      this.comments.push(created);
      this.newCommentPosition = null;
      this.selectedCommentId = created.id;
      this._emitStateChange();
      this._render();
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  }

  async _handleUpdate(commentId, updates) {
    try {
      const updated = await this.api.updateComment(commentId, updates);
      this.comments = this.comments.map(c => c.id === commentId ? updated : c);
      this._render();
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  }

  async _handleDelete(commentId) {
    try {
      await this.api.deleteComment(commentId);
      this.comments = this.comments.filter(c => c.id !== commentId);
      if (this.selectedCommentId === commentId) {
        this.selectedCommentId = null;
      }
      this._emitStateChange();
      this._render();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  }

  async _handleReply(commentId, replyData) {
    try {
      const reply = await this.api.createReply(commentId, replyData);
      this.comments = this.comments.map(c => {
        if (c.id === commentId) {
          return { ...c, replies: [...(c.replies || []), reply] };
        }
        return c;
      });
      this._render();
    } catch (err) {
      console.error('Failed to create reply:', err);
    }
  }

  async _handleDeleteReply(commentId, replyId) {
    try {
      await this.api.deleteReply(commentId, replyId);
      this.comments = this.comments.map(c => {
        if (c.id === commentId) {
          return { ...c, replies: (c.replies || []).filter(r => r.id !== replyId) };
        }
        return c;
      });
      this._render();
    } catch (err) {
      console.error('Failed to delete reply:', err);
    }
  }

  _handleCloseSidebar() {
    this.showSidebar = false;
    this.selectedCommentId = null;
    this.newCommentPosition = null;
    this.commentMode = false;
    this._emitStateChange();
    this._render();
  }

  _handlePinClick(comment) {
    this.selectedCommentId = comment.id;
    this.showSidebar = true;
    this.commentMode = false;
    this._emitStateChange();
    this._render();
  }

  _render() {
    const overlay = this.framework.getOverlayContainer();

    render(
      h(CommentsApp, {
        comments: this.comments,
        commentMode: this.commentMode,
        selectedCommentId: this.selectedCommentId,
        showSidebar: this.showSidebar,
        newCommentPosition: this.newCommentPosition,
        onSelect: (sel) => this._handleSelect(sel),
        onSave: (data) => this._handleSave(data),
        onUpdate: (id, upd) => this._handleUpdate(id, upd),
        onDelete: (id) => this._handleDelete(id),
        onReply: (id, data) => this._handleReply(id, data),
        onDeleteReply: (cid, rid) => this._handleDeleteReply(cid, rid),
        onPinClick: (c) => this._handlePinClick(c),
        onCloseSidebar: () => this._handleCloseSidebar()
      }),
      overlay
    );
  }
}
