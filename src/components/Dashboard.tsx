import { Item } from "@/types/item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle } from "lucide-react";
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

  const stats = [
    {
      title: "Total Items",
      value: totalItems.toLocaleString(),
      subtitle: `${items.length} unique products`,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: "Inventory worth",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.length.toString(),
      subtitle: `Items with ≤${LOW_STOCK_THRESHOLD} quantity`,
      icon: AlertTriangle,
      color: lowStockItems.length > 0 ? "text-amber-600" : "text-muted-foreground",
      bgColor: lowStockItems.length > 0 ? "bg-amber-100" : "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {lowStockItems.length > 0 && (
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <span
                    key={item.id}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  >
                    {item.name} ({item.quantity})
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
