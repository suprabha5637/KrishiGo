import { Search, Filter, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function WarehouseInventory() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track stock levels, aging inventory, and zone placement.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Run Stock Count
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search by SKU, product name..." />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter by Zone
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Product</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">SKU</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Zone/Bin</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Qty Available</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">Premium Tomatoes</td>
              <td className="px-6 py-4 text-gray-500">PRD-TOM-PRM</td>
              <td className="px-6 py-4 text-gray-500">Zone A / Bin 12</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">1,250 kg</td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Healthy
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">Value Onions</td>
              <td className="px-6 py-4 text-gray-500">PRD-ONI-VAL</td>
              <td className="px-6 py-4 text-gray-500">Zone B / Bin 04</td>
              <td className="px-6 py-4 text-gray-900 font-semibold text-red-600">
                15 kg
              </td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 flex items-center w-max">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">Organic Potatoes</td>
              <td className="px-6 py-4 text-gray-500">PRD-POT-ORG</td>
              <td className="px-6 py-4 text-gray-500">Zone A / Bin 45</td>
              <td className="px-6 py-4 text-gray-900 font-semibold">840 kg</td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                  Aging (5 days)
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
