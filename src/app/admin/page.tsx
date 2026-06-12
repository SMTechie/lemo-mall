import { Download } from "lucide-react";
import { adminMetrics } from "@/services/orders";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "@/components/admin/sales-chart";

export default async function AdminDashboard() {
  const metrics = await adminMetrics();
  const cards = [
    ["Total revenue", formatMoney(metrics.revenue)],
    ["Tickets sold", metrics.ticketsSold.toLocaleString("en-ZA")],
    ["Products sold", metrics.productsSold.toLocaleString("en-ZA")],
    ["Users", metrics.users.toLocaleString("en-ZA")]
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Dashboard</h1>
          <p className="text-muted-foreground">Revenue, ticketing and merchandising performance.</p>
        </div>
        <Button asChild variant="outline">
          <a href="/api/admin/export/orders"><Download className="h-4 w-4" />Export CSV</a>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label} className="rounded-md border-border/80 bg-background shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-normal">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader><CardTitle>Sales trend</CardTitle></CardHeader>
        <CardContent>
          <SalesChart data={metrics.sales} />
        </CardContent>
      </Card>
    </div>
  );
}
