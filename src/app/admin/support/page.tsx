import { markEnquiryResolvedAction } from "@/actions/support";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminSupportPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support inbox</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>
                  <p className="font-medium">{enquiry.name}</p>
                  <p className="text-xs text-muted-foreground">{enquiry.email}</p>
                  {enquiry.phone ? <p className="text-xs text-muted-foreground">{enquiry.phone}</p> : null}
                </TableCell>
                <TableCell>{enquiry.subject}</TableCell>
                <TableCell><Badge variant={enquiry.status === "NEW" ? "default" : "outline"}>{enquiry.status}</Badge></TableCell>
                <TableCell className="max-w-md text-sm text-muted-foreground">{enquiry.message}</TableCell>
                <TableCell>{enquiry.createdAt.toLocaleDateString("en-ZA")}</TableCell>
                <TableCell>
                  {enquiry.status !== "RESOLVED" ? (
                    <form action={markEnquiryResolvedAction.bind(null, enquiry.id)}>
                      <Button size="sm" variant="outline">Resolve</Button>
                    </form>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
