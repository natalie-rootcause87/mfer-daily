'use client';

import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
}

interface CatAchievementsProps {
  totalPosts: number;
  daysActive: number;
  mferCount: number;
  catInteractions: number;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-post',
    title: 'First Meow',
    description: 'Meow! *first purr*',
    icon: '🐱',
    requirement: 'Post once'
  },
  {
    id: 'mfer-friend',
    title: 'Mfer Friend',
    description: 'Purrrr! *mfers* friend!',
    icon: '😺',
    requirement: 'Own 1 mfer'
  },
  {
    id: 'mfer-collector',
    title: 'Mfer Collector',
    description: 'Meow! *many mfers* purrrr!',
    icon: '😸',
    requirement: 'Own 5+ mfers'
  },
  {
    id: 'daily-poster',
    title: 'Daily Poster',
    description: 'Meow meow! *daily purr*',
    icon: '📝',
    requirement: 'Post for 7 days'
  },
  {
    id: 'cat-lover',
    title: 'Cat Lover',
    description: 'Purrrr! *loves cat* meow!',
    icon: '❤️',
    requirement: '10 cat interactions'
  },
  {
    id: 'consistent-mfer',
    title: 'Consistent Mfer',
    description: 'Meow! *consistent purr*',
    icon: '🏆',
    requirement: 'Post for 30 days'
  },
  {
    id: 'cat-whisperer',
    title: 'Cat Whisperer',
    description: 'Purrrr! *whispers* meow!',
    icon: '🐈',
    requirement: 'Happy cat for 7 days'
  }
];

export default function CatAchievements({
  totalPosts,
  daysActive,
  mferCount,
  catInteractions,
  onAchievementUnlocked
}: CatAchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('catAchievements');
      if (saved) {
        return JSON.parse(saved).map((a: any) => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
        }));
      }
    }
    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
  });

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('catAchievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check for new achievements
  useEffect(() => {
    const newAchievements = [...achievements];
    let hasNewAchievement = false;

    // First post achievement
    if (totalPosts >= 1 && !newAchievements.find(a => a.id === 'first-post')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'first-post')!;
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      hasNewAchievement = true;
    }

    // Mfer friend achievement
    if (mferCount >= 1 && !newAchievements.find(a => a.id === 'mfer-friend')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'mfer-friend')!;
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      hasNewAchievement = true;
    }

    // Mfer collector achievement
    if (mferCount >= 5 && !newAchievements.find(a => a.id === 'mfer-collector')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'mfer-collector')!;
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      hasNewAchievement = true;
    }

    // Daily poster achievement
    if (daysActive >= 7 && !newAchievements.find(a => a.id === 'daily-poster')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'daily-poster')!;
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      hasNewAchievement = true;
    }

    // Cat lover achievement
    if (catInteractions >= 10 && !newAchievements.find(a => a.id === 'cat-lover')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'cat-lover')!;
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      hasNewAchievement = true;
    }

    if (hasNewAchievement) {
      setAchievements(newAchievements);
      const newAchievement = newAchievements.find(a => a.unlocked && a.unlockedAt && 
        a.unlockedAt.getTime() === new Date().getTime());
      if (newAchievement) {
        setShowAchievement(newAchievement);
        onAchievementUnlocked?.(newAchievement);
        setTimeout(() => setShowAchievement(null), 3000);
      }
    }
  }, [totalPosts, daysActive, mferCount, catInteractions, achievements, onAchievementUnlocked]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <>
      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{showAchievement.icon}</span>
            <div>
              <div className="font-bold">{showAchievement.title}</div>
              <div className="text-sm">{showAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Summary */}
      <div className="fixed top-4 left-4 z-40">
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold">🏆 Achievements</div>
            <div className="text-sm text-gray-600">
              {unlockedCount}/{totalCount} unlocked
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement List (can be toggled) */}
      <div className="fixed bottom-4 left-4 z-40">
        <details className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
          <summary className="p-3 cursor-pointer font-bold">🏆 View All Achievements</summary>
          <div className="p-3 max-h-64 overflow-y-auto">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center gap-2 mb-2 p-2 rounded ${
                  achievement.unlocked 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-gray-100 border border-gray-300 opacity-50'
                }`}
              >
                <span className="text-xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{achievement.title}</div>
                  <div className="text-xs text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-gray-500">{achievement.requirement}</div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-green-600">
                      Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
                {achievement.unlocked && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>
        </details>
      </div>
    </>
  );
} 