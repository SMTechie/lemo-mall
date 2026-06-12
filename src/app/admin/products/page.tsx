import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { saveProductAction, deleteProductAction } from "@/actions/admin";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminProductsPage({ searchParams }: { searchParams?: Promise<{ create?: string }> }) {
  const params = await searchParams;
  const session = await auth();
  const canManageProducts = session?.user.permissions.includes("manage_products");
  const showCreateForm = canManageProducts && params?.create === "1";
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Products</h1>
          <p className="text-muted-foreground">Manage merchandise, pricing, inventory and visibility.</p>
        </div>
        {canManageProducts ? (
          <Button asChild>
            <Link href={showCreateForm ? "/admin/products" : "/admin/products?create=1"}>
              {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreateForm ? "Close form" : "Add product"}
            </Link>
          </Button>
        ) : null}
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/products" title="Create product" description="Add a new merchandise item with stock and product imagery.">
          <form action={saveProductAction} className="grid gap-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-2"><Label>Name</Label><Input name="name" required /></div>
              <div className="grid gap-2"><Label>Category</Label><Input name="category" required /></div>
              <div className="grid gap-2"><Label>Price cents</Label><Input name="priceCents" type="number" min="100" required /></div>
              <div className="grid gap-2"><Label>Stock</Label><Input name="stock" type="number" min="0" required /></div>
              <div className="grid gap-2 lg:col-span-2"><Label>Description</Label><Textarea name="description" className="min-h-28" required /></div>
              <div className="grid gap-2 lg:col-span-2">
                <Label>Images</Label>
                <AdminImageUpload name="images" multiple />
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" /> Featured product</label>
              <div className="flex gap-2">
                <Button asChild variant="outline"><Link href="/admin/products">Cancel</Link></Button>
                <Button>Save product</Button>
              </div>
            </div>
          </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All products</CardTitle>
              <CardDescription>{products.length} product{products.length === 1 ? "" : "s"} in this workspace.</CardDescription>
            </div>
            {canManageProducts && !showCreateForm ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products?create=1"><Plus className="h-4 w-4" />Add product</Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-md border">
                        <Image src={product.images[0]} alt={product.name} fill sizes="44px" className="object-cover" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatMoney(product.priceCents)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.active ? "Active" : "Hidden"}</TableCell>
                  <TableCell>
                    {canManageProducts ? (
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/products/${product.id}`}>Edit</Link>
                        </Button>
                        <form action={deleteProductAction.bind(null, product.id)}>
                          <Button variant="ghost" size="sm">Hide</Button>
                        </form>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No products yet. Use Add product to create your first item.
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
