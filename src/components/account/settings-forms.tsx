"use client";

import { useActionState } from "react";
import { changePasswordAction, updateProfileAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserProfile = {
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  referralCode?: string | null;
  loyaltyPoints: number;
};

export function SettingsForms({ user }: { user: UserProfile }) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, {});
  const [passwordState, passwordAction, passwordPending] = useActionState(changePasswordAction, {});

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <Card>
        <CardHeader><CardTitle>Profile settings</CardTitle></CardHeader>
        <CardContent>
          <form action={profileAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user.phone ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Avatar URL</Label>
              <Input id="image" name="image" type="url" defaultValue={user.image ?? ""} />
            </div>
            {profileState.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{profileState.error}</p> : null}
            {profileState.success ? <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{profileState.success}</p> : null}
            <Button disabled={profilePending}>Save profile</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Account status</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Referral code</span><span className="font-mono">{user.referralCode ?? "Not set"}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Loyalty points</span><span className="font-semibold">{user.loyaltyPoints}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
          <CardContent>
            <form action={passwordAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
              {passwordState.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{passwordState.error}</p> : null}
              {passwordState.success ? <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{passwordState.success}</p> : null}
              <Button disabled={passwordPending} variant="outline">Update password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
