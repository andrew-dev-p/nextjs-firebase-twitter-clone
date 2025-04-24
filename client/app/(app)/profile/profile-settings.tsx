"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { useState } from "react";
import { deleteAccount } from "@/firebase/db";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export function ProfileSettings() {
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="border-t pt-6">
          <Tabs
            defaultValue="profile"
            orientation="vertical"
            className="flex flex-col sm:flex-row"
          >
            <TabsList className="flex-col items-start justify-start mb-6 sm:mb-0 sm:mr-6 bg-transparent p-0 w-full sm:w-48">
              <TabsTrigger
                value="profile"
                className="w-full justify-start mb-1 data-[state=active]:bg-muted data-[state=active]:shadow-none px-3 py-2"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-full justify-start mb-1 data-[state=active]:bg-muted data-[state=active]:shadow-none px-3 py-2"
              >
                <Lock className="mr-2 h-4 w-4" />
                Password
              </TabsTrigger>
            </TabsList>

            <div className="flex-1">
              <Card>
                <TabsContent value="profile" className="m-0">
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Update your profile information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </TabsContent>

                <TabsContent value="password" className="m-0">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription className="mb-6">
                      Change your password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PasswordForm />
                  </CardContent>
                </TabsContent>
              </Card>
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                variant="ghost"
                className="text-red-500 hover:text-red-700 mt-2 w-full"
              >
                Delete my account
              </Button>
            </div>
          </Tabs>
        </div>
      </div>
      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={async () => {
          await deleteAccount(user?.id);
          router.replace("/");
        }}
      />
    </>
  );
}
