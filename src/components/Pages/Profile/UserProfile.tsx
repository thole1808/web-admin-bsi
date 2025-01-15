"use client";

import React, { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  forceChangePassword: boolean;
  failedLoginAttempt: number;
  active: boolean;
  role: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    code: string;
    name: string;
  };
  lastLoginAt: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const defaultAvatar = "https://via.placeholder.com/150?text=No+Avatar"; // Foto default

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile"); // Ganti dengan URL API Anda
        const result = await response.json();

        if (result.success) {
          setProfile(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch profile data.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-6 animate-pulse">
        <div className="flex-shrink-0 w-40 h-40 rounded-lg bg-gray-300"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3 mb-5"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg border border-red-200">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-300 flex flex-col sm:flex-row gap-6">
      {/* Foto Profil */}
      <div className="flex-shrink-0">
        <img
          src={profile.avatarUrl || defaultAvatar}
          alt={`${profile.name}'s avatar`}
          className="w-40 h-40 rounded-lg object-cover border border-gray-300"
        />
      </div>

      {/* Informasi Detail */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-sm font-medium text-gray-800">{profile.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-800">{profile.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-sm font-medium text-gray-800">{profile.role.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Branch</p>
            <p className="text-sm font-medium text-gray-800">
              {profile.branch.name} ({profile.branch.code})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p
              className={`text-sm font-medium ${profile.active ? "text-green-500" : "text-red-500"
                }`}
            >
              {profile.active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
