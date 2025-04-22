"use client";

import { useEffect, useState } from "react";

export default function usePermission(permissionName: string): boolean {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user-role");
      if (stored) {
        try {
          const role = JSON.parse(stored);
          const allowed = role?.permissions?.some(
            (perm: any) => perm.name === permissionName
          );
          setHasPermission(!!allowed);
        } catch (err) {
          console.error("Failed to parse user-role from localStorage", err);
          setHasPermission(false);
        }
      }
    }
  }, [permissionName]);

  return hasPermission;
}