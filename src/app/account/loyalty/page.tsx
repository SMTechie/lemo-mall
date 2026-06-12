import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Loyalty" };

export default async function LoyaltyPage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { loyaltyTransactions: { orderBy: { createdAt: "desc" }, take: 50 } }
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-normal">Loyalty wallet</h1>
      <Card className="mt-6">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Available points</p>
          <p className="mt-2 text-4xl font-bold">{user?.loyaltyPoints ?? 0}</p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Reason</TableHead><TableHead>Points</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {user?.loyaltyTransactions.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.reason}</TableCell>
                  <TableCell>{entry.points}</TableCell>
                  <TableCell>{entry.createdAt.toLocaleDateString("en-ZA")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
