import { useState, useEffect, useMemo } from "react";
import { Item } from "@/types/item";
import { loadItems, saveItems } from "@/lib/storage";
import { exportToCSV } from "@/lib/csv";
import { ItemForm } from "@/components/ItemForm";
import { ItemTable } from "@/components/ItemTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, Package } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load items from localStorage on mount
  useEffect(() => {
    const loadedItems = loadItems();
    setItems(loadedItems);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0 || items.length === 0) {
      saveItems(items);
    }
  }, [items]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleAddItem = (itemData: Omit<Item, "id">) => {
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
    };
    setItems((prev) => [...prev, newItem]);
    toast.success("Item added successfully!");
  };

  const handleEditItem = (itemData: Omit<Item, "id"> & { id?: string }) => {
    if (!itemData.id) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemData.id ? ({ ...itemData, id: item.id } as Item) : item
      )
    );
    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast.success("Item updated successfully!");
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item deleted successfully!");
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleExportCSV = () => {
    if (items.length === 0) {
      toast.error("No items to export");
      return;
    }
    exportToCSV(items);
    toast.success("CSV exported successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Simple Inventory Management System</h1>
            </div>
            <Button onClick={handleExportCSV} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Add Item Form */}
        <ItemForm onSubmit={handleAddItem} />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Items Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Your Items {filteredItems.length > 0 && `(${filteredItems.length})`}
          </h2>
          <ItemTable
            items={filteredItems}
            onEdit={handleEditClick}
            onDelete={handleDeleteItem}
          />
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            onSubmit={handleEditItem}
            editingItem={editingItem}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
