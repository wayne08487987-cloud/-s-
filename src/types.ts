export type HealthGoal = 
  | '增肌減脂'
  | '調整腸胃'
  | '銀髮族保養'
  | '兒童健康長高營養';

export interface UserProfile {
  height: number;
  weight: number;
  bodyFat: number;
  lifestyle: {
    coffeeIntake: string;
    exerciseFrequency: string;
    goal: string;
  };
}

export interface Customization {
  base: 'rice' | 'sweetPotato';
  extraMeat: boolean;
  noSauce: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  category: HealthGoal;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customization: Customization;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  type: 'pickup' | 'delivery';
  pickupTime?: string;
  createdAt: Date;
  experienceDay?: number; // For 3-day experience tracking
}
