import Link from "next/link";
import { ArrowUpRight, Mail, ShoppingBag, Ticket, Users } from "lucide-react";
import type { ComponentType } from "react";
import { getAdminEnquiries, getAdminTickets, getOrders } from "@/lib/site-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Customers",
  description: "View customer activity across orders, tickets, and enquiries.",
};

type OrderRecord = {
  customerName: string;
  customerEmail: string;
  totalCents: number;
  createdAt: Date | string;
  status: string;
  type: string;
  orderNumber: string;
};

type TicketRecord = {
  holderName: string | null;
  holderEmail: string | null;
};

type EnquiryRecord = {
  name: string;
  email: string;
  status: string;
  createdAt: Date | string;
};

type CustomerRecord = {
  name: string;
  email: string;
  orders: OrderRecord[];
  tickets: number;
  enquiries: number;
  totalCents: number;
  lastActivity: Date;
};

function buildCustomers(
  orders: OrderRecord[],
  tickets: TicketRecord[],
  enquiries: EnquiryRecord[],
) {
  const map = new Map<string, CustomerRecord>();

  const ensure = (name: string, email: string) => {
    const key = email.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      if ((!existing.name || existing.name === "Guest") && name) {
        existing.name = name;
      }
      return existing;
    }

    const record: CustomerRecord = {
      name,
      email,
      orders: [],
      tickets: 0,
      enquiries: 0,
      totalCents: 0,
      lastActivity: new Date(0),
    };
    map.set(key, record);
    return record;
  };

  for (const order of orders) {
    const customer = ensure(order.customerName || "Guest", order.customerEmail);
    customer.orders.push(order);
    customer.totalCents += order.totalCents;
    const orderDate = new Date(order.createdAt);
    if (orderDate > customer.lastActivity) {
      customer.lastActivity = orderDate;
    }
  }

  for (const ticket of tickets) {
    const email = ticket.holderEmail;
    if (!email) continue;
    const customer = ensure(ticket.holderName ?? "Guest", email);
    customer.tickets += 1;
  }

  for (const enquiry of enquiries) {
    const customer = ensure(enquiry.name || "Guest", enquiry.email);
    customer.enquiries += 1;
    const enquiryDate = new Date(enquiry.createdAt);
    if (enquiryDate > customer.lastActivity) {
      customer.lastActivity = enquiryDate;
    }
  }

  return [...map.values()].sort((left, right) => right.totalCents - left.totalCents);
}

export default async function CustomersPage() {
  const [orders, tickets, enquiries] = await Promise.all([
    getOrders(),
    getAdminTickets(),
    getAdminEnquiries(),
  ]);

  const customers = buildCustomers(
    orders as OrderRecord[],
    tickets as TicketRecord[],
    enquiries as EnquiryRecord[],
  );

  const repeatCustomers = customers.filter((customer) => customer.orders.length > 1).length;
  const ticketBuyers = customers.filter((customer) => customer.tickets > 0).length;
  const enquiryCustomers = customers.filter((customer) => customer.enquiries > 0).length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Customers</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Customer activity at a glance
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Track buyers, ticket holders, and enquiry history from one dashboard so the team can
          respond fast and keep the site moving.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5e6c5a]">
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {customers.length} customers
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {repeatCustomers} repeat buyers
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {ticketBuyers} ticket buyers
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Customers"
          value={String(customers.length)}
          detail="Unique buyers and enquirers in the system."
        />
        <StatCard
          icon={ShoppingBag}
          label="Repeat buyers"
          value={String(repeatCustomers)}
          detail="Customers with more than one order."
        />
        <StatCard
          icon={Ticket}
          label="Ticket holders"
          value={String(ticketBuyers)}
          detail="Customers who already purchased tickets."
        />
        <StatCard
          icon={Mail}
          label="Enquiry leads"
          value={String(enquiryCustomers)}
          detail="People who have contacted the team."
        />
      </section>

      <section className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Customer register</p>
            <h2 className="mt-2 text-xl font-semibold text-[#132414]">Top customer profiles</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/orders"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#7f9a65] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(127,154,101,0.24)] transition hover:bg-[#6f8858]"
            >
              Open orders
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/enquiries"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d7decf] bg-[#f7f9f3] px-4 text-sm font-medium text-[#132414] transition hover:bg-[#eef3e7]"
            >
              View messages
            </Link>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#dce5cf]">
          <table className="min-w-full divide-y divide-[#e3e8dc]">
            <thead className="bg-[#f7f9f3]">
              <tr className="text-left text-xs uppercase tracking-[0.22em] text-[#90a085]">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Orders</th>
                <th className="px-5 py-4 font-medium">Revenue</th>
                <th className="px-5 py-4 font-medium">Tickets</th>
                <th className="px-5 py-4 font-medium">Last activity</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9ede3] bg-white">
              {customers.map((customer) => (
                <tr key={customer.email} className="transition hover:bg-[#f8faf5]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#132414]">{customer.name}</p>
                    <p className="text-xs text-[#899885]">{customer.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5e6c5a]">{customer.orders.length}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#132414]">
                    {formatCurrency(customer.totalCents)}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5e6c5a]">{customer.tickets}</td>
                  <td className="px-5 py-4 text-xs text-[#899885]">
                    {customer.lastActivity.getTime() === 0
                      ? "No activity yet"
                      : formatDateTime(customer.lastActivity)}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`mailto:${customer.email}`}
                      className="inline-flex h-9 items-center rounded-full border border-[#d7decf] bg-[#f7f9f3] px-3 text-sm font-medium text-[#5e6c5a] transition hover:bg-[#eef3e7] hover:text-[#132414]"
                    >
                      Open email
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
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
