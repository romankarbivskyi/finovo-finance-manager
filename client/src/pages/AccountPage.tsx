import { ChangePasswordModal, Header } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Edit2, Lock, UserIcon } from "lucide-react";

const AccountPage = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Header
        title="Account"
        subtitle="Manage your account settings and preferences"
      />

      <div className="mt-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Personal Information</span>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-start sm:gap-6">
                  <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-full text-lg font-semibold">
                    {user?.username ? (
                      getInitials(user.username)
                    ) : (
                      <UserIcon className="h-8 w-8" />
                    )}
                  </div>

                  <div className="mt-4 space-y-1 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-xl font-semibold">{user?.username}</h3>
                    <p className="text-muted-foreground text-sm">
                      {user?.email}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Member since{" "}
                      {new Date(user?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" value={user?.username} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and session information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Lock className="text-muted-foreground h-4 w-4" />
                      <h3 className="font-medium">Password</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <ChangePasswordModal />
                </div>
              </CardContent>

              <Separator />

              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-muted-foreground text-sm">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2 sm:mt-0"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Session</CardTitle>
                <CardDescription>
                  You are currently logged in on this device
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Log out
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
