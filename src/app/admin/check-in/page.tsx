import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminCheckInPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    include: { tickets: true },
    orderBy: { startsAt: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal">Live check-in</h1>
        <p className="text-muted-foreground">Refreshes on navigation and scanner API returns updated counts per scan.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Attendance</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Checked in</TableHead><TableHead>Total tickets</TableHead><TableHead>Progress</TableHead></TableRow></TableHeader><TableBody>
            {events.map((event) => {
              const used = event.tickets.filter((ticket) => ticket.status === "USED").length;
              const total = event.tickets.length;
              return (
                <TableRow key={event.id}><TableCell>{event.title}</TableCell><TableCell>{used}</TableCell><TableCell>{total}</TableCell><TableCell>{total ? `${Math.round((used / total) * 100)}%` : "0%"}</TableCell></TableRow>
              );
            })}
          </TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}
