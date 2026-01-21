
import React, { useState, useMemo } from 'react';
import { FoodItem, DailyLog } from '../types.ts';

interface AnalysisResultProps {
  food: FoodItem;
  imageUrl: string;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ food, imageUrl, onSave, onCancel }) => {
  const [weight, setWeight] = useState(food.estimatedWeight);

  const stats = useMemo(() => {
    const ratio = weight / 100;
    return {
      calories: Math.round(food.caloriesPer100g * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    };
  }, [weight, food]);

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      foodName: food.name,
      totalCalories: stats.calories,
      protein: stats.protein,
      carbs: stats.carbs,
      fat: stats.fat,
      weight: weight,
      imageUrl: imageUrl
    });
  };

  return (
    <div className="flex flex-col bg-[#F8F9FA] min-h-full animate-in fade-in duration-500 overflow-x-hidden">
      {/* 顶部视觉区域 */}
      <div className="relative w-full h-[25vh] sm:h-[30vh] flex items-center justify-center overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0">
          <img src={`data:image/jpeg;base64,${imageUrl}`} className="w-full h-full object-cover blur-2xl opacity-10" alt="blur-bg" />
        </div>
        <div className="relative z-10 p-1 bg-white rounded-full shadow-2xl">
          <div className="w-40 h-40 rounded-full overflow-hidden border-[2px] border-white">
            <img src={`data:image/jpeg;base64,${imageUrl}`} className="w-full h-full object-cover scale-[1.6]" alt="Food focus" />
          </div>
        </div>
        <button onClick={onCancel} className="absolute top-4 left-4 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="flex-1 px-6 -mt-6 relative z-20 bg-[#F8F9FA] rounded-t-[32px] pt-8 pb-32">
        {/* 卡片：名称与总热量 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{food.name}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">AI 识别结果</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-gray-900 leading-none">{stats.calories}</span>
            <span className="text-[10px] font-bold text-gray-400 block mt-1 uppercase">kcal</span>
          </div>
        </div>

        {/* 滑块：重量调节 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">分量估计</h2>
            <div className="text-sm font-black text-gray-800 bg-gray-50 px-2 py-0.5 rounded-lg">{weight}<span className="text-[10px] ml-0.5">g</span></div>
          </div>
          <div className="py-4">
            <input type="range" min="10" max="800" step="5" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black" />
          </div>
        </div>

        {/* 营养细分 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">蛋白质</span>
            <span className="text-base font-black text-orange-600">{stats.protein}g</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">脂肪</span>
            <span className="text-base font-black text-emerald-600">{stats.fat}g</span>
          </div>
          <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">碳水化合物</span>
            <span className="text-base font-black text-blue-600">{stats.carbs}g</span>
          </div>
        </div>
      </div>

      {/* 底部操作区：瘦身后的按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent z-30">
        <button 
          onClick={handleSave}
          className="w-4/5 max-w-[240px] py-3 bg-black text-white rounded-full font-bold text-sm shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          确认并保存
        </button>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #000; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default AnalysisResult;
