export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  image?: string; // base64 encoded image
}
