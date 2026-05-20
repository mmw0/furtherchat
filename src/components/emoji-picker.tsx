'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const EMOJI_DATA: { emoji: string; keywords: string[] }[] = [
  // Smileys
  { emoji: '😀', keywords: ['grinning', 'happy', 'smile'] },
  { emoji: '😃', keywords: ['smiley', 'happy', 'big smile'] },
  { emoji: '😄', keywords: ['smile', 'happy', 'laugh'] },
  { emoji: '😁', keywords: ['grin', 'happy', 'teeth'] },
  { emoji: '😆', keywords: ['laugh', 'happy', 'squint'] },
  { emoji: '😅', keywords: ['sweat', 'nervous', 'laugh'] },
  { emoji: '🤣', keywords: ['rofl', 'laugh', 'rolling'] },
  { emoji: '😂', keywords: ['joy', 'laugh', 'tears', 'crying'] },
  { emoji: '🙂', keywords: ['slight smile', 'happy'] },
  { emoji: '🙃', keywords: ['upside down', 'silly'] },
  { emoji: '😉', keywords: ['wink', 'flirt'] },
  { emoji: '😊', keywords: ['blush', 'happy', 'shy'] },
  { emoji: '😇', keywords: ['angel', 'innocent', 'halo'] },
  { emoji: '🥰', keywords: ['love', 'hearts', 'adorable'] },
  { emoji: '😍', keywords: ['heart eyes', 'love', 'adore'] },
  { emoji: '🤩', keywords: ['star', 'excited', 'amazing'] },
  { emoji: '😘', keywords: ['kiss', 'love'] },
  { emoji: '😗', keywords: ['kiss'] },
  { emoji: '😚', keywords: ['kiss', 'blush'] },
  { emoji: '😙', keywords: ['kiss', 'smile'] },
  { emoji: '🥲', keywords: ['smile', 'tear', 'sad happy'] },
  { emoji: '😋', keywords: ['yum', 'delicious', 'tasty'] },
  { emoji: '😛', keywords: ['tongue', 'playful'] },
  { emoji: '😜', keywords: ['wink', 'tongue', 'silly'] },
  { emoji: '🤪', keywords: ['crazy', 'zany', 'wild'] },
  { emoji: '😝', keywords: ['tongue', 'squint'] },
  { emoji: '🤑', keywords: ['money', 'rich'] },
  { emoji: '🤗', keywords: ['hug', 'embrace'] },
  { emoji: '🤭', keywords: ['giggle', 'cover mouth'] },
  { emoji: '🤫', keywords: ['quiet', 'shush', 'silence'] },
  { emoji: '🤔', keywords: ['thinking', 'hmm', 'wonder'] },
  { emoji: '🫡', keywords: ['salute', 'respect'] },
  { emoji: '🤐', keywords: ['zip', 'quiet', 'mute'] },
  { emoji: '🤨', keywords: ['skeptical', 'raised eyebrow'] },
  { emoji: '😐', keywords: ['neutral', 'meh'] },
  { emoji: '😑', keywords: ['expressionless', 'blank'] },
  { emoji: '😶', keywords: ['silent', 'no mouth'] },
  { emoji: '🫥', keywords: ['dotted', 'invisible'] },
  { emoji: '😏', keywords: ['smirk', 'sly'] },
  { emoji: '😒', keywords: ['unamused', 'annoyed'] },
  { emoji: '🙄', keywords: ['eye roll', 'annoyed'] },
  { emoji: '😬', keywords: ['grimace', 'awkward'] },
  { emoji: '🤥', keywords: ['liar', 'pinocchio'] },
  { emoji: '😌', keywords: ['relieved', 'peaceful'] },
  { emoji: '😔', keywords: ['pensive', 'sad'] },
  { emoji: '😪', keywords: ['sleepy', 'tired'] },
  { emoji: '🤤', keywords: ['drool', 'delicious'] },
  { emoji: '😴', keywords: ['sleep', 'zzz'] },
  { emoji: '😷', keywords: ['mask', 'sick', 'covid'] },
  { emoji: '🤒', keywords: ['sick', 'fever', 'thermometer'] },
  { emoji: '🤕', keywords: ['hurt', 'bandage', 'injury'] },
  { emoji: '🤢', keywords: ['nauseated', 'sick', 'gross'] },
  { emoji: '🤮', keywords: ['vomit', 'sick', 'gross'] },
  { emoji: '🥵', keywords: ['hot', 'heat', 'dying'] },
  { emoji: '🥶', keywords: ['cold', 'freezing'] },
  { emoji: '🥴', keywords: ['drunk', 'dizzy', 'woozy'] },
  { emoji: '😵', keywords: ['dizzy', 'dead'] },
  { emoji: '🤯', keywords: ['mind blown', 'exploding', 'shocked'] },
  { emoji: '🤠', keywords: ['cowboy', 'yeehaw'] },
  { emoji: '🥳', keywords: ['party', 'celebrate', 'birthday'] },
  { emoji: '🥸', keywords: ['disguise', 'incognito'] },
  { emoji: '😎', keywords: ['cool', 'sunglasses', 'swagger'] },
  { emoji: '🤓', keywords: ['nerd', 'glasses', 'smart'] },
  { emoji: '🧐', keywords: ['monocle', 'inspect', 'curious'] },
  // Hearts
  { emoji: '❤️', keywords: ['red heart', 'love'] },
  { emoji: '🧡', keywords: ['orange heart', 'love'] },
  { emoji: '💛', keywords: ['yellow heart', 'love'] },
  { emoji: '💚', keywords: ['green heart', 'love'] },
  { emoji: '💙', keywords: ['blue heart', 'love'] },
  { emoji: '💜', keywords: ['purple heart', 'love'] },
  { emoji: '🖤', keywords: ['black heart', 'love', 'dark'] },
  { emoji: '🤍', keywords: ['white heart', 'love', 'pure'] },
  { emoji: '🤎', keywords: ['brown heart', 'love'] },
  { emoji: '💔', keywords: ['broken heart', 'sad', 'heartbreak'] },
  { emoji: '❤️‍🔥', keywords: ['fire heart', 'passion'] },
  { emoji: '❤️‍🩹', keywords: ['mending heart', 'healing'] },
  { emoji: '❣️', keywords: ['exclamation heart'] },
  { emoji: '💕', keywords: ['two hearts', 'love'] },
  { emoji: '💞', keywords: ['revolving hearts', 'love'] },
  { emoji: '💓', keywords: ['beating heart', 'love'] },
  { emoji: '💗', keywords: ['growing heart', 'love'] },
  { emoji: '💖', keywords: ['sparkling heart', 'love'] },
  { emoji: '💘', keywords: ['cupid heart', 'love'] },
  { emoji: '💝', keywords: ['gift heart', 'love'] },
  { emoji: '💟', keywords: ['decoration heart', 'love'] },
  // Gestures
  { emoji: '👋', keywords: ['wave', 'hello', 'bye', 'hi'] },
  { emoji: '🤚', keywords: ['raised back hand', 'stop'] },
  { emoji: '🖐️', keywords: ['hand', 'five', 'splayed'] },
  { emoji: '✋', keywords: ['hand', 'stop', 'high five'] },
  { emoji: '🖖', keywords: ['spock', 'vulcan', 'star trek'] },
  { emoji: '👌', keywords: ['ok', 'perfect', 'great'] },
  { emoji: '🤌', keywords: ['pinched', 'italian'] },
  { emoji: '🤏', keywords: ['small', 'pinching', 'tiny'] },
  { emoji: '✌️', keywords: ['peace', 'victory', 'two'] },
  { emoji: '🤞', keywords: ['crossed fingers', 'luck', 'hope'] },
  { emoji: '🫰', keywords: ['snapping', 'love'] },
  { emoji: '🤟', keywords: ['love you', 'rock'] },
  { emoji: '🤘', keywords: ['rock', 'metal', 'horns'] },
  { emoji: '🤙', keywords: ['call me', 'shaka', 'hang loose'] },
  { emoji: '👈', keywords: ['point left', 'this'] },
  { emoji: '👉', keywords: ['point right', 'that'] },
  { emoji: '👆', keywords: ['point up', 'above'] },
  { emoji: '🖕', keywords: ['middle finger', 'rage'] },
  { emoji: '👇', keywords: ['point down', 'below'] },
  { emoji: '☝️', keywords: ['point up', 'one', 'first'] },
  { emoji: '🫵', keywords: ['point at you'] },
  { emoji: '👍', keywords: ['thumbs up', 'like', 'good', 'yes', 'approve'] },
  { emoji: '👎', keywords: ['thumbs down', 'dislike', 'bad', 'no'] },
  { emoji: '✊', keywords: ['fist', 'power', 'solidarity'] },
  { emoji: '👊', keywords: ['punch', 'fist bump'] },
  { emoji: '🤛', keywords: ['left fist', 'bump'] },
  { emoji: '🤜', keywords: ['right fist', 'bump'] },
  { emoji: '👏', keywords: ['clap', 'applause', 'bravo'] },
  { emoji: '🙌', keywords: ['raising hands', 'celebration', 'yay'] },
  { emoji: '🫶', keywords: ['heart hands', 'love'] },
  { emoji: '👐', keywords: ['open hands', 'hug'] },
  { emoji: '🤲', keywords: ['palms up', 'prayer', 'receive'] },
  { emoji: '🤝', keywords: ['handshake', 'deal', 'agreement'] },
  { emoji: '🙏', keywords: ['pray', 'please', 'thanks', 'namaste'] },
  // Objects
  { emoji: '🎉', keywords: ['party', 'celebrate', 'congrats'] },
  { emoji: '🎊', keywords: ['confetti', 'celebrate'] },
  { emoji: '🎈', keywords: ['balloon', 'party', 'birthday'] },
  { emoji: '🎁', keywords: ['gift', 'present', 'birthday'] },
  { emoji: '🎀', keywords: ['ribbon', 'bow', 'cute'] },
  { emoji: '🎆', keywords: ['fireworks', 'celebrate', 'new year'] },
  { emoji: '🎇', keywords: ['sparkler', 'firework'] },
  { emoji: '🧨', keywords: ['firecracker', 'boom', 'dynamite'] },
  { emoji: '✨', keywords: ['sparkles', 'magic', 'shine', 'new'] },
  { emoji: '💫', keywords: ['dizzy', 'star', 'shooting'] },
  { emoji: '🌟', keywords: ['glowing star', 'awesome'] },
  { emoji: '⭐', keywords: ['star', 'favorite', 'rating'] },
  { emoji: '🔥', keywords: ['fire', 'hot', 'lit', 'trendy'] },
  { emoji: '💥', keywords: ['boom', 'collision', 'impact'] },
  { emoji: '🎵', keywords: ['music', 'note', 'song'] },
  { emoji: '🎶', keywords: ['music', 'notes', 'singing'] },
  { emoji: '🎸', keywords: ['guitar', 'rock', 'music'] },
  { emoji: '🎹', keywords: ['piano', 'keyboard', 'music'] },
  { emoji: '🎤', keywords: ['microphone', 'sing', 'karaoke'] },
  { emoji: '🏆', keywords: ['trophy', 'win', 'champion'] },
  { emoji: '🥇', keywords: ['gold medal', 'first', 'winner'] },
  { emoji: '🎯', keywords: ['target', 'bullseye', 'goal'] },
  { emoji: '🎮', keywords: ['game', 'controller', 'gaming'] },
  { emoji: '🎲', keywords: ['dice', 'random', 'luck'] },
  { emoji: '🧩', keywords: ['puzzle', 'piece'] },
  { emoji: '💎', keywords: ['gem', 'diamond', 'jewel'] },
  { emoji: '💰', keywords: ['money', 'rich', 'dollar'] },
  { emoji: '📱', keywords: ['phone', 'mobile', 'call'] },
  { emoji: '💻', keywords: ['computer', 'laptop', 'code'] },
  { emoji: '📸', keywords: ['camera', 'photo', 'picture'] },
  { emoji: '🎬', keywords: ['movie', 'film', 'clapper'] },
  { emoji: '📚', keywords: ['books', 'study', 'read'] },
  { emoji: '✏️', keywords: ['pencil', 'write', 'edit'] },
  { emoji: '📝', keywords: ['memo', 'write', 'note'] },
  { emoji: '📌', keywords: ['pin', 'mark', 'important'] },
  // Animals
  { emoji: '🐶', keywords: ['dog', 'puppy', 'pet'] },
  { emoji: '🐱', keywords: ['cat', 'kitten', 'pet'] },
  { emoji: '🐭', keywords: ['mouse', 'rat'] },
  { emoji: '🐹', keywords: ['hamster', 'pet'] },
  { emoji: '🐰', keywords: ['rabbit', 'bunny', 'pet'] },
  { emoji: '🦊', keywords: ['fox', 'clever'] },
  { emoji: '🐻', keywords: ['bear', 'teddy'] },
  { emoji: '🐼', keywords: ['panda', 'cute'] },
  { emoji: '🐻‍❄️', keywords: ['polar bear', 'arctic'] },
  { emoji: '🐨', keywords: ['koala', 'cute', 'australia'] },
  { emoji: '🐯', keywords: ['tiger', 'wild'] },
  { emoji: '🦁', keywords: ['lion', 'king', 'roar'] },
  { emoji: '🐮', keywords: ['cow', 'moo'] },
  { emoji: '🐷', keywords: ['pig', 'oink'] },
  { emoji: '🐸', keywords: ['frog', 'ribbit'] },
  { emoji: '🐵', keywords: ['monkey', 'ape'] },
  { emoji: '🙈', keywords: ['see no evil', 'monkey', 'shy'] },
  { emoji: '🙉', keywords: ['hear no evil', 'monkey'] },
  { emoji: '🙊', keywords: ['speak no evil', 'monkey', 'quiet'] },
  { emoji: '🐒', keywords: ['monkey'] },
  { emoji: '🐔', keywords: ['chicken', 'hen'] },
  { emoji: '🐧', keywords: ['penguin', 'cute'] },
  { emoji: '🐦', keywords: ['bird'] },
  { emoji: '🐤', keywords: ['baby chick', 'cute'] },
  { emoji: '🦆', keywords: ['duck', 'quack'] },
  { emoji: '🦅', keywords: ['eagle', 'soar'] },
  { emoji: '🦉', keywords: ['owl', 'wise', 'night'] },
  { emoji: '🦇', keywords: ['bat', 'vampire', 'night'] },
  { emoji: '🐺', keywords: ['wolf', 'howl'] },
  { emoji: '🐗', keywords: ['boar', 'wild pig'] },
  { emoji: '🐴', keywords: ['horse', 'gallop'] },
  { emoji: '🦄', keywords: ['unicorn', 'magic', 'rainbow'] },
  { emoji: '🐝', keywords: ['bee', 'honey', 'buzz'] },
  { emoji: '🪱', keywords: ['worm'] },
  { emoji: '🐛', keywords: ['bug', 'caterpillar'] },
  { emoji: '🦋', keywords: ['butterfly', 'beautiful'] },
  { emoji: '🐌', keywords: ['snail', 'slow'] },
  { emoji: '🐞', keywords: ['ladybug', 'lucky'] },
  { emoji: '🐜', keywords: ['ant', 'tiny'] },
  { emoji: '🪰', keywords: ['fly'] },
  { emoji: '🪲', keywords: ['beetle'] },
  { emoji: '🪳', keywords: ['cockroach'] },
  { emoji: '🦟', keywords: ['mosquito', 'bite'] },
  { emoji: '🦗', keywords: ['cricket'] },
  { emoji: '🕷️', keywords: ['spider', 'web'] },
  { emoji: '🦂', keywords: ['scorpion'] },
  { emoji: '🐢', keywords: ['turtle', 'slow'] },
  { emoji: '🐍', keywords: ['snake', 'hiss'] },
  { emoji: '🦎', keywords: ['lizard'] },
  { emoji: '🦖', keywords: ['dinosaur', 'trex'] },
  { emoji: '🦕', keywords: ['dinosaur', 'brontosaurus'] },
  // Food
  { emoji: '🍎', keywords: ['apple', 'fruit', 'red'] },
  { emoji: '🍊', keywords: ['orange', 'fruit', 'citrus'] },
  { emoji: '🍋', keywords: ['lemon', 'sour', 'fruit'] },
  { emoji: '🍌', keywords: ['banana', 'fruit', 'yellow'] },
  { emoji: '🍉', keywords: ['watermelon', 'fruit', 'summer'] },
  { emoji: '🍇', keywords: ['grapes', 'fruit', 'wine'] },
  { emoji: '🍓', keywords: ['strawberry', 'fruit', 'sweet'] },
  { emoji: '🫐', keywords: ['blueberry', 'fruit'] },
  { emoji: '🍈', keywords: ['melon', 'fruit'] },
  { emoji: '🍒', keywords: ['cherry', 'fruit', 'sweet'] },
  { emoji: '🍑', keywords: ['peach', 'fruit'] },
  { emoji: '🥭', keywords: ['mango', 'fruit', 'tropical'] },
  { emoji: '🍍', keywords: ['pineapple', 'fruit', 'tropical'] },
  { emoji: '🥥', keywords: ['coconut', 'tropical'] },
  { emoji: '🥝', keywords: ['kiwi', 'fruit'] },
  { emoji: '🍅', keywords: ['tomato', 'vegetable'] },
  { emoji: '🍆', keywords: ['eggplant', 'vegetable'] },
  { emoji: '🥑', keywords: ['avocado', 'healthy'] },
  { emoji: '🥦', keywords: ['broccoli', 'vegetable', 'healthy'] },
  { emoji: '🌶️', keywords: ['pepper', 'hot', 'spicy'] },
  { emoji: '🌽', keywords: ['corn', 'vegetable'] },
  { emoji: '🥕', keywords: ['carrot', 'vegetable'] },
  { emoji: '🥐', keywords: ['croissant', 'bread', 'french'] },
  { emoji: '🥖', keywords: ['baguette', 'bread', 'french'] },
  { emoji: '🍞', keywords: ['bread', 'toast'] },
  { emoji: '🧀', keywords: ['cheese', 'cheddar'] },
  { emoji: '🍖', keywords: ['meat', 'bone'] },
  { emoji: '🍗', keywords: ['chicken', 'drumstick'] },
  { emoji: '🥩', keywords: ['steak', 'meat'] },
  { emoji: '🥓', keywords: ['bacon', 'meat'] },
  { emoji: '🍔', keywords: ['burger', 'hamburger', 'fast food'] },
  { emoji: '🍟', keywords: ['fries', 'french fries', 'fast food'] },
  { emoji: '🍕', keywords: ['pizza', 'food', 'italian'] },
  { emoji: '🌭', keywords: ['hotdog', 'sausage'] },
  { emoji: '🥪', keywords: ['sandwich'] },
  { emoji: '🌮', keywords: ['taco', 'mexican'] },
  { emoji: '🌯', keywords: ['burrito', 'mexican'] },
  { emoji: '🥙', keywords: ['pita', 'kebab'] },
  { emoji: '🧆', keywords: ['falafel'] },
  { emoji: '🥚', keywords: ['egg'] },
  { emoji: '🍳', keywords: ['cooking', 'fried egg', 'breakfast'] },
  { emoji: '🥘', keywords: ['stew', 'cooking'] },
  { emoji: '🍲', keywords: ['soup', 'pot'] },
  { emoji: '🥣', keywords: ['bowl', 'cereal', 'soup'] },
  { emoji: '🥗', keywords: ['salad', 'healthy'] },
  { emoji: '🍿', keywords: ['popcorn', 'movie'] },
  // Travel & Places
  { emoji: '🚗', keywords: ['car', 'drive'] },
  { emoji: '🚕', keywords: ['taxi', 'cab'] },
  { emoji: '🚌', keywords: ['bus'] },
  { emoji: '🚀', keywords: ['rocket', 'launch', 'space'] },
  { emoji: '✈️', keywords: ['airplane', 'fly', 'travel'] },
  { emoji: '🚢', keywords: ['ship', 'cruise'] },
  { emoji: '🏠', keywords: ['house', 'home'] },
  { emoji: '🏢', keywords: ['office', 'building'] },
  { emoji: '🌍', keywords: ['earth', 'world', 'globe'] },
  { emoji: '🌙', keywords: ['moon', 'night', 'crescent'] },
  { emoji: '⭐', keywords: ['star'] },
  { emoji: '☀️', keywords: ['sun', 'sunny', 'day'] },
  { emoji: '⛅', keywords: ['cloud', 'partly sunny'] },
  { emoji: '🌧️', keywords: ['rain', 'cloud'] },
  { emoji: '❄️', keywords: ['snow', 'cold', 'winter'] },
  { emoji: '⚡', keywords: ['lightning', 'bolt', 'electric'] },
  { emoji: '🌈', keywords: ['rainbow', 'colorful', 'pride'] },
  // Symbols
  { emoji: '💯', keywords: ['hundred', 'perfect', '100'] },
  { emoji: '💢', keywords: ['anger', 'mad'] },
  { emoji: '💥', keywords: ['boom', 'crash'] },
  { emoji: '💫', keywords: ['dizzy', 'star'] },
  { emoji: '💬', keywords: ['speech', 'chat', 'talk'] },
  { emoji: '💭', keywords: ['thought', 'think'] },
  { emoji: '🕳️', keywords: ['hole', 'abyss'] },
  { emoji: '💤', keywords: ['sleep', 'zzz'] },
  { emoji: '⚠️', keywords: ['warning', 'alert', 'caution'] },
  { emoji: '🚫', keywords: ['forbidden', 'no', 'blocked'] },
  { emoji: '✅', keywords: ['check', 'done', 'yes', 'complete'] },
  { emoji: '❌', keywords: ['cross', 'no', 'wrong', 'cancel'] },
  { emoji: '❓', keywords: ['question', 'what'] },
  { emoji: '❗', keywords: ['exclamation', 'important', 'wow'] },
  { emoji: '🔴', keywords: ['red', 'circle'] },
  { emoji: '🟢', keywords: ['green', 'circle'] },
  { emoji: '🔵', keywords: ['blue', 'circle'] },
  { emoji: '⬛', keywords: ['black', 'square'] },
  { emoji: '⬜', keywords: ['white', 'square'] },
]

