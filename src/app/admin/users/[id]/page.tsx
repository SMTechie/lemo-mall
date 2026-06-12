import { notFound } from "next/navigation";
import { addCustomerTagAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminUserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      tickets: { include: { event: true } },
      loyaltyTransactions: { orderBy: { createdAt: "desc" }, take: 20 }
    }
  });
  if (!user) notFound();

  const total = user.orders.reduce((sum, order) => sum + order.totalCents, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-normal">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">{user.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
            </div>
            <div className="grid gap-1 text-right">
              <p className="text-sm text-muted-foreground">Lifetime value</p>
              <p className="text-2xl font-semibold">{formatMoney(total)}</p>
              <p className="text-sm text-muted-foreground">{user.loyaltyPoints} loyalty points</p>
            </div>
          </div>
          <form action={addCustomerTagAction} className="mt-5 flex max-w-md gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <Input name="tag" placeholder="VIP, FREQUENT, WHOLESALE" />
            <Button>Add tag</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Purchase history</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Status</TableHead><TableHead>Total</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>
            {user.orders.map((order) => <TableRow key={order.id}><TableCell>{order.orderNumber}</TableCell><TableCell>{order.status}</TableCell><TableCell>{formatMoney(order.totalCents)}</TableCell><TableCell>{order.createdAt.toLocaleDateString("en-ZA")}</TableCell></TableRow>)}
          </TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}
