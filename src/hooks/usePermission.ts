"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function usePermission(permissionName: string): boolean {
  const { data: session, status } = useSession();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setHasPermission(false);
      return;
    }

    const userPermissions = (session?.user as any).role?.permissions || [];

    const allowed = userPermissions.some(
      (perm: any) => perm.name === permissionName
    );

    setHasPermission(allowed);
  }, [session, status, permissionName]);

  return hasPermission;
}