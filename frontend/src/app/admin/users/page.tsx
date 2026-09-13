import { Search, Filter, MoreVertical, Edit2, Ban, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UserManagement() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system access for customers, farmers, and staff.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          + Add New User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search by name, email, or phone..." />
        </div>
        <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white min-w-[200px]">
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="farmer">Farmers</option>
          <option value="warehouse">Warehouse Staff</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">User</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Role</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Status</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Last Login</th>
              <th scope="col" className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    RK
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Rahul Kumar</div>
                    <div className="text-sm text-gray-500">rahul@example.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-100 text-gray-800">
                  Customer
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">2 hours ago</td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-600 mx-2" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-600" title="Suspend">
                  <Ban className="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                    RS
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Ram Singh</div>
                    <div className="text-sm text-gray-500">+91 98765 43210</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-amber-100 text-amber-800">
                  Farmer
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">1 day ago</td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-600 mx-2" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-600" title="Suspend">
                  <Ban className="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                    AS
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Admin Staff</div>
                    <div className="text-sm text-gray-500">admin@krishigo.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-md bg-indigo-100 text-indigo-800">
                  <Shield className="w-3 h-3 mr-1" /> Admin
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">Just now</td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-gray-600 mx-2" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
