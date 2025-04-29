import { getServerSession } from "next-auth";
import { authOptions } from "./auth"; // Pastikan authOptions sudah ada
import { Branch } from "@/types/branch"; // Kita pisahkan type Branch untuk lebih rapi

export interface DefaultFilter {
  regionId?: number;
  areaId?: number;
  branchId?: number;
}

/**
 * Ambil default filter berdasarkan session login (server-side)
 */
export async function getDefaultFilter(): Promise<DefaultFilter> {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).user.branch) {
    console.error("Session tidak valid atau tidak memiliki informasi cabang");
    return {};
  }

  const branch = (session as any).user.branch as Branch;

//   console.log("Default filter berdasarkan session:", branch);

  switch (branch.type) {
    case "HO":
      return {};
    case "REGION":
      return { regionId: branch.regionId };
    case "AREA":
      return { regionId: branch.regionId, areaId: branch.areaId };
    case "BRANCH":
    default:
      return { regionId: branch.regionId, areaId: branch.areaId, branchId: branch.id };
  }
}