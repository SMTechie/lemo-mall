import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Filter,
  Package2,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import { getAnalytics, getAdminEnquiries, getAdminEvents, getAdminProducts, getOrders } from "@/lib/site-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { ComponentType } from "react";

export const metadata = {
  title: "Admin overview",
  description: "Lemo Fest operations dashboard.",
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  totalCents: number;
  createdAt: Date | string;
  paidAt?: Date | string | null;
  items?: Array<{
    quantity: number;
    type: string;
    name: string;
  }>;
};

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  inventory: number;
};

type AdminEnquiry = {
  id: string;
  status: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date | string;
};

function createRevenueSeries(orders: AdminOrder[]) {
  const today = new Date();
  const values: number[] = [];

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - offset);
    const dayKey = date.toISOString().slice(0, 10);

    const total = orders.reduce((sum, order) => {
      const orderDate = new Date(order.paidAt ?? order.createdAt);
      const orderKey = orderDate.toISOString().slice(0, 10);
      const paid = order.status === "PAID" || order.status === "FULFILLED";

      return paid && orderKey === dayKey ? sum + order.totalCents : sum;
    }, 0);

    values.push(total);
  }

  return values;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d7decf] bg-white p-5 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3ead8] text-[#6f8858]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[#90a085]">{label}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#132414]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#5e6c5a]">{detail}</p>
    </div>
  );
}

