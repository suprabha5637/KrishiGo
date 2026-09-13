"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NAVIGATION_ITEMS } from '@/constants';
import { FileText, Send, Building2, TrendingUp, PackageSearch } from 'lucide-react';

export default function BulkOrderPortal() {
  return (
    <DashboardLayout sidebarItems={NAVIGATION_ITEMS.customer} title="B2B Bulk Orders">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Orders (B2B)</h1>
          <p className="text-muted-foreground mt-1">Request large quantities directly from verified farmers and warehouses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                New Bulk Request
              </CardTitle>
              <CardDescription>Submit your requirements to receive competitive quotes.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Commodity</label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select commodity...</option>
                    <option value="wheat">Wheat (Premium)</option>
                    <option value="rice">Rice (Basmati)</option>
                    <option value="cotton">Cotton</option>
                    <option value="soybean">Soybean</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity Required</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="e.g. 500" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    <select className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      <option value="qtl">Quintals</option>
                      <option value="ton">Tons</option>
                      <option value="kg">Kg</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Delivery Date</label>
                  <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Requirements</label>
                  <textarea placeholder="Quality specifics, packaging needs..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-none shadow-none">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <PackageSearch className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">How it works</h4>
                  <p className="text-sm text-muted-foreground mb-2">1. Submit your bulk requirement details.</p>
                  <p className="text-sm text-muted-foreground mb-2">2. Our algorithm matches you with verified suppliers.</p>
                  <p className="text-sm text-muted-foreground">3. Receive quotes, compare, and accept the best offer.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your Active Requests & Quotes</CardTitle>
              <CardDescription>Track the status of your bulk orders and review received quotes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quotes</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">REQ-B209</TableCell>
                    <TableCell>Wheat (Premium)</TableCell>
                    <TableCell>500 Qtl</TableCell>
                    <TableCell><Badge variant="success">Quotes Ready</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="w-4 h-4" /> 3 Received
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md font-medium transition-colors">
                        View Quotes
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REQ-B208</TableCell>
                    <TableCell>Soybean</TableCell>
                    <TableCell>200 Qtl</TableCell>
                    <TableCell><Badge variant="outline">Sourcing</Badge></TableCell>
                    <TableCell><span className="text-muted-foreground text-sm">0 Received</span></TableCell>
                    <TableCell className="text-right">
                      <button className="text-sm border hover:bg-muted px-3 py-1.5 rounded-md font-medium transition-colors">
                        Details
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REQ-B190</TableCell>
                    <TableCell>Rice (Basmati)</TableCell>
                    <TableCell>1000 Qtl</TableCell>
                    <TableCell><Badge variant="default">Order Placed</Badge></TableCell>
                    <TableCell><span className="text-muted-foreground text-sm">Accepted</span></TableCell>
                    <TableCell className="text-right">
                      <button className="text-sm border hover:bg-muted px-3 py-1.5 rounded-md font-medium transition-colors">
                        Track
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
