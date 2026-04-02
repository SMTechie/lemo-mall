import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { fulfillOrderAction } from "@/actions/admin";
import { getOrders } from "@/lib/site-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Manage orders",
  description: "Review order records and fulfillment status.",
};

function statusTone(status: string) {
  switch (status) {
    case "PAID":
    case "FULFILLED":
      return "bg-[#e3ead8] text-[#5f7d47]";
    case "AWAITING_PAYMENT":
      return "bg-[#f4ecd3] text-[#9a7942]";
    case "FAILED":
    case "CANCELLED":
    case "REFUNDED":
      return "bg-[#f7e2df] text-[#a65b50]";
    default:
      return "bg-[#edf2ea] text-[#667261]";
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const paidOrders = orders.filter((order) => order.status === "PAID" || order.status === "FULFILLED");
  const fulfilledOrders = orders.filter((order) => order.status === "FULFILLED").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Orders</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Review payments and fulfillment
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Orders include tickets and merch. Ticket creation happens after payment confirmation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5e6c5a]">
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {orders.length} total orders
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {paidOrders.length} paid orders
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {fulfilledOrders} fulfilled
          </div>
        </div>
      </section>

      <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <SectionHeading
          eyebrow="Recent orders"
          title="Commerce ledger"
          description="Use this page to confirm shipped or fulfilled orders."
          className="mb-6"
        />
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

            return (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-4"
              >
                <div>
                  <p className="font-medium text-[#132414]">{order.orderNumber}</p>
                  <p className="text-sm text-[#5e6c5a]">
                    {order.customerName} - {order.status} - {order.type}
                  </p>
                  <p className="text-xs text-[#899885]">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#132414]">
                      {formatCurrency(order.totalCents)}
                    </p>
                    <p className="text-xs text-[#899885]">{itemCount} items</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone(
                      order.status,
                    )}`}
                  >
                    {order.status.replaceAll("_", " ")}
                  </span>
                  <form action={fulfillOrderAction}>
                    <input type="hidden" name="orderNumber" value={order.orderNumber} />
                    <Button
                      variant="secondary"
                      type="submit"
                      className="bg-[#dce5cf] text-[#132414] hover:bg-[#cddbc0]"
                    >
                      Mark fulfilled
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
