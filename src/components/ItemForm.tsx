import { useState, useEffect } from "react";
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ItemFormProps {
  onSubmit: (item: Omit<Item, "id"> & { id?: string }) => void;
  editingItem?: Item | null;
  onCancel?: () => void;
}

export const ItemForm = ({ onSubmit, editingItem, onCancel }: ItemFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || "",
        quantity: editingItem.quantity.toString(),
        price: editingItem.price?.toString() || "",
        image: editingItem.image || "",
      });
    }
  }, [editingItem]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        toast.error("Please upload a JPG or PNG image");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be a positive number");
      return;
    }

    const price = formData.price ? parseFloat(formData.price) : undefined;
    if (price !== undefined && (isNaN(price) || price < 0)) {
      toast.error("Price must be a positive number");
      return;
    }

    const itemData: Omit<Item, "id"> & { id?: string } = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      quantity,
      price,
      image: formData.image || undefined,
    };

    if (editingItem) {
      itemData.id = editingItem.id;
    }

    onSubmit(itemData);

    // Reset form if not editing
    if (!editingItem) {
      setFormData({
        name: "",
        description: "",
        quantity: "",
        price: "",
        image: "",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Item name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="1"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image (JPG/PNG)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {formData.image && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
              {editingItem && onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
