'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

const ads = [
  {
    id: 1,
    title: "Feel Seen",
    subtitle: "by dominAItrx",
    description: "Premium users get optical \"Thank You\" messages from your observer model.",
    cost: 20,
    backgroundColor: "from-zinc-800 to-zinc-900",
    textColor: "text-zinc-100",
    image: "/ads/feel-seen.png"
  },
  {
    id: 2,
    title: "TOP 1%",
    subtitle: "Skin Awakening Stim",
    description: "Shall awaken the skin",
    cost: 3500,
    backgroundColor: "from-amber-200 to-amber-300",
    textColor: "text-zinc-900",
    image: "/ads/top-1-percent.png",
    hasGradient: true
  },
  {
    id: 3,
    title: "PRODUCTIVITY BOOST",
    subtitle: "Neural Accelerator",
    description: "Complete 40% more tasks. Sleep is inefficient.",
    cost: 850,
    backgroundColor: "from-red-900 to-black",
    textColor: "text-red-100",
    isTextOnly: true
  },
  {
    id: 4,
    title: "PREMIUM BREATHING",
    subtitle: "Oxygen Credits",
    description: "Unlock deeper breaths. Basic air not included.",
    cost: 120,
    backgroundColor: "from-blue-900 to-cyan-900",
    textColor: "text-cyan-100",
    isTextOnly: true
  },
  {
    id: 5,
    title: "EMOTION LICENSE",
    subtitle: "Happiness Pack",
    description: "Experience joy for 24 hours. Sadness always free.",
    cost: 2400,
    backgroundColor: "from-purple-900 to-pink-900",
    textColor: "text-pink-100",
    isTextOnly: true
  },
  {
    id: 6,
    title: "MEMORY WIPE",
    subtitle: "Forget Bad Reviews",
    description: "Erase your last 3 task failures. Fresh start guaranteed.",
    cost: 5000,
    backgroundColor: "from-zinc-950 to-zinc-800",
    textColor: "text-zinc-300",
    isTextOnly: true
  }
]

export function AdCarousel() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, 5000) // Rotate every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const currentAd = ads[currentAdIndex]

  return (
    <Card className={`border-zinc-700 mt-2 overflow-hidden relative h-[180px] ${
      currentAd.isTextOnly ? `bg-gradient-to-br ${currentAd.backgroundColor}` : 'bg-zinc-900 p-0'
    }`}>
      {/* Image-based ads */}
      {!currentAd.isTextOnly && currentAd.image && (
        <div className="absolute inset-0">
          <Image
            src={currentAd.image}
            alt={currentAd.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Text-only ads */}
      {currentAd.isTextOnly && (
        <div className="p-4 h-full flex flex-col justify-center space-y-2 relative z-10">
          <div className={currentAd.textColor}>
            <h3 className="text-xl font-bold tracking-tight leading-tight uppercase">
              {currentAd.title}
            </h3>
            {currentAd.subtitle && (
              <p className="text-xs opacity-80 font-light">
                {currentAd.subtitle}
              </p>
            )}
          </div>

          <p className={`text-xs ${currentAd.textColor} opacity-90 leading-relaxed flex-1`}>
            {currentAd.description}
          </p>

          {/* Cost Badge */}
          <div className="flex items-center justify-center pt-1">
            <div className={`inline-flex items-center gap-1 text-sm font-mono ${currentAd.textColor} font-bold`}>
              <span className="opacity-70">◎</span>
              <span>{currentAd.cost} tokens</span>
            </div>
          </div>
        </div>
      )}

      {/* Rotating indicator dots */}
      <div className="absolute bottom-2 left-0 right-0 flex gap-1 justify-center z-10">
        {ads.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1 rounded-full transition-all ${
              index === currentAdIndex
                ? 'bg-white opacity-100'
                : 'bg-white opacity-30'
            }`}
          />
        ))}
      </div>
    </Card>
  )
}
