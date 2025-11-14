import { Item } from "@/types/item";

const STORAGE_KEY = "stuff-tracker-items";

export const loadItems = (): Item[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading items from localStorage:", error);
    return [];
  }
};

export const saveItems = (items: Item[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving items to localStorage:", error);
  }
};