const EMOJI_CATEGORIES: Record<string, { icon: string; emojis: string[] }> = {
  'Smileys': {
    icon: '😊',
    emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐'],
  },
  'Hearts': {
    icon: '❤️',
    emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟'],
  },
  'Gestures': {
    icon: '👋',
    emojis: ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏'],
  },
  'Objects': {
    icon: '🎉',
    emojis: ['🎉','🎊','🎈','🎁','🎀','🎆','🎇','🧨','✨','💫','🌟','⭐','🔥','💥','🎵','🎶','🎸','🎹','🎤','🏆','🥇','🎯','🎮','🎲','🧩','💎','💰','📱','💻','📸','🎬','📚','✏️','📝','📌','💯','💬','💭','💤','⚠️','🚫','✅','❌','❓','❗'],
  },
  'Animals': {
    icon: '🐱',
    emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕'],
  },
  'Food': {
    icon: '🍕',
    emojis: ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🌶️','🌽','🥕','🥐','🥖','🍞','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿'],
  },
  'Travel': {
    icon: '🌍',
    emojis: ['🚗','🚕','🚌','🚀','✈️','🚢','🏠','🏢','🌍','🌙','☀️','⛅','🌧️','❄️','⚡','🌈'],
  },
  'Symbols': {
    icon: '💬',
    emojis: ['🔴','🟢','🔵','⬛','⬜','💯','💢','💥','💫','💬','💭','🕳️','💤','⚠️','🚫','✅','❌','❓','❗'],
  },
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
  isDark: boolean
  anchorRect?: DOMRect | null
}

