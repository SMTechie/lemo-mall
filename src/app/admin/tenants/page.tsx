import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    include: {
      _count: { select: { products: true, events: true, orders: true, users: true } },
      orders: { where: { status: "PAID" }, select: { platformFeeCents: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Card>
      <CardHeader><CardTitle>Tenant management</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Plan</TableHead><TableHead>Fee</TableHead><TableHead>Users</TableHead><TableHead>Catalog</TableHead><TableHead>Platform revenue</TableHead></TableRow></TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.plan}</TableCell>
                <TableCell>{tenant.platformFeeBps / 100}% + {formatMoney(tenant.fixedTicketFeeCents)} / ticket</TableCell>
                <TableCell>{tenant._count.users}</TableCell>
                <TableCell>{tenant._count.products} products · {tenant._count.events} events</TableCell>
                <TableCell>{formatMoney(tenant.orders.reduce((sum, order) => sum + order.platformFeeCents, 0))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
