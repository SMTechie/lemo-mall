import "server-only";

import { prisma } from "@/lib/prisma";

export async function advancedAnalytics() {
  const [orders, bestProducts, events, users, visits] = await Promise.all([
    prisma.order.findMany({ where: { status: "PAID" }, include: { items: true } }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      where: { type: "PRODUCT", order: { status: "PAID" } },
      _sum: { quantity: true, totalPriceCents: true },
      orderBy: { _sum: { totalPriceCents: "desc" } },
      take: 8
    }),
    prisma.event.findMany({ include: { ticketTypes: true } }),
    prisma.user.findMany({ include: { orders: { where: { status: "PAID" } } } }),
    prisma.visit.count()
  ]);

  const revenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
  const customerRevenue = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    totalCents: user.orders.reduce((sum, order) => sum + order.totalCents, 0),
    orderCount: user.orders.length,
    vip: user.tags.includes("VIP") || user.orders.reduce((sum, order) => sum + order.totalCents, 0) >= 500000
  }));

  const purchases = orders.length;
  const conversionRate = visits ? purchases / visits : 0;
  const clv = users.length ? revenue / users.length : 0;

  return {
    revenue,
    conversionRate,
    clv,
    bestProducts,
    topEvents: events
      .map((event) => ({
        id: event.id,
        title: event.title,
        sold: event.ticketTypes.reduce((sum, ticket) => sum + ticket.sold, 0),
        revenue: event.ticketTypes.reduce((sum, ticket) => sum + ticket.sold * ticket.priceCents, 0)
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8),
    vipCustomers: customerRevenue.filter((user) => user.vip).sort((a, b) => b.totalCents - a.totalCents)
  };
}
