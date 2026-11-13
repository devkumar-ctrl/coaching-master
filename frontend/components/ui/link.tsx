import * as React from "react"
import NextLink from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const linkVariants = cva("rounded-xs transition-colors duration-fast underline-offset-4", {
  variants: {
    variant: {
      default: "text-foreground hover:text-primary hover:underline active:text-primary-active",
      muted:
        "text-muted-foreground hover:text-foreground hover:underline active:text-primary-active",
      primary: "text-primary hover:underline active:text-primary-active",
      inverse: "text-inverse hover:underline",
      nav: "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary hover:underline",
      bare: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type AppLinkProps = React.ComponentProps<typeof NextLink> &
  VariantProps<typeof linkVariants> & {
    external?: boolean
  }

function AppLink({
  href,
  variant,
  className,
  external,
  children,
  ...props
}: AppLinkProps) {
  const isExternal = external ?? (typeof href === "string" && /^https?:\/\//.test(href))

  return (
    <NextLink
      href={href}
      className={cn(linkVariants({ variant }), className)}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {isExternal && <span className="sr-only"> (opens in new tab)</span>}
    </NextLink>
  )
}

export { AppLink, linkVariants }
