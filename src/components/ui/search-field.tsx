"use client";

import Link from "next/link";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

type SearchLinkProps = {
  href: string;
  placeholder: string;
  className?: string;
  "aria-label"?: string;
};

type SearchInputProps = Omit<
  React.ComponentProps<"input">,
  "className" | "type"
> & {
  href?: never;
  className?: string;
  onClear?: () => void;
  clearLabel?: string;
};

const fieldClassName =
  "flex h-control w-full items-center rounded-full bg-card text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/** Shared browse-search presentation for both linked and editable contexts. */
export function SearchField(props: SearchLinkProps | SearchInputProps) {
  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      placeholder,
      className,
      "aria-label": ariaLabel,
    } = props;

    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(fieldClassName, "gap-2 px-4", className)}
      >
        <MagnifyingGlassIcon aria-hidden className="size-icon shrink-0" />
        <span className="truncate">{placeholder}</span>
      </Link>
    );
  }

  const inputFieldProps = props as SearchInputProps;
  const {
    className,
    onClear,
    clearLabel = "Clear search",
    value,
    ...inputProps
  } = inputFieldProps;
  const hasValue = typeof value === "string" && value.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-icon -translate-y-1/2 text-muted-foreground"
      />
      <input
        {...inputProps}
        value={value}
        type="search"
        className={cn(
          fieldClassName,
          "pr-12 pl-12 text-foreground placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {hasValue && onClear && (
        <IconButton
          type="button"
          size="compact"
          variant="ghost"
          icon={XMarkIcon}
          aria-label={clearLabel}
          onClick={onClear}
          className="absolute top-1/2 right-2 -translate-y-1/2"
        />
      )}
    </div>
  );
}
