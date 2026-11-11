"use client";

import {
  forwardRef,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export interface GlassProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  className?: string;
}

export const Glass = forwardRef<HTMLDivElement, GlassProps>(function Glass(
  { children, className = "", style, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`look-glass-surface ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: "glass" | "filled" | "outline" | "ghost";
  tint?: string;
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    icon,
    variant = "glass",
    tint,
    className = "",
    style,
    type = "button",
    disabled,
    ...props
  },
  ref
) {
  const variantClass =
    variant === "filled"
      ? "look-btn-filled"
      : variant === "outline"
      ? "look-btn-outline"
      : variant === "ghost"
      ? "look-btn-ghost"
      : "look-btn-glass";

  const customStyle = tint && variant === "filled" ? { backgroundColor: tint, ...style } : style;

  return (
    <button
      ref={ref}
      type={type}
      className={`look-btn ${variantClass} ${className}`}
      style={customStyle}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="look-btn-icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
});

export interface TabBarProps extends Omit<ComponentPropsWithoutRef<"nav">, "onChange"> {
  items?: Array<{ label: string; icon?: ReactNode; id?: string }>;
  active?: string | number;
  onChange?: (id: string | number) => void;
}

export function TabBar({ className = "", items = [], active, onChange, ...props }: TabBarProps) {
  return (
    <nav className={`look-tab-bar ${className}`} {...props}>
      {items.map((item, idx) => {
        const id = item.id ?? idx;
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            className={`look-tab-item ${isActive ? "is-active" : ""}`}
            onClick={() => onChange?.(id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function AfterHydrate({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return children;
}
