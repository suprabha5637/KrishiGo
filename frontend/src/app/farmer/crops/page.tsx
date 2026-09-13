import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CropManagement() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-900">Crop Management</h1>
          <p className="text-gray-500 mt-1">Manage your active crops, update their status, and predict harvest times.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Add New Crop
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crop Info
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Planted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Harvest
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Mock Row 1 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                    T
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Tomatoes (Roma)</div>
                    <div className="text-sm text-gray-500">Field 2 • 1.5 Acres</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Aug 01, 2026
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Oct 15, 2026</div>
                <div className="text-xs text-gray-500">in ~30 days</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Growing Healthy
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-500 mx-2">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>

            {/* Mock Row 2 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                    P
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Potatoes (Russet)</div>
                    <div className="text-sm text-gray-500">Field 1 • 3 Acres</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Jul 15, 2026
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Sep 30, 2026</div>
                <div className="text-xs text-amber-600 font-medium">in ~15 days</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                  Harvest Preparation
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-500 mx-2">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
