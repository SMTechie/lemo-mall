import Link from "next/link";
import { Plus, X } from "lucide-react";
import { savePricingRuleAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminPricingPage({ searchParams }: { searchParams?: Promise<{ create?: string }> }) {
  const params = await searchParams;
  const showCreateForm = params?.create === "1";
  const [events, ticketTypes, rules] = await Promise.all([
    prisma.event.findMany({ orderBy: { startsAt: "asc" } }),
    prisma.ticketType.findMany({ include: { event: true }, orderBy: { createdAt: "desc" } }),
    prisma.pricingRule.findMany({ include: { event: true, ticketType: true }, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Pricing</h1>
          <p className="text-muted-foreground">Manage early bird, inventory tier and time-limited pricing.</p>
        </div>
        <Button asChild>
          <Link href={showCreateForm ? "/admin/pricing" : "/admin/pricing?create=1"}>
            {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showCreateForm ? "Close form" : "Add pricing rule"}
          </Link>
        </Button>
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/pricing" title="Create pricing rule" description="Configure dynamic pricing for events or ticket types.">
          <form action={savePricingRuleAction} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label>Name</Label><Input name="name" placeholder="Early Bird Launch" required /></div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <select name="type" className="h-10 rounded-md border bg-background px-3 text-sm">
                <option value="EARLY_BIRD">Early Bird</option>
                <option value="INVENTORY_TIER">Inventory Tier</option>
                <option value="LIMITED_TIME">Limited Time</option>
              </select>
            </div>
            <div className="grid gap-2"><Label>Event</Label><select name="eventId" className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Any</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></div>
            <div className="grid gap-2"><Label>Ticket type</Label><select name="ticketTypeId" className="h-10 rounded-md border bg-background px-3 text-sm"><option value="">Any</option>{ticketTypes.map((ticket) => <option key={ticket.id} value={ticket.id}>{ticket.event.title} - {ticket.name}</option>)}</select></div>
            <div className="grid gap-2"><Label>Price cents</Label><Input name="priceCents" type="number" /></div>
            <div className="grid gap-2"><Label>Discount bps</Label><Input name="discountBps" type="number" placeholder="1000 = 10%" /></div>
            <div className="grid gap-2"><Label>Starts</Label><Input name="startsAt" type="datetime-local" /></div>
            <div className="grid gap-2"><Label>Ends</Label><Input name="endsAt" type="datetime-local" /></div>
            <div className="grid gap-2"><Label>Inventory threshold</Label><Input name="threshold" type="number" /></div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button asChild variant="outline"><Link href="/admin/pricing">Cancel</Link></Button>
              <Button>Save rule</Button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Pricing rules</CardTitle>
              <CardDescription>{rules.length} rule{rules.length === 1 ? "" : "s"} configured.</CardDescription>
            </div>
            {!showCreateForm ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/pricing?create=1"><Plus className="h-4 w-4" />Add pricing rule</Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Scope</TableHead><TableHead>Value</TableHead></TableRow></TableHeader><TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}><TableCell>{rule.name}</TableCell><TableCell>{rule.type}</TableCell><TableCell>{rule.ticketType?.name ?? rule.event?.title ?? "Global"}</TableCell><TableCell>{rule.priceCents ?? rule.discountBps}</TableCell></TableRow>
            ))}
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No pricing rules yet. Use Add pricing rule to create one.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}
