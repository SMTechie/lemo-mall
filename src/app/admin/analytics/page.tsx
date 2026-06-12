import { advancedAnalytics } from "@/services/analytics";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminAnalyticsPage() {
  const analytics = await advancedAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Advanced analytics</h1>
        <p className="text-muted-foreground">Revenue intelligence, conversion, CLV and top performers.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">CLV</p><p className="mt-2 text-2xl font-semibold">{formatMoney(analytics.clv)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Conversion rate</p><p className="mt-2 text-2xl font-semibold">{(analytics.conversionRate * 100).toFixed(2)}%</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">VIP customers</p><p className="mt-2 text-2xl font-semibold">{analytics.vipCustomers.length}</p></CardContent></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Best-selling products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Qty</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader><TableBody>
              {analytics.bestProducts.map((item) => (
                <TableRow key={item.productId ?? item.name}><TableCell>{item.name}</TableCell><TableCell>{item._sum.quantity ?? 0}</TableCell><TableCell>{formatMoney(item._sum.totalPriceCents ?? 0)}</TableCell></TableRow>
              ))}
            </TableBody></Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top events</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table><TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Sold</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader><TableBody>
              {analytics.topEvents.map((event) => (
                <TableRow key={event.id}><TableCell>{event.title}</TableCell><TableCell>{event.sold}</TableCell><TableCell>{formatMoney(event.revenue)}</TableCell></TableRow>
              ))}
            </TableBody></Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
