"use client";

import TextInput from "@/components/Forms/TextInput";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    try {
      setIsProcessing(true);

      const response = await fetch(`/api/profile/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, newPassword, confirmationPassword: newPassword }),
      });

      const result = await response.json();

      if (response.status === 422) {
        setErrors(JSON.parse(result.error).data);
      } else if (result.success) {
        toast.success("Password successfully updated");
        setPassword("");
        setNewPassword("");
      } else {
        toast.error(result.message || "A system error has occurred. Please try again later.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          label="Old Password"
          placeholder="Enter old password"
          required
          error={errors?.password}
        />
        <TextInput
          type="password"
          value={newPassword}
          onChange={(value) => setNewPassword(value)}
          label="New Password"
          placeholder="Enter new password"
          required
          error={errors?.newPassword}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isProcessing}
            className={`${
              isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-700"
            } text-white rounded flex gap-1 items-center px-3 py-2 text-sm font-medium`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4 mr-2"></span>
                Processing...
              </>
            ) : (
              <>
                <FaLock className="w-4 h-4 mr-1" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