export function EmojiPicker({ onSelect, onClose, isDark, anchorRect }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0])
  const [search, setSearch] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    // Delay to avoid the same click that opened the picker
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick)
    }, 0)
    document.addEventListener('keydown', handleEsc)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES[activeCategory]?.emojis || []
    const q = search.toLowerCase().trim()
    return EMOJI_DATA
      .filter(e => e.keywords.some(k => k.includes(q)) || e.emoji.includes(q))
      .map(e => e.emoji)
  }, [activeCategory, search])

  // Position the picker above the emoji button using fixed positioning
  const pickerStyle: React.CSSProperties = anchorRect
    ? {
        position: 'fixed',
        bottom: window.innerHeight - anchorRect.top + 8,
        left: Math.max(8, Math.min(anchorRect.left - 40, window.innerWidth - 340)),
      }
    : {
        position: 'fixed',
        bottom: 100,
        left: 20,
      }

  const picker = (
    <div
      ref={pickerRef}
      style={pickerStyle}
      className={`w-[320px] rounded-2xl shadow-2xl border overflow-hidden z-[9999] ${isDark ? 'bg-[#1a1f2e]/98 backdrop-blur-xl border-white/10' : 'bg-white/98 backdrop-blur-xl border-slate-200'}`}
    >
      {/* Search */}
      <div className={`p-2.5 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
        <input
          type="text"
          placeholder="Search emoji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className={`w-full h-8 text-sm rounded-xl px-3 outline-none ${isDark ? 'bg-white/5 text-white placeholder:text-slate-500' : 'bg-slate-100 text-slate-900 placeholder:text-slate-400'}`}
        />
      </div>

      {/* Category Tabs */}
      {!search.trim() && (
        <div className={`flex overflow-x-auto gap-0.5 px-2 py-1.5 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
          {Object.entries(EMOJI_CATEGORIES).map(([cat, data]) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearch('') }}
              className={`shrink-0 px-2.5 py-1 text-base rounded-lg transition-all ${activeCategory === cat
                ? (isDark ? 'bg-emerald-500/20 scale-110' : 'bg-emerald-100 scale-110')
                : (isDark ? 'hover:bg-white/5 opacity-60 hover:opacity-100' : 'hover:bg-slate-100 opacity-60 hover:opacity-100')}`}
              title={cat}
            >
              {data.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="h-[220px] overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-0.5">
          {filteredEmojis.map((emoji, i) => (
            <button
              key={`${emoji}-${i}`}
              onClick={() => { onSelect(emoji) }}
              className={`h-9 w-9 flex items-center justify-center text-xl rounded-lg transition-all active:scale-90 hover:scale-110 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              {emoji}
            </button>
          ))}
          {filteredEmojis.length === 0 && (
            <div className={`col-span-8 text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No emojis found
            </div>
          )}
        </div>
      </div>

      {/* Category Label */}
      {!search.trim() && (
        <div className={`px-3 py-1.5 border-t ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
          <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{activeCategory}</span>
        </div>
      )}
    </div>
  )

  // Use portal to render outside of any overflow:hidden containers
  if (typeof document !== 'undefined') {
    return createPortal(picker, document.body)
  }
  return picker
}
