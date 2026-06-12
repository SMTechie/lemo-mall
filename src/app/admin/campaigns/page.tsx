import Link from "next/link";
import { Plus, X } from "lucide-react";
import { saveCampaignAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminCampaignsPage({ searchParams }: { searchParams?: Promise<{ create?: string }> }) {
  const params = await searchParams;
  const showCreateForm = params?.create === "1";
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage customer email campaigns.</p>
        </div>
        <Button asChild>
          <Link href={showCreateForm ? "/admin/campaigns" : "/admin/campaigns?create=1"}>
            {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showCreateForm ? "Close form" : "Add campaign"}
          </Link>
        </Button>
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/campaigns" title="Create campaign" description="Draft an email campaign for a selected customer audience.">
          <form action={saveCampaignAction} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label>Name</Label><Input name="name" required /></div>
            <div className="grid gap-2"><Label>Subject</Label><Input name="subject" required /></div>
            <div className="grid gap-2">
              <Label>Audience</Label>
              <select name="audience" className="h-10 rounded-md border bg-background px-3 text-sm">
                <option value="ALL_USERS">All users</option>
                <option value="EVENT_ATTENDEES">Event attendees</option>
                <option value="HIGH_VALUE_CUSTOMERS">High-value customers</option>
                <option value="VIP_CUSTOMERS">VIP customers</option>
              </select>
            </div>
            <div className="grid gap-2 md:col-span-2"><Label>Body</Label><Textarea name="body" className="min-h-40" required /></div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button asChild variant="outline"><Link href="/admin/campaigns">Cancel</Link></Button>
              <Button>Save draft</Button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Email campaigns</CardTitle>
              <CardDescription>{campaigns.length} campaign{campaigns.length === 1 ? "" : "s"} drafted.</CardDescription>
            </div>
            {!showCreateForm ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/campaigns?create=1"><Plus className="h-4 w-4" />Add campaign</Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Audience</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead></TableRow></TableHeader><TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}><TableCell className="font-medium">{campaign.name}</TableCell><TableCell>{campaign.audience}</TableCell><TableCell><Badge variant="outline">{campaign.status}</Badge></TableCell><TableCell>{campaign.createdAt.toLocaleDateString("en-ZA")}</TableCell></TableRow>
            ))}
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No campaigns yet. Use Add campaign to create a draft.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody></Table>
        </CardContent>
      </Card>
    </div>
  );
}
