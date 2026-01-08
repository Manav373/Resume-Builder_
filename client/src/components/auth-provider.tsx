import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, useUser as useClerkUser, UserButton, useClerk } from "@clerk/clerk-react";
import React from "react";
import { Button } from "./ui/button";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("Clerk Key status:", PUBLISHABLE_KEY ? "Present" : "Missing", PUBLISHABLE_KEY);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    if (!PUBLISHABLE_KEY) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-900 p-4">
                <div className="max-w-md text-center space-y-4">
                    <h1 className="text-2xl font-bold">Configuration Error</h1>
                    <p>Missing <code className="bg-red-100 px-2 py-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> environment variable.</p>
                    <p className="text-sm">Please add your Clerk Publishable Key to the <code className="bg-red-100 px-2 py-1 rounded">.env</code> file.</p>
                </div>
            </div>
        );
    }

    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            {children}
        </ClerkProvider>
    );
};

export const AppSignedIn = ({ children }: { children: React.ReactNode }) => {
    return <SignedIn>{children}</SignedIn>;
};

export const AppSignedOut = ({ children }: { children: React.ReactNode }) => {
    return <SignedOut>{children}</SignedOut>;
};

export const AppSignIn = (props: any) => {
    return <SignIn {...props} />;
}

export const AppSignUp = (props: any) => {
    return <SignUp {...props} />;
}

export const UserButtonComponent = () => {
    return <UserButton afterSignOutUrl="/" />;
}

export const useAppUser = () => {
    return useClerkUser();
}

export const AppSignInButton = ({ children }: { children?: React.ReactNode }) => {
    const { openSignIn } = useClerk();

    return (
        <Button
            variant="outline"
            size="lg"
            onClick={() => openSignIn({
                afterSignInUrl: "/dashboard",
                afterSignUpUrl: "/dashboard"
            })}
        >
            {children || "Sign In"}
        </Button>
    );
}
