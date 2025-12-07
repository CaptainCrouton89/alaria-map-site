import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const marginaliaVariants = cva(
  // Base styles: responsive positioning
  "text-[var(--ink-muted)] max-w-xs lg:absolute lg:w-48",
  {
    variants: {
      side: {
        // Desktop: float in gutters with negative margin and rotation
        left: "lg:-left-56 lg:rotate-[-1deg]",
        right: "lg:-right-56 lg:rotate-[2deg]",
      },
      variant: {
        // Quote: Italic with decorative opening mark
        quote:
          'italic text-sm before:content-["""] before:text-[var(--gold)] before:text-2xl before:mr-1 before:leading-none',
        // Note: Boxed callout style
        note: "text-xs bg-[var(--parchment-light)] border border-[var(--border)] rounded px-3 py-2",
        // Annotation: Minimal styling
        annotation: "text-xs",
      },
    },
    defaultVariants: {
      side: "right",
      variant: "note",
    },
  }
)

interface MarginaliaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marginaliaVariants> {
  children: React.ReactNode
}

function Marginalia({
  side,
  variant,
  children,
  className,
  ...props
}: MarginaliaProps) {
  return (
    <aside
      className={cn(marginaliaVariants({ side, variant, className }))}
      {...props}
    >
      {children}
    </aside>
  )
}

export { Marginalia, marginaliaVariants }
