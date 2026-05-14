import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center pb-12">
      <div className="w-full mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences.</p>
      </div>
      
      <UserProfile routing="hash" />
    </div>
  );
}
