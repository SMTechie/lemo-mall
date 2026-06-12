import Link from "next/link";
import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefundForm } from "@/components/customer/refund-form";

export const metadata = { title: "Order history" };

export default async function OrdersPage() {
  const session = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true, tickets: { include: { event: true, ticketType: true } }, refundRequests: true, installments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-normal">Order history</h1>
      <Card className="mt-6 overflow-hidden">
        <CardHeader>
          <CardTitle>Your orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Refund</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell><Badge variant={order.status === "PAID" ? "default" : "outline"}>{order.status}</Badge></TableCell>
                  <TableCell>{formatMoney(order.totalCents)}</TableCell>
                  <TableCell>{formatMoney(order.balanceDueCents)}</TableCell>
                  <TableCell className="min-w-56 space-y-2">
                    {order.tickets.map((ticket) => (
                      <Link key={ticket.id} className="block rounded-md border px-3 py-2 text-primary transition-colors hover:bg-muted/50" href={`/tickets/${ticket.code}`}>
                        <span className="block text-sm font-semibold">{ticket.ticketType.name}</span>
                        <span className="block font-mono text-xs text-muted-foreground">{ticket.code}</span>
                      </Link>
                    ))}
                  </TableCell>
                  <TableCell className="min-w-64">
                    {order.refundRequests.length ? (
                      <Badge variant="outline">{order.refundRequests[0].status}</Badge>
                    ) : (
                      <RefundForm orderId={order.id} />
                    )}
                  </TableCell>
                  <TableCell>{order.createdAt.toLocaleDateString("en-ZA")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
