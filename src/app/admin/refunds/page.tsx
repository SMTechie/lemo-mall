import { approveRefundAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminRefundsPage() {
  const refunds = await prisma.refundRequest.findMany({
    include: { order: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Card>
      <CardHeader><CardTitle>Refund requests</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Reason</TableHead><TableHead /></TableRow></TableHeader><TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund.id}>
              <TableCell>{refund.order.orderNumber}</TableCell>
              <TableCell>{refund.user?.email ?? refund.order.customerEmail}</TableCell>
              <TableCell>{formatMoney(refund.amountCents ?? refund.order.totalCents)}</TableCell>
              <TableCell><Badge variant={refund.status === "REQUESTED" ? "default" : "outline"}>{refund.status}</Badge></TableCell>
              <TableCell className="max-w-md text-sm text-muted-foreground">{refund.reason}</TableCell>
              <TableCell className="flex gap-2">
                {refund.status === "REQUESTED" ? (
                  <>
                    <form action={approveRefundAction.bind(null, refund.id, true)}><Button size="sm">Approve</Button></form>
                    <form action={approveRefundAction.bind(null, refund.id, false)}><Button size="sm" variant="outline">Reject</Button></form>
                  </>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody></Table>
      </CardContent>
    </Card>
  );
}
