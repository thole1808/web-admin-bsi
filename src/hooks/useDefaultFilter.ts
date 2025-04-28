"use client";

import { useMemo } from "react";
import { Session as AuthSession } from "next-auth"; // ⬅️ alias Session dari next-auth

interface Branch {
  id: number;
  code: string;
  name: string;
  unit: string;
  type: string;
  areaId: number;
  areaCode: string;
  areaName: string;
  regionId: number;
  regionCode: string;
  regionName: string;
}

interface DefaultFilter {
  regionId?: number;
  areaId?: number;
  branchId?: number;
}

/**
 * Hook untuk membuat default filter berdasarkan session login
 */
export function useDefaultFilter(session?: AuthSession & { branch?: Branch }) {
  const defaultFilter = useMemo<DefaultFilter>(() => {
    if (!session || !session.branch) {
      return {};
    }

    const { branch } = session;

    switch (branch.type) {
      case "HEAD_OFFICE":
        return {};
      case "REGION":
        return { regionId: branch.regionId };
      case "AREA":
        return { regionId: branch.regionId, areaId: branch.areaId };
      case "BRANCH":
      default:
        return { regionId: branch.regionId, areaId: branch.areaId, branchId: branch.id };
    }
  }, [session]);

  return defaultFilter;
}