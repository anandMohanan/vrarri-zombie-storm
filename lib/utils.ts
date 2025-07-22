import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const storeNames = {
    'nk1': 'Nakano Broadway store',
}

export const storeIdToName = (storeId: string) => {
    return storeNames[storeId] || storeId;
}
