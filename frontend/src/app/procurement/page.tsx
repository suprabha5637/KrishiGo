import { CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProcurementSystem() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Procurement & Grading</h1>
          <p className="text-gray-500 mt-1">Grade incoming farmer supplies and issue payments.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Delivery ID</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Farmer</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Crop & Qty</th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Grade Assignment</th>
              <th scope="col" className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Pending Grading */}
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">#DLV-8821</td>
              <td className="px-6 py-4 text-gray-600">Ram Singh</td>
              <td className="px-6 py-4 text-gray-900">
                Tomatoes (Roma)<br/>
                <span className="text-gray-500">500 kg received</span>
              </td>
              <td className="px-6 py-4">
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                  <option>Select Grade...</option>
                  <option value="premium">Premium (Top Quality)</option>
                  <option value="standard">Standard (Good)</option>
                  <option value="value">Value (Cosmetic Imperfections)</option>
                  <option value="reject">Reject (Unsafe/Spoiled)</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Submit Grade</Button>
              </td>
            </tr>

            {/* Graded, Awaiting Payment Approval */}
            <tr className="bg-gray-50/50">
              <td className="px-6 py-4 font-medium text-gray-900">#DLV-8820</td>
              <td className="px-6 py-4 text-gray-600">Sita Devi</td>
              <td className="px-6 py-4 text-gray-900">
                Onions<br/>
                <span className="text-gray-500">1000 kg received</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  Standard Grade
                </span>
                <p className="text-xs text-gray-500 mt-1">Graded by: John D.</p>
              </td>
              <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                <Button size="sm" variant="outline" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Pay ₹15,000
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400">
                  <FileText className="w-4 h-4" />
                </Button>
              </td>
            </tr>
            
            {/* Rejected */}
             <tr className="bg-red-50/20">
              <td className="px-6 py-4 font-medium text-gray-900">#DLV-8819</td>
              <td className="px-6 py-4 text-gray-600">Amit Kumar</td>
              <td className="px-6 py-4 text-gray-900">
                Apples<br/>
                <span className="text-gray-500">200 kg received</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Rejected (Spoiled)
                </span>
              </td>
              <td className="px-6 py-4 text-right flex justify-end">
                 <span className="text-sm text-gray-500 flex items-center">
                   <XCircle className="w-4 h-4 mr-1 text-red-500" /> Closed
                 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
