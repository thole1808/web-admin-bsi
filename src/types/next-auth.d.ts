import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      type: string;
      email: string;
      accessToken: string;
      role?: {
        id: string;
        name: string;
        code?: string;
      };
      branch?: {
        id: string;
        code: string;
        name: string;
        type: string;
        areaId?: string;
        areaCode?: string;
        areaName?: string;
        regionId?: string;
        regionCode?: string;
        regionName?: string;
      };
    };
    expiresAt?: string;
  }

  interface User {
    id: string;
    name: string;
    type: string;
    email: string;
    accessToken: string;
    role?: {
      id: string;
      name: string;
      code?: string;
    };
    branch?: {
      id: string;
      code: string;
      name: string;
      type: string;
      areaId?: string;
      areaCode?: string;
      areaName?: string;
      regionId?: string;
      regionCode?: string;
      regionName?: string;
    };
    expiresAt: string;
  }

  interface JWT {
    id: string;
    name: string;
    type: string;
    email: string;
    accessToken: string;
    role?: {
      id: string;
      name: string;
      code?: string;
    };
    branch?: {
      id: string;
      code: string;
      name: string;
      type: string;
      areaId?: string;
      areaCode?: string;
      areaName?: string;
      regionId?: string;
      regionCode?: string;
      regionName?: string;
    };
    expiresAt?: string;
  }
}
