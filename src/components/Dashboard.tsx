import { Item } from "@/types/item";
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
  items: Item[];
}

const LOW_STOCK_THRESHOLD = 5;

export const Dashboard = ({ items }: DashboardProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalValue = items.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + price * item.quantity;
  }, 0);
  
  const lowStockItems = items.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD);
  const uniqueProducts = items.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Items Card */}
        <motion.div variants={item}>
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <Package className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 opacity-60" />
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-blue-100">Total Items</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {totalItems.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-blue-200">
                  {uniqueProducts} unique product{uniqueProducts !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Value Card */}
        <motion.div variants={item}>
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <DollarSign className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 opacity-60" />
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-emerald-100">Total Value</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-sm text-emerald-200">
                  Inventory worth
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low Stock Alert Card */}
        <motion.div variants={item}>
          <div className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
            lowStockItems.length > 0 
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30' 
              : 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/25 hover:shadow-xl hover:shadow-slate-400/30'
          }`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                {lowStockItems.length > 0 && (
                  <span className="flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                )}
              </div>
              
              <div className="mt-4">
                <p className={`text-sm font-medium ${lowStockItems.length > 0 ? 'text-amber-100' : 'text-slate-200'}`}>
                  Low Stock
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {lowStockItems.length}
                </p>
                <p className={`mt-1 text-sm ${lowStockItems.length > 0 ? 'text-amber-200' : 'text-slate-300'}`}>
                  {lowStockItems.length > 0 ? 'Items need attention' : 'All stocked up'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Items List */}
      {lowStockItems.length > 0 && (
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 p-5 backdrop-blur-sm">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-amber-500/10 p-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="font-medium text-amber-900">Items Running Low</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((stockItem, index) => (
                  <motion.span
                    key={stockItem.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-amber-200/50 text-amber-800 rounded-full text-sm font-medium shadow-sm"
                  >
                    {stockItem.name}
                    <span className="text-xs px-1.5 py-0.5 bg-amber-100 rounded-full text-amber-600">
                      {stockItem.quantity}
                    </span>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
