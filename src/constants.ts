import { MenuItem, HealthGoal } from './types';

export const HEALTH_GOALS: HealthGoal[] = [
  '增肌減脂',
  '調整腸胃',
  '銀髮族保養',
  '兒童健康長高營養'
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'exp-1',
    name: '$49 體驗套餐',
    description: '限時體驗優惠！包含精選主食與三種配菜，每人限購一次。',
    price: 49,
    calories: 500,
    protein: 25,
    fat: 15,
    carbs: 65,
    category: '增肌減脂',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '1',
    name: '狂食堂招牌烤肉飯',
    description: '特選梅花豬肉以秘製醬汁火烤，香氣四溢。搭配三種時令蔬菜與半顆滷蛋，均衡美味。',
    price: 120,
    calories: 580,
    protein: 32,
    fat: 18,
    carbs: 72,
    category: '增肌減脂',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: '韓式泡菜烤肉飯',
    description: '爽脆泡菜搭配火烤豬肉，微辣開胃。泡菜含益生菌有助消化，搭配高纖蔬菜。',
    price: 135,
    calories: 550,
    protein: 30,
    fat: 16,
    carbs: 70,
    category: '調整腸胃',
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: '鹽烤鯖魚飯',
    description: '挪威鯖魚鹽烤至表皮金黃，富含Omega-3脂肪酸。魚肉細緻好吸收，守護長輩健康。',
    price: 140,
    calories: 520,
    protein: 28,
    fat: 24,
    carbs: 48,
    category: '銀髮族保養',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: '酥炸厚切排骨飯',
    description: '厚切排骨裹上薄粉酥炸，外酥內嫩。豐富蛋白質與鈣質，滿足發育期兒童需求。',
    price: 125,
    calories: 680,
    protein: 35,
    fat: 25,
    carbs: 78,
    category: '兒童健康長高營養',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'
  }
];
