// Centralized room types configuration
// Update this file when adding new room types

export const ROOM_TYPES = [
  "Single Bed",
  "Double Bed", 
  "Luxury Room",
  "Family Suite",
];

export const PRICE_RANGES = [
  { label: "0 to 500", min: 0, max: 500 },
  { label: "500 to 1000", min: 500, max: 1000 },
  { label: "1000 to 2000", min: 1000, max: 2000 },
  { label: "2000 to 3000", min: 2000, max: 3000 },
];

export const SORT_OPTIONS = [
  "Price Low to High",
  "Price High to Low", 
  "Newest First",
];
