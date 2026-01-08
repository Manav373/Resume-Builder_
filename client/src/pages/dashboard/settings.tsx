import { UserProfile } from "@clerk/clerk-react";

export default function SettingsPage() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account preferences and subscription.
                </p>
            </div>

            <div className="flex justify-center md:justify-start">
                <UserProfile routing="hash" />
            </div>
        </div>
    );
}
