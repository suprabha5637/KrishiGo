import { Send, Bot, User, Sprout, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AIAppAssistant() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-green-900">AI Farming Assistant</h1>
          <p className="text-gray-500 text-sm mt-1">Get real-time insights on weather, market demand, and crop health.</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-t-xl border-x border-t border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Message */}
          <div className="flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-green-700" />
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-800 text-sm">
              <p>Hello Ram! I am your KrishiGo AI Assistant. Based on your current crops (Tomatoes & Potatoes), here are some quick insights for today:</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-start text-sm bg-white p-2 rounded border border-green-100">
                  <CloudRain className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                  <span><strong>Weather Alert:</strong> 80% chance of heavy rain tomorrow. Consider delaying irrigation.</span>
                </div>
                <div className="flex items-start text-sm bg-white p-2 rounded border border-green-100">
                  <Sprout className="w-4 h-4 text-emerald-500 mr-2 mt-0.5" />
                  <span><strong>Market Demand:</strong> Potato prices in your region are up 12% this week. Great timing for your upcoming harvest!</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex space-x-4 justify-end">
            <div className="bg-gray-100 rounded-2xl rounded-tr-none p-4 max-w-[80%] text-gray-800 text-sm">
              <p>What organic fertilizer should I use for my tomatoes during the fruiting stage?</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Bot Reply */}
          <div className="flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-green-700" />
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-800 text-sm space-y-2">
              <p>For tomatoes in the fruiting stage, they need high Phosphorus (P) and Potassium (K) to support fruit development and prevent blossom end rot.</p>
              <p>I recommend:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Bone Meal:</strong> Excellent for phosphorus.</li>
                <li><strong>Kelp Meal or Wood Ashes:</strong> Good sources of potassium.</li>
                <li><strong>Calcium:</strong> Crushed eggshells can help prevent blossom end rot.</li>
              </ul>
              <p className="italic text-gray-500 text-xs mt-2">You can purchase these directly from the KrishiGo Farmer Store.</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <form className="flex space-x-3">
            <Input 
              type="text" 
              placeholder="Ask about crops, pests, weather, or market rates..." 
              className="flex-1"
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 px-6">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
