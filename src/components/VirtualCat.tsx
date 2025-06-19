'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import catSprite from '/public/cat-sprite.png';

interface VirtualCatProps {
  isConnected: boolean;
  ownedTokens: { title: string; image: string }[];
  hasPostedToday: boolean;
  lastPostTime?: Date;
  onCatInteraction?: (action: string) => void;
}

type CatMood = 'happy' | 'sleepy' | 'excited' | 'curious' | 'content' | 'lonely';

interface CatState {
  mood: CatMood;
  energy: number;
  lastFed: Date;
  lastPetted: Date;
  name: string;
}

const CAT_NAMES = [
  'Whiskers', 'Mittens', 'Shadow', 'Luna', 'Leo', 'Bella', 'Oliver', 'Lucy',
  'Simba', 'Nala', 'Tiger', 'Smokey', 'Ginger', 'Boots', 'Fluffy', 'Milo'
];

const MOOD_EMOJIS = {
  happy: '😸',
  sleepy: '😴',
  excited: '🤩',
  curious: '🤔',
  content: '😌',
  lonely: '😿'
};

const MOOD_MESSAGES = {
  happy: 'Purrrr! Meow meow! *mfers* 😸',
  sleepy: 'Zzz... *yawns* Meow... zzz...',
  excited: 'Meow! Meow! *mfers* 🎉 Purrrr!',
  curious: 'Meow? *tilts head* Meow meow...',
  content: 'Purrrr... meow... *mfers* 😺',
  lonely: 'Meow... meow... *sad meow* 😿'
};

const CAT_SOUNDS = [
  'Meow!',
  'Purrrr!',
  'Meow meow!',
  '*purr*',
  '*meow*',
  'Mrow!',
  '*happy purr*',
  'Meow! *mfers*',
  'Purrrr! *mfers*',
  '*content purr*',
  'Meow! *pounce*',
  '*sleepy meow*',
  'Purrrr! *stretch*',
  'Meow! *tail swish*',
  '*excited purr*'
];

const getRandomCatSound = () => {
  return CAT_SOUNDS[Math.floor(Math.random() * CAT_SOUNDS.length)];
};

// Sprite sheet details
const SPRITE_COLS = 3;
const SPRITE_ROWS = 3;
const SPRITE_SIZE = 96; // px per frame (smaller size)

// Map moods to sprite frame indices (row, col)
const MOOD_TO_FRAME = {
  happy:    [0, 1], // top row, center
  sleepy:   [1, 0], // middle row, left (sleeping)
  excited:  [2, 1], // bottom row, center (smiling)
  curious:  [0, 2], // top row, right (tail up)
  content:  [1, 1], // middle row, center (sitting)
  lonely:   [2, 2], // bottom row, right (lying down)
};

