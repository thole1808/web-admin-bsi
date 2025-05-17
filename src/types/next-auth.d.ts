import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId: string;
      type: string;
      name: string;
      email: string;
      phone: string;
      accessToken: string;
      counter?: {
        id: string;
        name: string;
        code?: string;
        num?: string;
      };
      role?: {
        id: string;
        name: string;
        code?: string;
        guardName: string;
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
    userId: string;
    type: string;
    name: string;
    email: string;
    phone: string;
    accessToken: string;
    counter?: {
      id: string;
      name: string;
      code?: string;
      num?: string;
    };
    role?: {
      id: string;
      name: string;
      code?: string;
      guardName: string;
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
    userId: string;
    type: string;
    name: string;
    email: string;
    phone: string;
    accessToken: string;
    counter?: {
      id: string;
      name: string;
      code?: string;
      num?: string;
    };
    role?: {
      id: string;
      name: string;
      code?: string;
      guardName: string;
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
