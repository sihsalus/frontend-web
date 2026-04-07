import { useSession, userHasAccess } from '@openmrs/esm-framework';

export type UseRequirePrivilegeResult =
  | { status: 'authorized' }
  | { status: 'unauthorized'; missingPrivilege: string | string[] }
  | { status: 'unauthenticated' };

export function useRequirePrivilege(
  privilege: string | string[],
  requireAll = true,
): UseRequirePrivilegeResult {
  const session = useSession();

  if (!session?.authenticated) {
    return { status: 'unauthenticated' };
  }

  const privileges = Array.isArray(privilege) ? privilege : [privilege];

  const hasAccess = requireAll
    ? privileges.every((p) => userHasAccess(p, session.user))
    : privileges.some((p) => userHasAccess(p, session.user));

  if (hasAccess) {
    return { status: 'authorized' };
  }

  return { status: 'unauthorized', missingPrivilege: privilege };
}
