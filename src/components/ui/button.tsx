import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        // Primary: ink-colored button with parchment text
        default:
          "bg-[var(--ink)] text-[var(--parchment)] hover:bg-[var(--ink)]/90 shadow-sm",
        // Gold accent button
        accent:
          "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-muted)] shadow-sm",
        // Destructive: muted red
        destructive:
          "bg-destructive text-[var(--parchment-light)] hover:bg-destructive/90 shadow-sm",
        // Outline: parchment background with border
        outline:
          "border border-[var(--border)] bg-[var(--parchment-light)] text-[var(--ink)] shadow-sm hover:bg-[var(--parchment)]",
        // Secondary: darker parchment
        secondary:
          "bg-[var(--parchment-dark)] text-[var(--ink)] hover:bg-[var(--parchment-dark)]/80",
        // Ghost: transparent with hover
        ghost:
          "text-[var(--ink-muted)] hover:bg-[var(--parchment-dark)] hover:text-[var(--ink)]",
        // Link style
        link: "text-[var(--ink)] underline-offset-4 hover:underline",
        // Navigation tab style (for Map/Codex buttons)
        nav: "border border-[var(--border)] bg-[var(--parchment-light)] text-[var(--ink-muted)] shadow-md hover:bg-[var(--parchment)] hover:text-[var(--ink)]",
        // Active navigation tab
        "nav-active":
          "border border-[var(--border)] bg-[var(--parchment-light)] text-[var(--ink)] shadow-md",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
