'use client'

import { useState, useMemo, useEffect, useRef } from 'react'

const EMOJI_CATEGORIES: Record<string, string[]> = {
  '😊 Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐'],
  '❤️ Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟'],
  '👋 Gestures': ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏'],
  '🎉 Objects': ['🎉','🎊','🎈','🎁','🎀','🎆','🎇','🧨','✨','💫','🌟','⭐','🔥','💥','💫','🎵','🎶','🎸','🎹','🎤','🏆','🥇','🎯','🎮','🎲','🧩','💎','💰','📱','💻','📸','🎬','📚','✏️','📝','📌'],
  '🐱 Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕'],
  '🍕 Food': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🫘','🥐','🥖','🍞','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿'],
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
  isDark: boolean
}

export function EmojiPicker({ onSelect, onClose, isDark }: EmojiPickerProps) {
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
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES[activeCategory] || []
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat()
    return allEmojis
  }, [activeCategory, search])

  return (
    <div ref={pickerRef} className={`absolute bottom-full left-0 mb-2 w-80 rounded-2xl shadow-2xl border overflow-hidden z-[60] ${isDark ? 'bg-slate-900/98 backdrop-blur-xl border-white/10' : 'bg-white/98 backdrop-blur-xl border-slate-200'}`}>
      <div className={`p-2 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
        <input type="text" placeholder="Search emoji..." value={search} onChange={(e) => setSearch(e.target.value)}
          className={`w-full h-8 text-sm rounded-xl px-3 outline-none ${isDark ? 'bg-white/5 text-white placeholder:text-slate-500' : 'bg-slate-100 text-slate-900 placeholder:text-slate-400'}`} />
      </div>
      <div className={`flex overflow-x-auto gap-0.5 p-1 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button key={cat} onClick={() => { setActiveCategory(cat); setSearch('') }}
            className={`shrink-0 px-2 py-1 text-xs rounded-lg transition-all ${activeCategory === cat 
              ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600') 
              : (isDark ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100')}`}>
            {cat.split(' ')[0]}
          </button>
        ))}
      </div>
      <div className="h-48 overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, i) => (
            <button key={`${emoji}-${i}`} onClick={() => { onSelect(emoji) }}
              className={`h-9 w-9 flex items-center justify-center text-xl rounded-lg transition-all active:scale-90 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
