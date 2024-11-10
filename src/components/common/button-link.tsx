import { forwardRef, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { type UrlObject } from "url";

type ButtonLinkProps = {
  href?: string | UrlObject;
  children?: ReactNode;
  external?: boolean;
  className?: string;
} & Omit<ButtonProps, "asChild"> & {
    linkProps?: Omit<
      React.ComponentPropsWithoutRef<typeof Link>,
      "href" | "className"
    >;
  };

function isExternalLink(href?: string | UrlObject): boolean {
  if (typeof href === "string") {
    return href.startsWith("http") || href.startsWith("//");
  }

  if (typeof href === "object") {
    const pathname = href.pathname || "";
    const hostname = href.hostname || "";

    return (
      !!hostname || pathname.startsWith("http") || pathname.startsWith("//")
    );
  }

  return false;
}

export const ButtonLink = forwardRef<HTMLButtonElement, ButtonLinkProps>(
  (
    {
      href,
      children,
      className,
      variant = "link",
      size = "default",
      linkProps = {},
      ...buttonProps
    },
    ref,
  ) => {
    const _isExternalLink = useMemo(() => isExternalLink(href), [href]);

    if (!href) return null;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        asChild
        {...buttonProps}
      >
        <Link
          href={href}
          {...linkProps}
          target={_isExternalLink ? "_blank" : "_self"}
          rel={_isExternalLink ? "noopener noreferrer" : ""}
        >
          {children}
        </Link>
      </Button>
    );
  },
);

ButtonLink.displayName = "ButtonLink";
