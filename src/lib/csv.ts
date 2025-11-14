import { Item } from "@/types/item";

export const exportToCSV = (items: Item[]): void => {
  const headers = ["Name", "Description", "Quantity", "Price", "Image"];
  const rows = items.map((item) => [
    item.name,
    item.description || "",
    item.quantity.toString(),
    item.price?.toString() || "",
    item.image || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `stuff-tracker-${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
