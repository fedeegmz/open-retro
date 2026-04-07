import { Role, Permission } from '@shared/types/role'
import type { ConnectedUser } from '@shared/types/board'

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.Owner]: [
    Permission.ToggleNoteVisibility,
    Permission.CreateNote,
    Permission.UpdateOwnNote,
    Permission.DeleteOwnNote,
    Permission.ManageGroups,
    Permission.MoveAnyNote,
  ],
  [Role.Contributor]: [
    Permission.CreateNote,
    Permission.UpdateOwnNote,
    Permission.DeleteOwnNote,
    Permission.ManageGroups,
    Permission.MoveAnyNote,
  ],
}

export class PermissionService {
  /**
   * Checks if a role has a specific permission globally.
   */
  static can(role: Role, permission: Permission): boolean {
    return RolePermissions[role]?.includes(permission) ?? false
  }

  /**
   * Checks if a user has permission to modify a specific user's resource.
   */
  static canModifyResource(user: ConnectedUser, resourceOwnerId?: string): boolean {
    // According to new rules, Owners and Contributors can both only edit their OWN notes.
    if (!resourceOwnerId) return false
    return user.id === resourceOwnerId
  }
}
