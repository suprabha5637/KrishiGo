"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NAVIGATION_ITEMS } from '@/constants';
import { Package, Truck, CheckSquare, FileText, Upload, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export default function WarehousePortal() {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');

  return (
    <DashboardLayout sidebarItems={NAVIGATION_ITEMS.warehouse} title="Warehouse Operations">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Operations</h1>
          <p className="text-muted-foreground mt-1">Manage inbound receipts, quality inspections, and outbound dispatch.</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-max mb-8">
        <button
          onClick={() => setActiveTab('inbound')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'inbound' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
        >
          <Upload className="w-4 h-4" />
          <span>Inbound & Quality</span>
        </button>
        <button
          onClick={() => setActiveTab('outbound')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'outbound' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
        >
          <Truck className="w-4 h-4" />
          <span>Outbound Dispatch</span>
        </button>
      </div>

      {activeTab === 'inbound' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inbound Inventory Receipt</CardTitle>
              <CardDescription>Awaiting quality inspection and grading.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Supplier (Farmer)</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity Received</TableHead>
                    <TableHead>Inspection Grade</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">REC-1092</TableCell>
                    <TableCell>Rajesh Kumar</TableCell>
                    <TableCell>Wheat</TableCell>
                    <TableCell>50 Qtl</TableCell>
                    <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                    <TableCell className="text-right">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-primary/90 hover:text-white h-9 px-4 py-2 bg-primary text-primary-foreground">
                        Inspect
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REC-1091</TableCell>
                    <TableCell>Suresh Singh</TableCell>
                    <TableCell>Rice (Paddy)</TableCell>
                    <TableCell>120 Qtl</TableCell>
                    <TableCell><Badge variant="success">Premium</Badge></TableCell>
                    <TableCell className="text-right">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-foreground h-9 px-4 py-2 border bg-transparent">
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REC-1090</TableCell>
                    <TableCell>Amit Patel</TableCell>
                    <TableCell>Tomatoes</TableCell>
                    <TableCell>15 Qtl</TableCell>
                    <TableCell><Badge variant="warning">Standard</Badge></TableCell>
                    <TableCell className="text-right">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-foreground h-9 px-4 py-2 border bg-transparent">
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center space-x-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <CardTitle>Quality Grading Criteria</CardTitle>
              </div>
              <CardDescription>Follow these criteria when inspecting the pending receipts.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-bold text-green-600 mb-2">Premium Grade</h4>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                  <li>Moisture content &lt; 10%</li>
                  <li>No foreign matter</li>
                  <li>Optimal size/color</li>
                </ul>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-bold text-yellow-600 mb-2">Standard Grade</h4>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                  <li>Moisture content 10-14%</li>
                  <li>&lt; 2% foreign matter</li>
                  <li>Acceptable size variance</li>
                </ul>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-bold text-orange-600 mb-2">Value Grade</h4>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                  <li>Moisture content &gt; 14%</li>
                  <li>Minor defects visible</li>
                  <li>Suitable for processing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'outbound' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders to Pick & Pack</CardTitle>
                <CardDescription>Generate picking lists for dispatch.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { order: 'ORD-9912', buyer: 'AgriCorp Foods', items: 3, weight: '150 Qtl' },
                    { order: 'ORD-9913', buyer: 'FreshMart', items: 1, weight: '20 Qtl' },
                  ].map((o, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                      <div>
                        <div className="font-semibold">{o.order}</div>
                        <div className="text-sm text-muted-foreground">{o.buyer}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{o.items} items ({o.weight})</div>
                        <button className="mt-2 text-primary text-sm font-medium hover:underline inline-flex items-center">
                          <Download className="w-4 h-4 mr-1" /> Pick List
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ready for Dispatch</CardTitle>
                <CardDescription>Assign vehicles and dispatch to buyers.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { order: 'ORD-9880', buyer: 'MegaRetail', destination: 'Mumbai Hub', status: 'Packed' },
                    { order: 'ORD-9875', buyer: 'Local Processors', destination: 'Pune Factory', status: 'Loading' },
                  ].map((o, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{o.order}</div>
                          <div className="text-sm text-muted-foreground">{o.buyer} • {o.destination}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={o.status === 'Packed' ? 'outline' : 'warning'}>{o.status}</Badge>
                        {o.status === 'Packed' && (
                          <button className="text-sm text-primary font-medium flex items-center hover:underline">
                            Dispatch <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
