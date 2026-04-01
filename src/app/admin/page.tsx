import Link from "next/link";
import { BarChart3, CalendarDays, Mail, Package, Ticket, TriangleAlert } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAnalytics,
  getAdminEnquiries,
  getAdminEvents,
  getAdminProducts,
  getOrders,
} from "@/lib/site-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Admin overview",
  description: "Lemo Fest operations dashboard.",
};

export default async function AdminOverviewPage() {
  const [analytics, events, products, orders, enquiries] = await Promise.all([
    getAnalytics(),
    getAdminEvents(),
    getAdminProducts(),
    getOrders(),
    getAdminEnquiries(),
  ]);

  const stats = [
    { label: "Tickets sold", value: analytics.ticketsSold, icon: Ticket },
    { label: "Revenue", value: formatCurrency(analytics.revenueCents), icon: BarChart3 },
    { label: "Events", value: analytics.activeEvents, icon: CalendarDays },
    { label: "Products", value: analytics.activeProducts, icon: Package },
    { label: "Open enquiries", value: analytics.openEnquiries, icon: Mail },
    { label: "Low stock", value: analytics.lowStockProducts, icon: TriangleAlert },
  ];

  const openEnquiries = enquiries.filter((enquiry) => enquiry.status !== "RESOLVED");
  const lowStockProducts = products.filter((product) => product.inventory <= 10);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Overview</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8]">
          Live metrics for ticketing, enquiries, and store operations.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
          This dashboard gives you a quick view of sales, events, open support requests, and
          inventory that needs attention.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur"
            >
              <Icon className="h-5 w-5 text-[#ffcc66]" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-white/45">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#f8f4e8]">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Recent orders"
            title="Latest commerce activity"
            description="Review recent payments, ticket issuance, and fulfillment status."
            className="mb-6"
          />
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div>
                  <p className="font-medium text-[#f8f4e8]">{order.orderNumber}</p>
                  <p className="text-sm text-white/55">
                    {order.customerName} · {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#f8f4e8]">
                    {formatCurrency(order.totalCents)}
                  </p>
                  <p className="text-xs text-white/45">{formatDateTime(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <SectionHeading
              eyebrow="Shortcuts"
              title="Operations"
              description="Jump directly to the resources you change most often."
              className="mb-6"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/admin/events", label: "Manage events" },
                { href: "/admin/products", label: "Manage products" },
                { href: "/admin/enquiries", label: "View enquiries" },
                { href: "/admin/gallery", label: "Manage gallery" },
                { href: "/admin/social", label: "Sync Facebook" },
                { href: "/admin/tickets", label: "Inspect tickets" },
                { href: "/verify", label: "Open scanner" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[20px] border border-white/10 bg-[#0b1020]/60 px-4 py-4 text-sm text-[#f8f4e8] transition hover:bg-[#11182f]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <SectionHeading
              eyebrow="Live catalog"
              title="Current inventory snapshot"
              description="Products and events currently visible on the public site."
              className="mb-6"
            />
            <div className="space-y-4">
              {events.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4"
                >
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{event.title}</p>
                    <p className="text-sm text-white/55">{event.location}</p>
                  </div>
                  <p className="text-sm text-[#ffcc66]">Live</p>
                </div>
              ))}
              {products.slice(0, 2).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4"
                >
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{product.name}</p>
                    <p className="text-sm text-white/55">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#ffcc66]">{formatCurrency(product.priceCents)}</p>
                    <p className="text-xs text-white/45">
                      {product.inventory <= 10 ? "Low stock" : `${product.inventory} in stock`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Support"
            title="Open enquiries"
            description="Questions that still need a reply."
            className="mb-6"
          />
          <div className="space-y-4">
            {openEnquiries.slice(0, 4).map((enquiry) => (
              <div key={enquiry.id} className="rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4">
                <p className="font-medium text-[#f8f4e8]">{enquiry.subject}</p>
                <p className="mt-1 text-sm text-white/55">
                  {enquiry.name} · {enquiry.type}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/65">
                  {enquiry.message}
                </p>
              </div>
            ))}
            {openEnquiries.length === 0 ? (
              <p className="text-sm leading-7 text-white/60">No open enquiries right now.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Operations"
            title="Commerce maintenance"
            description="Spot the areas that need attention before they turn into support issues."
            className="mb-6"
          />
          <div className="space-y-4">
            {lowStockProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4">
                <p className="font-medium text-[#f8f4e8]">{product.name}</p>
                <p className="mt-1 text-sm text-white/55">{product.category}</p>
                <p className="mt-2 text-sm text-[#ffcc66]">
                  {product.inventory === 0 ? "Sold out" : `Only ${product.inventory} left`}
                </p>
              </div>
            ))}
            {lowStockProducts.length === 0 ? (
              <p className="text-sm leading-7 text-white/60">
                No low-stock items right now. Keep an eye on inventory after the next merch drop.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
