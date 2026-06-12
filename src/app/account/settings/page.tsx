import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { SettingsForms } from "@/components/account/settings-forms";

export const metadata = { title: "Account settings" };

export default async function AccountSettingsPage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
      referralCode: true,
      loyaltyPoints: true
    }
  });

  if (!user) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-normal">Account settings</h1>
        <p className="text-muted-foreground">Manage your profile, password, referral code and loyalty status.</p>
      </div>
      <SettingsForms user={user} />
    </main>
  );
}
