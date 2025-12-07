import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ornamentalDividerVariants = cva("w-full flex items-center justify-center", {
  variants: {
    variant: {
      // Simple: Gradient line with center diamond
      simple: "relative",
      // Flourish: Text ornaments with curved pseudo-elements
      flourish: "gap-4 text-[var(--gold)]",
      // Symbols: Three unicode ornaments with spacing
      symbols: "gap-6 text-[var(--gold)] text-xl",
      // Double-line: Two parallel lines with symbol
      "double-line": "relative flex-col gap-2",
    },
    spacing: {
      tight: "my-4",
      normal: "my-8",
      loose: "my-12",
    },
  },
  defaultVariants: {
    variant: "simple",
    spacing: "normal",
  },
})

interface OrnamentalDividerProps
  extends VariantProps<typeof ornamentalDividerVariants> {
  className?: string
}

function OrnamentalDivider({
  variant,
  spacing,
  className,
}: OrnamentalDividerProps) {
  const baseClasses = cn(ornamentalDividerVariants({ variant, spacing, className }))

  if (variant === "simple") {
    return (
      <div className={baseClasses}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
        <span className="absolute text-[var(--gold)] text-xl">◆</span>
      </div>
    )
  }

  if (variant === "flourish") {
    return (
      <div className={baseClasses}>
        <div className="h-px w-32 bg-gradient-to-r from-transparent to-[var(--gold)]" />
        <span className="text-2xl">✦</span>
        <div className="h-px w-32 bg-gradient-to-l from-transparent to-[var(--gold)]" />
      </div>
    )
  }

  if (variant === "symbols") {
    return (
      <div className={baseClasses}>
        <span>❧</span>
        <span>✦</span>
        <span>❧</span>
      </div>
    )
  }

  if (variant === "double-line") {
    return (
      <div className={baseClasses}>
        <div className="h-px w-full bg-[var(--gold)]/30" />
        <span className="text-[var(--gold)] text-xl">✦</span>
        <div className="h-px w-full bg-[var(--gold)]/30" />
      </div>
    )
  }

  return null
}

export { OrnamentalDivider, ornamentalDividerVariants }
