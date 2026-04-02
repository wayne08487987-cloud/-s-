/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Plus, 
  Minus, 
  X, 
  Info,
  UtensilsCrossed,
  HeartPulse,
  Dumbbell,
  Baby,
  Users,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  MessageSquare,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { MenuItem, HealthGoal, CartItem, UserProfile, Order, Customization } from './types';
import { HEALTH_GOALS, MENU_ITEMS } from './constants';

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | 'All'>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    height: 0,
    weight: 0,
    bodyFat: 0,
    lifestyle: {
      coffeeIntake: '',
      exerciseFrequency: '',
      goal: '',
      eatingOut: ''
    }
  });
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItem | null>(null);
  const [customization, setCustomization] = useState<Customization>({
    base: 'rice',
    extraMeat: false,
    noSauce: false
  });
  const [pickupTime, setPickupTime] = useState('08:00');
  const [paymentMethod, setPaymentMethod] = useState<'Line Pay' | 'Credit Card'>('Line Pay');
  const [hasClaimedExperience, setHasClaimedExperience] = useState(false);
  const [experienceDay, setExperienceDay] = useState(0);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [minProtein, setMinProtein] = useState(0);
  const [maxCalories, setMaxCalories] = useState(1000);
  const [maxFat, setMaxFat] = useState(100);
  const [maxCarbs, setMaxCarbs] = useState(200);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const recommendedItems = useMemo(() => {
    const goal = userProfile.lifestyle.goal;
    const items = MENU_ITEMS.filter(item => item.id !== 'exp-1' || !hasClaimedExperience);
    
    if (!goal) {
      return items.slice(0, 3);
    }
    
    const matchingItems = items.filter(item => item.category === goal);
    const otherItems = items.filter(item => item.category !== goal);
    
    return [...matchingItems, ...otherItems].slice(0, 3);
  }, [userProfile.lifestyle.goal, hasClaimedExperience]);

  const nutritionistAdvice = useMemo(() => {
    const goal = userProfile.lifestyle.goal;
    const { weight, height } = userProfile;
    const bmi = (weight && height) ? (weight / ((height / 100) ** 2)).toFixed(1) : null;

    const baseAdvice = {
      title: "您的專屬營養建議",
      content: "請先填寫健康檔案，以便營養師為您提供更精確的建議。",
      tips: ["均衡飲食是健康的基礎", "每日飲水量建議為體重 x 30cc", "多攝取原型食物"]
    };

    if (!goal) return baseAdvice;

    switch (goal) {
      case '增肌減脂':
        return {
          title: "增肌減脂專屬建議",
          content: `您的 BMI 為 ${bmi || '待計算'}。建議提高蛋白質攝取比例，並在運動後 30 分鐘內補充優質碳水與蛋白質。`,
          tips: ["每餐蛋白質攝取約 20-30g", "減少加工食品與精緻糖", "搭配重量訓練效果更佳"]
        };
      case '低卡輕食':
        return {
          title: "低卡輕食專屬建議",
          content: "建議以高纖蔬菜為主，搭配低脂肉類（如雞胸、魚類）。注意醬料的使用，盡量選擇原味或清淡調味。",
          tips: ["飯前先喝湯或水增加飽足感", "細嚼慢嚥，每餐吃 7-8 分飽", "避免含糖飲料"]
        };
      case '銀髮族保養':
        return {
          title: "銀髮族保養專屬建議",
          content: "重點在於攝取足夠的鈣質與維生素 D，並確保蛋白質攝取以維持肌肉量。食物應以易咀嚼、好消化為主。",
          tips: ["多攝取深色蔬菜與乳製品", "少量多餐，確保營養均衡", "適度日曬補充維生素 D"]
        };
      case '上班族外食':
        return {
          title: "上班族外食專屬建議",
          content: "外食族常有蔬菜攝取不足與鈉含量過高的問題。建議點餐時多加一份燙青菜，並減少淋醬與加工肉品。",
          tips: ["下午茶改以堅果或水果代替", "注意水分補充，避免久坐", "晚餐盡量清淡"]
        };
      default:
        return baseAdvice;
    }
  }, [userProfile]);

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedGoal !== 'All') {
      items = items.filter(item => item.category === selectedGoal);
    }

    // Price filter
    items = items.filter(item => item.price >= minPrice && item.price <= maxPrice);

    // Nutrition filters
    items = items.filter(item => 
      item.protein >= minProtein && 
      item.calories <= maxCalories &&
      item.fat <= maxFat &&
      item.carbs <= maxCarbs
    );

    // If user has profile and a goal, prioritize those items
    if (userProfile.lifestyle.goal) {
      return [...items].sort((a, b) => {
        if (a.category === userProfile.lifestyle.goal && b.category !== userProfile.lifestyle.goal) return -1;
        if (a.category !== userProfile.lifestyle.goal && b.category === userProfile.lifestyle.goal) return 1;
        return 0;
      });
    }
    return items;
  }, [selectedGoal, userProfile.lifestyle.goal, searchQuery, minPrice, maxPrice, minProtein, maxCalories, maxFat, maxCarbs]);

  const addToCart = (item: MenuItem, custom?: Customization) => {
    if (item.id === 'exp-1' && hasClaimedExperience) {
      alert('每人限領取一次體驗套餐！');
      return;
    }
    
    const finalCustom = custom || { base: 'rice', extraMeat: false, noSauce: false };
    
    setCart(prev => {
      const existingIndex = prev.findIndex(i => 
        i.id === item.id && 
        JSON.stringify(i.customization) === JSON.stringify(finalCustom)
      );
      
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...item, quantity: 1, customization: finalCustom }];
    });
    setSelectedItemForCustomization(null);
  };

  const removeFromCart = (id: string, custom: Customization) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => 
        i.id === id && 
        JSON.stringify(i.customization) === JSON.stringify(custom)
      );
      
      if (existingIndex > -1) {
        const newCart = [...prev];
        if (newCart[existingIndex].quantity > 1) {
          newCart[existingIndex].quantity -= 1;
          return newCart;
        }
        return prev.filter((_, idx) => idx !== existingIndex);
      }
      return prev;
    });
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      total: cartTotal,
      status: 'pending',
      type: 'pickup',
      pickupTime,
      createdAt: new Date(),
      experienceDay: cart.some(i => i.id === 'exp-1') ? 1 : undefined
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsOrderComplete(true);
    
    if (newOrder.experienceDay) {
      setHasClaimedExperience(true);
      setExperienceDay(1);
    }
    
    setCart([]);
    setTimeout(() => {
      setIsOrderComplete(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getGoalIcon = (goal: HealthGoal) => {
    switch (goal) {
      case '增肌減脂': return <TrendingUp className="w-4 h-4" />;
      case '調整腸胃': return <HeartPulse className="w-4 h-4" />;
      case '銀髮族保養': return <Users className="w-4 h-4" />;
      case '兒童健康長高營養': return <TrendingUp className="w-4 h-4" />;
      default: return <UtensilsCrossed className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full olive-accent flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h1 className="serif text-2xl font-semibold tracking-tight">阿爸健康生活點餐</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdminView(!isAdminView)}
              className="text-xs font-bold text-gray-400 hover:text-[#5A5A40] transition-colors"
            >
              {isAdminView ? '切換至用戶端' : '店長登入'}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
            >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {isAdminView ? (
          <section className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] card-shadow border border-orange-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="serif text-3xl font-bold">管理端控制台 (吳先生)</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">系統正常</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">庫存預警: 烤肉排 (8)</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">今日訂單</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                  <p className="text-xs text-green-600 font-medium">↑ 12% vs 昨天</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">總營收</p>
                  <p className="text-3xl font-bold">NT$ {orders.reduce((sum, o) => sum + o.total, 0)}</p>
                  <p className="text-xs text-gray-400 font-medium">今日累計</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">體驗營學員</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.experienceDay).length}</p>
                  <p className="text-xs text-blue-600 font-medium">活躍中</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] card-shadow overflow-hidden">
              <div className="p-6 border-b border-black/5 bg-gray-50">
                <h3 className="font-bold">即時訂單管理</h3>
              </div>
              <div className="divide-y divide-black/5">
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">目前尚無訂單</div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center font-bold text-gray-400">
                          #{order.id.slice(-4)}
                        </div>
                        <div>
                          <p className="font-bold">
                            顧客 <span className="text-xs font-normal text-gray-400">({order.type})</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-sm">{order.pickupTime}</p>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {order.status === 'pending' ? '待處理' : '已完成'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Hero */}
            <section className="mb-12 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest olive-text font-semibold">Healthy Nutrition Center</span>
                  <h2 className="serif text-5xl md:text-6xl leading-tight font-light">
                    讓身體成為<br />
                    <span className="italic text-[#5A5A40]">你想要的樣子</span>
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed max-w-md">
                  我們專注於為不同階段的您提供最精準的營養支持。從增肌減脂到銀髮保養，每一口都是對健康的承諾。
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>台北市大同區承德路一段23號1樓</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>週一至週五 07:30 - 11:30 (其他時間預約制)</span>
                  </div>
                </div>
                <div className="pt-4 flex flex-col gap-4">
                  <button 
                    onClick={() => setShowProfileModal(true)}
                    className="bg-white p-4 rounded-2xl card-shadow border border-[#5A5A40]/10 flex items-center gap-3 hover:bg-[#f5f5f0] transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <HeartPulse className="w-6 h-6 text-[#5A5A40]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        {userProfile.height > 0 ? '已建立健康檔案' : '建立健康檔案'}
                      </p>
                      <p className="text-sm font-semibold">
                        {userProfile.height > 0 ? `${userProfile.weight}kg | ${userProfile.lifestyle.goal || '未設定目標'}` : '獲取客製化建議'}
                      </p>
                    </div>
                  </button>

                  {experienceDay > 0 && (
                    <div className="bg-[#5A5A40] p-6 rounded-3xl text-white card-shadow space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="serif text-lg font-bold italic">3 天窈窕體驗進度</p>
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Day {experienceDay}/3</span>
                      </div>
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-1000" 
                          style={{ width: `${(experienceDay / 3) * 100}%` }} 
                        />
                      </div>
                      <p className="text-xs opacity-80 italic">「理性、效率與服務精神」—— 吳先生與您同行</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-[40px] overflow-hidden card-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=1200" 
                    alt="Healthy Bento" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl card-shadow max-w-[220px] hidden md:block border border-[#5A5A40]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-orange-400 uppercase">Special Offer</span>
                  </div>
                  <p className="serif italic text-lg leading-snug">
                    憑此券可享套餐體驗價 <span className="text-2xl font-bold text-[#5A5A40]">$49</span>
                  </p>
                  <p className="text-[10px] mt-2 text-gray-400">每人限體驗乙次</p>
                </div>
              </div>
            </section>

            {/* Recommended Section */}
            <section className="mb-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="serif text-3xl font-bold mb-2">為您推薦</h2>
                  <p className="text-gray-500">根據您的健康目標，我們為您挑選了最適合的餐點</p>
                </div>
                {userProfile.lifestyle.goal && (
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#5A5A40]/5 rounded-full text-[#5A5A40] text-xs font-bold uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" />
                    目標：{userProfile.lifestyle.goal}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedItems.map(item => (
                  <motion.div
                    key={`rec-${item.id}`}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-[32px] overflow-hidden card-shadow border border-black/5 flex flex-col"
                  >
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider olive-text">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="serif font-semibold text-lg leading-tight">{item.name}</h3>
                          <span className="font-medium text-sm">NT${item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                          {item.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full py-2.5 rounded-xl border border-[#5A5A40] text-[#5A5A40] font-medium text-sm hover:bg-[#5A5A40] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        加入購物車
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Nutritionist Advice Section */}
            <section className="mb-16">
              <div className="bg-[#5A5A40]/5 rounded-[40px] p-8 md:p-12 border border-[#5A5A40]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-3xl overflow-hidden card-shadow relative group">
                      <img 
                        src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800" 
                        alt="Nutritionist" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#5A5A40]/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="serif text-xl font-bold">Dr. Emily Chen</p>
                        <p className="text-xs opacity-80 uppercase tracking-widest">Senior Nutritionist</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center">
                        <HeartPulse className="w-6 h-6" />
                      </div>
                      <h2 className="serif text-3xl font-bold">{nutritionistAdvice.title}</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700 leading-relaxed italic">
                        "{nutritionistAdvice.content}"
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {nutritionistAdvice.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 flex flex-wrap gap-4">
                      <button className="px-8 py-4 rounded-2xl bg-[#5A5A40] text-white font-bold hover:shadow-xl transition-all flex items-center gap-2">
                        查看完整報告
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowProfileModal(true)}
                        className="px-8 py-4 rounded-2xl border border-[#5A5A40] text-[#5A5A40] font-bold hover:bg-[#5A5A40]/5 transition-all"
                      >
                        更新健康檔案
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Search and Filter Section */}
            <section className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜尋餐點名稱或描述..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-black/5 focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] outline-none transition-all card-shadow"
                  />
                </div>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`px-6 py-4 rounded-2xl flex items-center gap-2 font-bold transition-all ${
                    isFilterOpen ? 'bg-[#5A5A40] text-white' : 'bg-white text-gray-600 border border-black/5'
                  } card-shadow`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  進階篩選
                </button>
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-6 rounded-3xl border border-black/5 card-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold olive-text uppercase tracking-wider">價格範圍</label>
                          <span className="text-sm font-medium">NT${minPrice} - NT${maxPrice}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <input
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                          />
                          <input
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                          <span>$0</span>
                          <span>$500</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold olive-text uppercase tracking-wider">最低蛋白質</label>
                          <span className="text-sm font-medium">{minProtein}g</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={minProtein}
                          onChange={(e) => setMinProtein(Number(e.target.value))}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                          <span>0g</span>
                          <span>50g</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold olive-text uppercase tracking-wider">最高卡路里</label>
                          <span className="text-sm font-medium">{maxCalories} kcal</span>
                        </div>
                        <input
                          type="range"
                          min="200"
                          max="1200"
                          step="50"
                          value={maxCalories}
                          onChange={(e) => setMaxCalories(Number(e.target.value))}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                          <span>200 kcal</span>
                          <span>1200 kcal</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold olive-text uppercase tracking-wider">最高脂肪</label>
                          <span className="text-sm font-medium">{maxFat}g</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={maxFat}
                          onChange={(e) => setMaxFat(Number(e.target.value))}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                          <span>0g</span>
                          <span>100g</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold olive-text uppercase tracking-wider">最高碳水</label>
                          <span className="text-sm font-medium">{maxCarbs}g</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="10"
                          value={maxCarbs}
                          onChange={(e) => setMaxCarbs(Number(e.target.value))}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                          <span>0g</span>
                          <span>200g</span>
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            setMinPrice(0);
                            setMaxPrice(300);
                            setMinProtein(0);
                            setMaxCalories(1000);
                            setMaxFat(100);
                            setMaxCarbs(200);
                            setSelectedGoal('All');
                          }}
                          className="w-full py-3 rounded-xl border border-black/10 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                          重設所有篩選
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Goals Filter */}
            <section className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                <button
                  onClick={() => setSelectedGoal('All')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedGoal === 'All' 
                    ? 'olive-accent shadow-lg' 
                    : 'bg-white border border-black/5 hover:border-black/20'
                  }`}
                >
                  全部菜單
                </button>
                {HEALTH_GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => setSelectedGoal(goal)}
                    className={`px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                      selectedGoal === goal 
                      ? 'olive-accent shadow-lg' 
                      : 'bg-white border border-black/5 hover:border-black/20'
                    }`}
                  >
                    {getGoalIcon(goal)}
                    {goal}
                  </button>
                ))}
              </div>
            </section>

            {/* Menu Grid */}
            <section className="min-h-[400px]">
              {filteredItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map(item => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.id}
                        className="bg-white rounded-[32px] overflow-hidden card-shadow group"
                      >
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider olive-text">
                            {item.category}
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="serif text-xl font-semibold leading-tight">{item.name}</h3>
                            <span className="text-lg font-medium">NT$ {item.price}</span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          
                          <div className="grid grid-cols-4 gap-2 py-3 border-y border-black/5">
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase">Kcal</p>
                              <p className="text-xs font-semibold">{item.calories}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase">Prot</p>
                              <p className="text-xs font-semibold">{item.protein}g</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase">Fat</p>
                              <p className="text-xs font-semibold">{item.fat}g</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-400 uppercase">Carb</p>
                              <p className="text-xs font-semibold">{item.carbs}g</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              setSelectedItemForCustomization(item);
                              setCustomization({ base: 'rice', extraMeat: false, noSauce: false });
                            }}
                            className="w-full py-3 rounded-2xl olive-accent font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          >
                            <Plus className="w-4 h-4" />
                            選擇並加入
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="serif text-2xl font-bold mb-2">找不到符合條件的餐點</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    試著調整搜尋關鍵字或篩選條件，看看其他美味的健康餐盒吧！
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setMinPrice(0);
                      setMaxPrice(300);
                      setMinProtein(0);
                      setMaxCalories(1000);
                      setMaxFat(100);
                      setMaxCarbs(200);
                      setSelectedGoal('All');
                    }}
                    className="mt-8 px-8 py-3 bg-[#5A5A40] text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-opacity"
                  >
                    重設所有篩選
                  </button>
                </motion.div>
              )}
            </section>

            {/* Contact Section */}
            <section className="mt-20 bg-white rounded-[40px] p-8 md:p-12 card-shadow grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="serif text-3xl font-bold">聯繫我們</h2>
                <p className="text-gray-500">
                  有任何營養諮詢或訂餐問題？歡迎透過電話或 LINE 與我們聯繫，我們將由專業人員為您服務。
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#5A5A40]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">負責人</p>
                      <p className="font-semibold text-lg">吳秉洋</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#5A5A40]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">門市地址</p>
                      <p className="font-semibold">台北市大同區承德路一段23號1樓</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#5A5A40]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold">諮詢專線</p>
                      <p className="font-semibold">0906-000-923 / 02-25236643</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 bg-[#f5f5f0] p-8 rounded-[32px]">
                <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-inner flex items-center justify-center">
                  {/* Placeholder for QR Code */}
                  <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300">
                    <span className="text-[10px] font-bold uppercase">LINE QR Code</span>
                    <TrendingUp className="w-8 h-8 mt-2 opacity-20" />
                  </div>
                </div>
                <p className="text-sm font-bold olive-text">歡迎加 LINE 諮詢</p>
                <button className="px-8 py-3 bg-[#06C755] text-white rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
                  開啟 LINE 諮詢
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Support Button */}
      <button
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-[#5A5A40] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium">
          客服諮詢
        </span>
      </button>

      {/* Support Modal */}
      <AnimatePresence>
        {isSupportOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSupportOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="bg-[#5A5A40] p-8 text-white text-center space-y-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="serif text-2xl font-bold">客服中心</h2>
                <p className="text-sm opacity-80">我們隨時為您提供協助</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <a href="tel:0800-000-000" className="flex items-center gap-4 p-4 rounded-2xl border border-black/5 hover:border-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">客服專線</p>
                      <p className="font-semibold">0800-000-000</p>
                    </div>
                  </a>

                  <a href="mailto:support@healthy-bento.com" className="flex items-center gap-4 p-4 rounded-2xl border border-black/5 hover:border-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">電子郵件</p>
                      <p className="font-semibold">support@healthy-bento.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-black/5 hover:border-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">LINE 客服</p>
                      <p className="font-semibold">@healthy_bento</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <p className="text-xs text-gray-400 mb-1">服務時間</p>
                  <p className="text-sm font-medium">週一至週五 09:00 - 18:00</p>
                </div>

                <button
                  onClick={() => setIsSupportOpen(false)}
                  className="w-full py-4 rounded-2xl bg-gray-100 font-bold hover:bg-gray-200 transition-colors"
                >
                  關閉視窗
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#f5f5f0] z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 olive-text" />
                  <h2 className="serif text-xl font-semibold">您的餐點</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <UtensilsCrossed className="w-12 h-12 opacity-20" />
                    <p>購物車空空的，來點健康的吧！</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl card-shadow flex gap-4">
                      <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} referrerPolicy="no-referrer" />
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                            {item.customization.base === 'rice' ? '白飯' : '換地瓜'}
                          </span>
                          {item.customization.extraMeat && (
                            <span className="text-[10px] bg-orange-50 px-2 py-0.5 rounded text-orange-600">加量肉類</span>
                          )}
                          {item.customization.noSauce && (
                            <span className="text-[10px] bg-blue-50 px-2 py-0.5 rounded text-blue-600">去醬汁</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-semibold">NT$ {item.price * item.quantity}</span>
                          <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg">
                            <button onClick={() => removeFromCart(item.id, item.customization)} className="p-1 hover:text-red-500 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => addToCart(item, item.customization)} className="p-1 hover:text-green-600 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-black/5 space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">預約取餐時間</label>
                        <select 
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full p-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#5A5A40]"
                        >
                          {['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">支付方式</label>
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#5A5A40]"
                        >
                          <option value="Line Pay">Line Pay</option>
                          <option value="Credit Card">信用卡</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>小計</span>
                        <span>NT$ {cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>外送費 (自取免運)</span>
                        <span>NT$ 0</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-black/5">
                        <span>總計</span>
                        <span>NT$ {cartTotal}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl olive-accent font-bold text-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    確認下單
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Customization Modal */}
      <AnimatePresence>
        {selectedItemForCustomization && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemForCustomization(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-[40px] z-50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <h3 className="serif text-xl font-bold">客製化您的餐點</h3>
                <button onClick={() => setSelectedItemForCustomization(null)} className="p-2 hover:bg-black/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">主食選擇</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setCustomization(prev => ({ ...prev, base: 'rice' }))}
                      className={`py-4 rounded-2xl border-2 transition-all ${customization.base === 'rice' ? 'border-[#5A5A40] bg-[#f5f5f0]' : 'border-gray-100'}`}
                    >
                      <p className="font-bold">精選白飯</p>
                    </button>
                    <button 
                      onClick={() => setCustomization(prev => ({ ...prev, base: 'sweetPotato' }))}
                      className={`py-4 rounded-2xl border-2 transition-all ${customization.base === 'sweetPotato' ? 'border-[#5A5A40] bg-[#f5f5f0]' : 'border-gray-100'}`}
                    >
                      <p className="font-bold">更換地瓜</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">加值選項</p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setCustomization(prev => ({ ...prev, extraMeat: !prev.extraMeat }))}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${customization.extraMeat ? 'border-[#5A5A40] bg-[#f5f5f0]' : 'border-gray-100'}`}
                    >
                      <span className="font-bold">加量肉類 (參考狂食堂)</span>
                      <span className="text-sm olive-text">+NT$ 40</span>
                    </button>
                    <button 
                      onClick={() => setCustomization(prev => ({ ...prev, noSauce: !prev.noSauce }))}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${customization.noSauce ? 'border-[#5A5A40] bg-[#f5f5f0]' : 'border-gray-100'}`}
                    >
                      <span className="font-bold">去醬汁 (更清爽)</span>
                      <span className="text-xs text-gray-400">免費</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(selectedItemForCustomization, customization)}
                  className="w-full py-5 rounded-2xl olive-accent font-bold text-lg shadow-lg"
                >
                  確認並加入購物車 (NT$ {selectedItemForCustomization.price + (customization.extraMeat ? 40 : 0)})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Health Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white">
                  <h3 className="serif text-2xl font-bold">建立您的健康檔案</h3>
                  <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-black/5 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">身高 (cm)</label>
                      <input 
                        type="number" 
                        placeholder="170"
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#5A5A40]"
                        onChange={(e) => setUserProfile(prev => prev ? { ...prev, height: Number(e.target.value) } : { height: Number(e.target.value), weight: 0, bodyFat: 0, lifestyle: { coffeeIntake: '', exerciseFrequency: '', goal: '' } } as any)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">體重 (kg)</label>
                      <input 
                        type="number" 
                        placeholder="65"
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#5A5A40]"
                        onChange={(e) => setUserProfile(prev => prev ? { ...prev, weight: Number(e.target.value) } : { height: 0, weight: Number(e.target.value), bodyFat: 0, lifestyle: { coffeeIntake: '', exerciseFrequency: '', goal: '' } } as any)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">體脂 (%)</label>
                      <input 
                        type="number" 
                        placeholder="20"
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#5A5A40]"
                        onChange={(e) => setUserProfile(prev => prev ? { ...prev, bodyFat: Number(e.target.value) } : { height: 0, weight: 0, bodyFat: Number(e.target.value), lifestyle: { coffeeIntake: '', exerciseFrequency: '', goal: '' } } as any)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="serif text-xl font-bold">生活習慣問卷</p>
                    
                    <div className="space-y-4">
                      <p className="text-sm font-medium">1. 每天咖啡攝取量？</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['不喝', '1杯', '2杯', '3杯以上'].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => setUserProfile(prev => ({ ...prev!, lifestyle: { ...prev!.lifestyle, coffeeIntake: opt } }))}
                            className={`p-3 rounded-xl border text-sm transition-all ${userProfile?.lifestyle.coffeeIntake === opt ? 'bg-[#5A5A40] text-white' : 'bg-white hover:border-gray-300'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium">2. 每週運動頻率？</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['不運動', '1-2次', '3-4次', '5次以上'].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => setUserProfile(prev => ({ ...prev!, lifestyle: { ...prev!.lifestyle, exerciseFrequency: opt } }))}
                            className={`p-3 rounded-xl border text-sm transition-all ${userProfile?.lifestyle.exerciseFrequency === opt ? 'bg-[#5A5A40] text-white' : 'bg-white hover:border-gray-300'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium">3. 您的改進目標？</p>
                      <div className="grid grid-cols-2 gap-3">
                        {HEALTH_GOALS.map(goal => (
                          <button 
                            key={goal}
                            onClick={() => setUserProfile(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, goal: goal } }))}
                            className={`p-4 rounded-xl border text-sm text-left flex items-center gap-3 transition-all ${userProfile.lifestyle.goal === goal ? 'bg-[#5A5A40] text-white' : 'bg-white hover:border-gray-300'}`}
                          >
                            {getGoalIcon(goal)}
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium">4. 您平常的外食頻率？</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['很少', '偶爾', '經常', '幾乎每天'].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => setUserProfile(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, eatingOut: opt } }))}
                            className={`p-3 rounded-xl border text-sm transition-all ${userProfile.lifestyle.eatingOut === opt ? 'bg-[#5A5A40] text-white' : 'bg-white hover:border-gray-300'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="w-full py-5 rounded-2xl olive-accent font-bold text-lg shadow-lg mt-4"
                  >
                    儲存並獲取建議
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order Success Overlay */}
      <AnimatePresence>
        {isOrderComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <div className="bg-white p-12 rounded-[40px] text-center space-y-6 max-w-sm w-full card-shadow">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <HeartPulse className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="serif text-3xl font-bold">訂單已收到！</h2>
                <p className="text-gray-500">我們正在為您準備營養滿分的餐點，請稍候。</p>
              </div>
              <div className="pt-4">
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full olive-accent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#5A5A40] text-white py-3 px-4 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-medium tracking-wide uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              憑券享套餐體驗價 $49
            </span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="hidden sm:inline">每人限體驗乙次</span>
          </div>
          <a href="tel:0906000923" className="hover:underline">諮詢專線: 0906-000-923</a>
        </div>
      </div>
    </div>
  );
}
