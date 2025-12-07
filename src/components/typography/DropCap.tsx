import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const dropCapVariants = cva(
  "float-left font-display font-semibold leading-none",
  {
    variants: {
      variant: {
        // Simple: Gold Cinzel letter, float left with margin
        simple: "text-6xl text-[var(--gold)] mr-2",
        // Illuminated: Background box with border
        illuminated:
          "text-6xl text-[var(--gold)] bg-[var(--parchment-dark)] border-2 border-[var(--gold)] px-2 py-1",
        // Ornate: Larger with decorative corner ornament
        ornate:
          "text-7xl text-[var(--gold)] relative before:content-['✦'] before:absolute before:text-xs before:top-0 before:right-0 before:text-[var(--gold-muted)]",
      },
    },
    defaultVariants: {
      variant: "simple",
    },
  }
)

interface DropCapProps extends VariantProps<typeof dropCapVariants> {
  children: string
  className?: string
}

function DropCap({ variant, children, className }: DropCapProps) {
  if (!children || children.length === 0) {
    throw new Error("DropCap requires a single character as children")
  }

  const firstChar = children.charAt(0)

  return (
    <span className={cn(dropCapVariants({ variant, className }))}>
      {firstChar}
    </span>
  )
}

export { DropCap, dropCapVariants }