export default function VirtualCat({
  isConnected,
  ownedTokens,
  hasPostedToday,
  lastPostTime,
  onCatInteraction
}: VirtualCatProps) {
  const [catState, setCatState] = useState<CatState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('virtualCat');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastFed: new Date(parsed.lastFed),
          lastPetted: new Date(parsed.lastPetted)
        };
      }
    }
    return {
      mood: 'curious',
      energy: 100,
      lastFed: new Date(),
      lastPetted: new Date(),
      name: CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)]
    };
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isPurring, setIsPurring] = useState(false);
  const [currentMoodMessage, setCurrentMoodMessage] = useState('');

  // Save cat state to localStorage
  useEffect(() => {
    localStorage.setItem('virtualCat', JSON.stringify(catState));
  }, [catState]);

  // Update cat mood based on user activity
  useEffect(() => {
    if (!isConnected) {
      setCatState(prev => ({ ...prev, mood: 'lonely' }));
      return;
    }

    if (ownedTokens.length > 0) {
      if (hasPostedToday) {
        setCatState(prev => ({ ...prev, mood: 'excited' }));
      } else {
        setCatState(prev => ({ ...prev, mood: 'curious' }));
      }
    } else {
      setCatState(prev => ({ ...prev, mood: 'content' }));
    }
  }, [isConnected, ownedTokens.length, hasPostedToday]);

  // Get dynamic mood message
  const getMoodMessage = () => {
    const baseMessages = {
      happy: ['Purrrr! Meow meow! *mfers* 😸', 'Meow! *happy purr* *mfers*', 'Purrrr! *content meow*'],
      sleepy: ['Zzz... *yawns* Meow... zzz...', '*sleepy purr* Zzz...', 'Meow... *yawn* zzz...'],
      excited: ['Meow! Meow! *mfers* 🎉 Purrrr!', '*excited meow* *mfers*!', 'Meow! *bounce* *mfers*!'],
      curious: ['Meow? *tilts head* Meow meow...', '*curious purr* Meow?', 'Meow? *sniffs* Meow...'],
      content: ['Purrrr... meow... *mfers* 😺', '*content purr* Meow...', 'Purrrr! *relaxed meow*'],
      lonely: ['Meow... meow... *sad meow* 😿', '*lonely purr* Meow...', 'Meow... *sad purr*']
    };
    
    const messages = baseMessages[catState.mood];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Energy decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setCatState(prev => {
        const hoursSinceFed = (Date.now() - prev.lastFed.getTime()) / (1000 * 60 * 60);
        const newEnergy = Math.max(0, prev.energy - (hoursSinceFed * 5));
        
        let newMood = prev.mood;
        if (newEnergy < 20) {
          newMood = 'sleepy';
        } else if (newEnergy < 50) {
          newMood = 'lonely';
        }

        return { ...prev, energy: newEnergy, mood: newMood };
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Update mood message periodically
  useEffect(() => {
    setCurrentMoodMessage(getMoodMessage());
    
    const interval = setInterval(() => {
      setCurrentMoodMessage(getMoodMessage());
    }, 10000); // Change message every 10 seconds

    return () => clearInterval(interval);
  }, [catState.mood]);

  const handlePet = () => {
    setIsAnimating(true);
    setIsPurring(true);
    setCatState(prev => ({
      ...prev,
      mood: 'happy',
      lastPetted: new Date(),
      energy: Math.min(100, prev.energy + 10)
    }));
    
    setCurrentMessage(`${getRandomCatSound()} ${getRandomCatSound()} 😸`);
    setShowMessage(true);
    onCatInteraction?.('pet');
    
    setTimeout(() => {
      setIsAnimating(false);
      setIsPurring(false);
      setShowMessage(false);
    }, 2000);
  };

  const handleFeed = () => {
    setIsAnimating(true);
    setCatState(prev => ({
      ...prev,
      mood: 'excited',
      lastFed: new Date(),
      energy: 100
    }));
    
    setCurrentMessage(`Nom nom! ${getRandomCatSound()} 🍽️ ${getRandomCatSound()}`);
    setShowMessage(true);
    onCatInteraction?.('feed');
    
    setTimeout(() => {
      setIsAnimating(false);
      setShowMessage(false);
    }, 2000);
  };

  const handlePlay = () => {
    setIsAnimating(true);
    setCatState(prev => ({
      ...prev,
      mood: 'excited',
      energy: Math.min(100, prev.energy + 15)
    }));
    
    setCurrentMessage(`${getRandomCatSound()} *pounces* 🎾 ${getRandomCatSound()}`);
    setShowMessage(true);
    onCatInteraction?.('play');
    
    setTimeout(() => {
      setIsAnimating(false);
      setShowMessage(false);
    }, 2000);
  };

  // Get sprite frame for current mood
  const [spriteRow, spriteCol] = MOOD_TO_FRAME[catState.mood] || [0, 0];
  const spriteStyle: React.CSSProperties = {
    width: SPRITE_SIZE,
    height: SPRITE_SIZE,
    backgroundImage: `url(/cat-sprite.png)` ,
    backgroundPosition: `-${spriteCol * SPRITE_SIZE}px -${spriteRow * SPRITE_SIZE}px`,
    backgroundSize: `${SPRITE_COLS * SPRITE_SIZE}px ${SPRITE_ROWS * SPRITE_SIZE}px`,
    imageRendering: 'pixelated',
    margin: '0 auto',
  };

  const getCatEmoji = () => {
    const baseEmoji = MOOD_EMOJIS[catState.mood];
    return isAnimating ? '🐱' : baseEmoji;
  };

  const getCatSize = () => {
    return isAnimating ? 'text-6xl' : 'text-5xl';
  };

  const getAnimationClass = () => {
    if (isAnimating) return 'animate-cat-bounce';
    if (isPurring) return 'animate-cat-purr';
    if (catState.mood === 'sleepy') return 'animate-cat-sleep';
    return '';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-lg shadow-lg p-4 border-2 border-gray-200 max-w-xs cat-interactive" style={{ backgroundColor: '#ffe14d' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 cat-gradient bg-clip-text text-transparent">
            {catState.name}
          </div>
          
          <div 
            className={`${getCatSize()} cursor-pointer transition-all duration-300 hover:scale-110 cat-cursor cat-mood-transition ${
              getAnimationClass()
            }`}
            onClick={handlePet}
            title="Pet the cat!"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div style={spriteStyle} />
          </div>
          
          <div className="text-sm text-gray-600 mt-2">
            {currentMoodMessage}
          </div>
          
          {showMessage && (
            <div className="text-sm text-blue-600 mt-2 animate-pulse">
              {currentMessage}
            </div>
          )}
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Energy:</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${catState.energy}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleFeed}
                className="flex-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600 transition-colors cat-interactive"
                disabled={catState.energy >= 100}
              >
                🍽️ Feed
              </button>
              <button
                onClick={handlePlay}
                className="flex-1 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors cat-interactive"
              >
                🎾 Play
              </button>
            </div>
          </div>
          
          {isConnected && ownedTokens.length > 0 && (
            <div className="mt-2 text-xs text-green-600">
              😺 Meow! *mfers* detected! Purrrr!
            </div>
          )}
          
          {hasPostedToday && (
            <div className="mt-2 text-xs text-purple-600 animate-achievement-glow">
              🎉 Meow! *happy dance* Purrrr!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 