import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { fulfillOrderAction } from "@/actions/admin";
import { getOrders } from "@/lib/site-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Manage orders",
  description: "Review order records and fulfillment status.",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Orders</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Review payments and fulfillment</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Orders include tickets and merch. Ticket creation happens after payment confirmation.
        </p>
      </section>

      <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
        <SectionHeading
          eyebrow="Recent orders"
          title="Commerce ledger"
          description="Use this page to confirm shipped or fulfilled orders."
          className="mb-6"
        />
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4"
            >
              <div>
                <p className="font-medium text-[#f8f4e8]">{order.orderNumber}</p>
                <p className="text-sm text-white/55">
                  {order.customerName} • {order.status} • {order.type}
                </p>
                <p className="text-xs text-white/45">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-[#f8f4e8]">
                  {formatCurrency(order.totalCents)}
                </p>
                <form action={fulfillOrderAction}>
                  <input type="hidden" name="orderNumber" value={order.orderNumber} />
                  <Button variant="secondary" type="submit">
                    Mark fulfilled
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

