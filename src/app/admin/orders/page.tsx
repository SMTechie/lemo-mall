import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <Card>
      <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead>Total</TableHead><TableHead>Items</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell><Badge variant={order.status === "PAID" ? "default" : "outline"}>{order.status}</Badge></TableCell>
                <TableCell>{formatMoney(order.totalCents)}</TableCell>
                <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                <TableCell>{order.createdAt.toLocaleDateString("en-ZA")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
