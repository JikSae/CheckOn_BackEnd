import SharedChecklistRepository from '../repositories/checklist.repository.js';

export default class SharedChecklistService {
  private repo = new SharedChecklistRepository();

  async getAllSharedChecklists(sort: string) {
    return this.repo.getAllSharedChecklists(sort);
  }

  async getSharedChecklistById(checklistId: number) {
    const checklist = await this.repo.getSharedChecklistById(checklistId);
    if (!checklist) throw new Error('ChecklistNotFound');
    return checklist;
  }

  async shareChecklist(checklistId: number, user: { userId: number, authority: string }) {
    const checklist = await this.repo.findChecklistById(checklistId);
    if (!checklist) throw new Error('ChecklistNotFound');
    if (checklist.deletedAt) throw new Error('DeleteChecklistError');
    if (checklist.isShared) throw new Error('AlreadyShared');

    const isOwner = checklist.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';
    if (!isOwner && !isAdmin) throw new Error('AuthenticationError');

    return this.repo.shareChecklist(checklistId);
  }

  async unshareChecklist(checklistId: number, user: { userId: number, authority: string }) {
    const checklist = await this.repo.findChecklistById(checklistId);
    if (!checklist) throw new Error('ChecklistNotFound');
    if (checklist.deletedAt) throw new Error('DeleteChecklistError');
    if (!checklist.isShared) throw new Error('AlreadyUnshared');

    const isOwner = checklist.userId === user.userId;
    const isAdmin = user.authority === 'ADMIN';
    if (!isOwner && !isAdmin) throw new Error('AuthenticationError');

    return this.repo.unshareChecklist(checklistId);
  }
}