function TrafficDonut({
  total,
}: {
  total: number;
}) {
  const sources = [
    { label: "Facebook", value: 42, color: "#7f9a65" },
    { label: "Instagram", value: 26, color: "#9fb18d" },
    { label: "Direct", value: 18, color: "#c4cfb0" },
    { label: "Search", value: 14, color: "#d9dfcf" },
  ];

  const totalValue = sources.reduce((sum, entry) => sum + entry.value, 0);
  let start = 0;
  const gradient = sources
    .map((entry) => {
      const slice = (entry.value / totalValue) * 100;
      const segment = `${entry.color} ${start}% ${start + slice}%`;
      start += slice;
      return segment;
    })
    .join(", ");

  return (
    <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Sales mix</p>
          <h2 className="mt-2 text-xl font-semibold text-[#132414]">Sales by traffic source</h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-[#d7decf] bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]"
        >
          Monthly
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[220px_1fr]">
        <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${gradient})` }}
          />
          <div className="absolute inset-7 rounded-full border border-[#d9dfcf] bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)]" />
          <div className="relative z-10 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Total</p>
            <p className="mt-3 text-2xl font-semibold text-[#132414]">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm font-medium text-[#354537]">{source.label}</span>
              </div>
              <span className="text-sm text-[#6f7d69]">
                {Math.round((source.value / totalValue) * 100)}%
              </span>
            </div>
          ))}
          <p className="pt-4 text-sm leading-7 text-[#5e6c5a]">
            Use this panel to monitor where ticket and merch traffic is coming from while the
            campaign is live.
          </p>
        </div>
      </div>
    </div>
  );
}

function RevenueChart({
  values,
}: {
  values: number[];
}) {
  const width = 760;
  const height = 300;
  const padding = 28;
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((value / maxValue) * (height - padding * 2));
    return { x, y, value };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const lastPoint = points[points.length - 1];
  const areaPath =
    `M ${points[0]?.x ?? padding} ${height - padding} ` +
    points.map((point) => `L ${point.x} ${point.y}`).join(" ") +
    ` L ${lastPoint?.x ?? width - padding} ${height - padding} Z`;

  const peak = values.length > 0 ? Math.max(...values) : 0;
  const average = values.length > 0 ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

  return (
    <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Revenue analytics</p>
          <h2 className="mt-2 text-xl font-semibold text-[#132414]">Monthly trend</h2>
        </div>
        <div className="rounded-full border border-[#d7decf] bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
          Monthly
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-[#dce5cf] bg-[linear-gradient(180deg,#fafcf7_0%,#f5f8f0_100%)] p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[300px] w-full">
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8fa97b" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#8fa97b" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map((line, index) => (
            <line
              key={index}
              x1={padding}
              x2={width - padding}
              y1={padding + (height - padding * 2) * line}
              y2={padding + (height - padding * 2) * line}
              stroke="#dbe3d2"
              strokeDasharray="4 8"
            />
          ))}
          <path d={areaPath} fill="url(#revenueFill)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#7f9a65"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="4.5" fill="#7f9a65" />
              <circle cx={point.x} cy={point.y} r="8" fill="#7f9a65" fillOpacity="0.12" />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#d7decf] bg-[#f7f9f3] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#90a085]">Peak day</p>
          <p className="mt-2 text-lg font-semibold text-[#132414]">{formatCurrency(peak)}</p>
        </div>
        <div className="rounded-[22px] border border-[#d7decf] bg-[#f7f9f3] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#90a085]">Average</p>
          <p className="mt-2 text-lg font-semibold text-[#132414]">{formatCurrency(average)}</p>
        </div>
        <div className="rounded-[22px] border border-[#d7decf] bg-[#f7f9f3] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#90a085]">Orders</p>
          <p className="mt-2 text-lg font-semibold text-[#132414]">{values.filter((value) => value > 0).length}</p>
        </div>
      </div>
    </div>
  );
}

function getStageTone(status: string) {
  switch (status) {
    case "PAID":
    case "FULFILLED":
      return "bg-[#e6f0dd] text-[#5f7d47]";
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

export default async function AdminOverviewPage() {
  const [analytics, events, products, orders, enquiries] = await Promise.all([
    getAnalytics(),
    getAdminEvents(),
    getAdminProducts(),
    getOrders(),
    getAdminEnquiries(),
  ]);

  const dashboardOrders = (orders as AdminOrder[]).slice().sort(
    (left, right) =>
      new Date(right.paidAt ?? right.createdAt).getTime() -
      new Date(left.paidAt ?? left.createdAt).getTime(),
  );
  const revenueSeries = createRevenueSeries(dashboardOrders);
  const uniqueCustomers = new Set(
    dashboardOrders.map((order) => order.customerEmail).filter(Boolean) as string[],
  ).size;
  const productSold = dashboardOrders.reduce((sum, order) => {
    const itemCount =
      order.items?.reduce((itemsSum, item) => (item.type === "PRODUCT" ? itemsSum + item.quantity : itemsSum), 0) ?? 0;
    return sum + itemCount;
  }, 0);

  const lowStockProducts = (products as AdminProduct[]).filter((product) => product.inventory <= 10);
  const openEnquiries = (enquiries as AdminEnquiry[]).filter(
    (enquiry) => enquiry.status !== "RESOLVED",
  );
  const recentOrders = dashboardOrders.slice(0, 6);
  const activeEventCount = (events as Array<{ id: string }>).length;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#90a085]">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
              Lemo Fest control room.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#5e6c5a]">
              Keep the site moving from one place. Track ticket sales, merch inventory, enquiries,
              and verification without jumping between tools.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
                {activeEventCount} active events
              </span>
              <span className="rounded-full bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
                {openEnquiries.length} open enquiries
              </span>
              <span className="rounded-full bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
                {lowStockProducts.length} low-stock products
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/events"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7f9a65] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(127,154,101,0.24)] transition hover:bg-[#6f8858]"
            >
              Manage events
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/verification"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d7decf] bg-white px-5 text-sm font-medium text-[#132414] shadow-[0_12px_28px_rgba(15,35,18,0.05)] transition hover:bg-[#f3f6ef]"
            >
              Open verification
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Ticket}
          label="Total sales"
          value={String(analytics.paidOrders)}
          detail="Paid orders flowing through ticketing and shop."
        />
        <MetricCard
          icon={Users}
          label="New customers"
          value={String(uniqueCustomers)}
          detail="Unique customer emails in the live order set."
        />
        <MetricCard
          icon={Package2}
          label="Products sold"
          value={String(productSold)}
          detail="Total merch items sold across the store."
        />
        <MetricCard
          icon={Banknote}
          label="Total revenue"
          value={formatCurrency(analytics.revenueCents)}
          detail="Latest revenue tracked from successful orders."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <RevenueChart values={revenueSeries} />
        <TrafficDonut total={analytics.revenueCents} />
      </section>

      <section className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Recent orders</p>
            <h2 className="mt-2 text-xl font-semibold text-[#132414]">Latest commerce activity</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-full border border-[#d7decf] bg-[#f7f9f3] px-4 py-2 text-sm text-[#6f7d69]">
              <Search className="h-4 w-4" />
              <input
                type="search"
                placeholder="Search"
                className="w-24 bg-transparent text-sm text-[#132414] outline-none placeholder:text-[#97a491]"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d7decf] bg-[#f7f9f3] px-4 text-sm font-medium text-[#5e6c5a]"
            >
              Sort
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d7decf] bg-[#f7f9f3] px-4 text-sm font-medium text-[#5e6c5a]"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#dce5cf]">
          <table className="min-w-full divide-y divide-[#e3e8dc]">
            <thead className="bg-[#f7f9f3]">
              <tr className="text-left text-xs uppercase tracking-[0.22em] text-[#90a085]">
                <th className="px-5 py-4 font-medium">Order</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Items</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Stage</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9ede3] bg-white">
              {recentOrders.map((order) => {
                const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

                return (
                  <tr key={order.id} className="transition hover:bg-[#f8faf5]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#132414]">{order.orderNumber}</p>
                      <p className="text-xs text-[#899885]">{formatDateTime(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#132414]">{order.customerName ?? "Guest"}</p>
                      <p className="text-xs text-[#7f8c79]">{order.customerEmail ?? "No email"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5e6c5a]">{itemCount} items</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#132414]">
                      {formatCurrency(order.totalCents)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStageTone(
                          order.status,
                        )}`}
                      >
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href="/admin/orders"
                        className="inline-flex h-9 items-center rounded-full border border-[#d7decf] bg-[#f7f9f3] px-3 text-sm font-medium text-[#5e6c5a] transition hover:bg-[#eef3e7] hover:text-[#132414]"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Support</p>
              <h2 className="mt-2 text-xl font-semibold text-[#132414]">Open enquiries</h2>
            </div>
            <Link href="/admin/enquiries" className="text-sm font-medium text-[#7f9a65]">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {openEnquiries.slice(0, 4).map((enquiry) => (
              <div key={enquiry.id} className="rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#132414]">{enquiry.subject}</p>
                    <p className="text-sm text-[#6f7d69]">
                      {enquiry.name} • {enquiry.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#e6f0dd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f7d47]">
                    {enquiry.status}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#5e6c5a]">{enquiry.message}</p>
              </div>
            ))}
            {openEnquiries.length === 0 ? (
              <p className="text-sm leading-7 text-[#5e6c5a]">No open enquiries right now.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Inventory</p>
              <h2 className="mt-2 text-xl font-semibold text-[#132414]">Low-stock products</h2>
            </div>
            <Link href="/admin/products" className="text-sm font-medium text-[#7f9a65]">
              Manage shop
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {lowStockProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#132414]">{product.name}</p>
                    <p className="text-sm text-[#6f7d69]">{product.category}</p>
                  </div>
                  <span className="rounded-full bg-[#f4ecd3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7942]">
                    {product.inventory === 0 ? "Sold out" : `${product.inventory} left`}
                  </span>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 ? (
              <p className="text-sm leading-7 text-[#5e6c5a]">
                No low-stock items right now. Keep an eye on inventory after the next merch drop.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
