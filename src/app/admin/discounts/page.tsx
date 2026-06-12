import Link from "next/link";
import { Plus, X } from "lucide-react";
import { toggleDiscountAction, saveDiscountAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminDiscountsPage({ searchParams }: { searchParams?: Promise<{ create?: string }> }) {
  const params = await searchParams;
  const showCreateForm = params?.create === "1";
  const discounts = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Discounts</h1>
          <p className="text-muted-foreground">Create and manage promo codes for checkout.</p>
        </div>
        <Button asChild>
          <Link href={showCreateForm ? "/admin/discounts" : "/admin/discounts?create=1"}>
            {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showCreateForm ? "Close form" : "Add promo code"}
          </Link>
        </Button>
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/discounts" title="Create promo code" description="Add a percentage or fixed-value discount for checkout.">
          <form action={saveDiscountAction} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label>Code</Label><Input name="code" placeholder="SUMMER20" required /></div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <select name="type" className="h-10 rounded-md border bg-background px-3 text-sm">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed cents</option>
              </select>
            </div>
            <div className="grid gap-2"><Label>Value</Label><Input name="value" type="number" min="1" required /></div>
            <div className="grid gap-2"><Label>Usage limit</Label><Input name="usageLimit" type="number" min="1" /></div>
            <div className="grid gap-2 md:col-span-2"><Label>Expires at</Label><Input name="expiresAt" type="datetime-local" /></div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button asChild variant="outline"><Link href="/admin/discounts">Cancel</Link></Button>
              <Button>Save code</Button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Promo codes</CardTitle>
              <CardDescription>{discounts.length} code{discounts.length === 1 ? "" : "s"} configured.</CardDescription>
            </div>
            {!showCreateForm ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/discounts?create=1"><Plus className="h-4 w-4" />Add promo code</Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Used</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono font-medium">{discount.code}</TableCell>
                  <TableCell>{discount.type}</TableCell>
                  <TableCell>{discount.value}</TableCell>
                  <TableCell>{discount.usedCount}{discount.usageLimit ? ` / ${discount.usageLimit}` : ""}</TableCell>
                  <TableCell><Badge variant={discount.active ? "default" : "outline"}>{discount.active ? "Active" : "Paused"}</Badge></TableCell>
                  <TableCell>
                    <form action={toggleDiscountAction.bind(null, discount.code, !discount.active)}>
                      <Button size="sm" variant="ghost">{discount.active ? "Pause" : "Activate"}</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No promo codes yet. Use Add promo code to create one.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
