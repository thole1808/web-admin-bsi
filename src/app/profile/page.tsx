import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserProfile from "@/components/Pages/Profile/UserProfile";
import UpdatePassword from "@/components/Pages/Profile/UpdatePassword";

export const metadata: Metadata = {
  title: "QMS Console - Profile",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="grid gap-6">
        <UserProfile />
        <UpdatePassword />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
