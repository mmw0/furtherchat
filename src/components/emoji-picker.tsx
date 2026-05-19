'use client'

import { useState, useMemo } from 'react'

const EMOJI_CATEGORIES: Record<string, string[]> = {
  '😊 Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐'],
  '❤️ Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟'],
  '👋 Gestures': ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏'],
  '🎉 Objects': ['🎉','🎊','🎈','🎁','🎀','🎆','🎇','🧨','✨','💫','🌟','⭐','🔥','💥','💫','🎵','🎶','🎸','🎹','🎤','🏆','🥇','🎯','🎮','🎲','🧩','💎','💰','📱','💻','📸','🎬','📚','✏️','📝','📌'],
  '🐱 Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕'],
  '🍕 Food': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🫘','🥐','🥖','🍞','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿'],
  '⚽ Sports': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','⛷️','🏂'],
  '🏠 Places': ['🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🕍','⛩️','🕋','⛲','⛺','🏕️','🏖️','🏜️','🏝️','🌋','⛰️','🏔️','🗻','🏕️','🌅','🌄','🌠','🎇','🎆','🌇','🌆','🏙️','🌃','🌌','🌉','🌁'],
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
  isDark: boolean
}

export function EmojiPicker({ onSelect, onClose, isDark }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0])
  const [search, setSearch] = useState('')

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES[activeCategory] || []
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat()
    return allEmojis
  }, [activeCategory, search])

  return (
    <div className={`absolute bottom-full left-0 mb-2 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Search */}
      <div className="p-2 border-b border-inherit">
        <input
          type="text"
          placeholder="Search emoji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full h-8 text-sm rounded-lg px-3 outline-none ${isDark ? 'bg-slate-800 text-white placeholder:text-slate-500' : 'bg-slate-100 text-slate-900 placeholder:text-slate-400'}`}
        />
      </div>
      {/* Category tabs */}
      <div className={`flex overflow-x-auto gap-0.5 p-1 border-b border-inherit`}>
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSearch('') }}
            className={`shrink-0 px-2 py-1 text-xs rounded-lg transition-all ${activeCategory === cat ? (isDark ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-900') : (isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}
          >
            {cat.split(' ')[0]}
          </button>
        ))}
      </div>
      {/* Emoji grid */}
      <div className="h-48 overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, i) => (
            <button
              key={`${emoji}-${i}`}
              onClick={() => { onSelect(emoji); onClose() }}
              className="h-9 w-9 flex items-center justify-center text-xl hover:bg-slate-700/30 rounded-lg transition-all active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
