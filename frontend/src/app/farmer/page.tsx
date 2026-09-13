import Link from 'next/link';
import { Sprout, DollarSign, CloudRain, AlertTriangle, ArrowRight } from 'lucide-react';

export default function FarmerDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-900">Farmer Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Ram Singh! Here's what's happening on your farm.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">₹45,200</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Crops</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Weather Alert</p>
            <p className="text-lg font-bold text-gray-900">Rain Expected</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pest Risk</p>
            <p className="text-lg font-bold text-red-600">High (Aphids)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Active Crops Overview */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Current Crops</h2>
            <Link href="/farmer/crops" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
              Manage Crops <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Planted Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Harvest</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Tomatoes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">Aug 01, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">Oct 15, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Growing</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Potatoes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">Jul 15, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">Sep 30, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">Harvest Near</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Assistant Quick Widget */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">AI Assistant Insights</h2>
            <Link href="/farmer/assistant" className="text-green-600 hover:text-green-700 text-sm font-medium">View All</Link>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <Sprout className="w-6 h-6 text-green-700 mr-2" />
              <h3 className="font-semibold text-green-900">Daily Tip</h3>
            </div>
            <p className="text-sm text-green-800 leading-relaxed">
              Based on the expected rainfall tomorrow, consider delaying your planned irrigation for the Tomato field to prevent root rot. Also, market demand for Potatoes is peaking in your region!
            </p>
            <Link href="/farmer/assistant" className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
