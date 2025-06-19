# 🐱 Virtual Cat Feature for Mfer Daily

## Overview

The Virtual Cat is a fun, interactive companion that lives in your Mfer Daily app! This adorable feline friend responds to your activity, has different moods, and can even earn achievements with you. The cat communicates exclusively in cat sounds with occasional "mfers" mixed in!

## Features

### 🎭 Cat Moods
The cat has 6 different moods that change based on your activity:

- **😸 Happy** - When you pet the cat or post daily
- **😴 Sleepy** - When energy is low
- **🤩 Excited** - When you feed the cat or post with mfers
- **🤔 Curious** - When you have mfers but haven't posted today
- **😌 Content** - When you're connected but don't have mfers
- **😿 Lonely** - When you're not connected or energy is low

### 🐱 Cat Language
The cat communicates using authentic cat sounds:
- **Meow!** - General cat communication
- **Purrrr!** - Contentment and happiness
- **Mrow!** - Excitement or attention-seeking
- **Zzz...** - Sleepy sounds
- **\*purr\*** - Soft purring sounds
- **\*mfers\*** - Occasional "mfer" references mixed in
- **\*pounce\***, **\*stretch\***, **\*tail swish\*** - Cat actions

### ⚡ Energy System
- The cat's energy decreases over time (5% per hour)
- Feed the cat to restore energy to 100%
- Pet the cat to gain 10 energy
- Play with the cat to gain 15 energy
- Low energy affects the cat's mood

### 🎮 Interactions
- **Pet** - Click the cat emoji to pet it (increases happiness and energy)
- **Feed** - Click the feed button to give the cat food (restores energy)
- **Play** - Click the play button to play with the cat (increases energy and excitement)

### 🏆 Achievement System
The cat tracks your progress and unlocks achievements:

- **🐱 First Meow** - Make your first post
- **😺 Mfer Friend** - Own at least one mfer
- **😸 Mfer Collector** - Own 5+ mfers
- **📝 Daily Poster** - Post for 7 consecutive days
- **❤️ Cat Lover** - Interact with the cat 10 times
- **🏆 Consistent Mfer** - Post for 30 days
- **🐈 Cat Whisperer** - Keep the cat happy for a week

### 🎨 Visual Features
- **Animations**: Bounce, purr, sleep, and achievement glow animations
- **Custom Cursor**: Cat paw cursor for interactive elements
- **Gradient Text**: Cat's name uses a colorful gradient
- **Responsive Design**: Adapts to different screen sizes
- **Mood-based Emojis**: Different cat emojis for each mood
- **Dynamic Messages**: Cat sounds change randomly every 10 seconds

## Technical Implementation

### Components
- `VirtualCat.tsx` - Main cat component with mood system and interactions
- `CatAchievements.tsx` - Achievement tracking and display
- `useCatStats.ts` - Custom hook for tracking user statistics

### State Management
- Cat state is persisted in localStorage
- Stats are tracked per user address
- Achievements are saved locally

### CSS Animations
- Custom keyframe animations for cat behaviors
- Smooth transitions between moods
- Achievement celebration effects

## Usage

1. **Connect your wallet** - The cat will appear in the bottom-right corner
2. **Interact with the cat** - Pet, feed, or play with your feline friend
3. **Post daily** - The cat gets excited when you post with your mfers
4. **Track achievements** - View your progress in the top-left corner
5. **Keep the cat happy** - Regular interactions keep your cat in good spirits

## Cat Communication Examples

### Mood Messages:
- Happy: "Purrrr! Meow meow! *mfers* 😸"
- Sleepy: "Zzz... *yawns* Meow... zzz..."
- Excited: "Meow! Meow! *mfers* 🎉 Purrrr!"
- Curious: "Meow? *tilts head* Meow meow..."

### Interaction Messages:
- Pet: "Purrrr! Meow! *happy purr* 😸"
- Feed: "Nom nom! Meow! *mfers* 🍽️ Purrrr!"
- Play: "Meow! *pounces* *mfers* 🎾 Purrrr!"

## Customization

### Adding New Cat Sounds
Edit the `CAT_SOUNDS` array in `VirtualCat.tsx`:
```typescript
const CAT_SOUNDS = [
  'Meow!',
  'Purrrr!',
  'Meow meow!',
  '*purr*',
  '*meow*',
  'Mrow!',
  // Add your own cat sounds here!
];
```

### Adding New Cat Names
Edit the `CAT_NAMES` array in `VirtualCat.tsx`:
```typescript
const CAT_NAMES = [
  'Whiskers', 'Mittens', 'Shadow', 'Luna', 'Leo', 'Bella', 'Oliver', 'Lucy',
  'Simba', 'Nala', 'Tiger', 'Smokey', 'Ginger', 'Boots', 'Fluffy', 'Milo',
  // Add your own cat names here!
];
```

### Adding New Achievements
Edit the `ACHIEVEMENTS` array in `CatAchievements.tsx`:
```typescript
const ACHIEVEMENTS = [
  // ... existing achievements
  {
    id: 'your-achievement',
    title: 'Your Achievement',
    description: 'Meow! *your achievement*',
    icon: '🎯',
    requirement: 'What the user needs to do'
  }
];
```

### Customizing Animations
Add new animations to `globals.css`:
```css
@keyframes yourAnimation {
  0%, 100% { /* animation states */ }
  50% { /* animation states */ }
}

.animate-your-animation {
  animation: yourAnimation 1s ease-in-out;
}
```

## Future Enhancements

- **Cat Accessories** - Hats, collars, and other items
- **Cat Breeds** - Different cat types with unique behaviors
- **Multiplayer** - Cats can interact with other users' cats
- **Cat Stories** - Daily cat adventures and narratives
- **Cat Trading** - Trade cat items with other users
- **Cat Events** - Special events and limited-time activities
- **More Cat Sounds** - Additional meows, purrs, and cat expressions

## Contributing

Feel free to add new features, fix bugs, or improve the cat's personality! The virtual cat is designed to be easily extensible and customizable.

---

*Made with ❤️ and lots of cat puns for the Mfer community! Meow! Purrrr! *mfers*!* 