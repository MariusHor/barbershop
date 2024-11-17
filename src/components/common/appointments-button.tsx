import { type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { type Url } from "next/dist/shared/lib/router/router";

import { api } from "@/utils/api";
import { type buttonVariants } from "../ui/button";
import { ButtonLink } from "./button-link";

export type AppointmentsButtonProps = {
  children?: ReactNode;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  href?: Url;
};

export const AppointmentsButton = ({
  className,
  href,
  variant = "default",
  children = "Programeaza",
  size = "default",
}: AppointmentsButtonProps): React.JSX.Element | null => {
  const { data } = api.content.getSiteSettings.useQuery(undefined, {
    enabled: !href,
  });

  const _href = href ?? data?.appointmentsUrl;
  if (!_href) return null;

  return (
    <ButtonLink
      size={size}
      variant={variant}
      href={_href}
      className={className}
    >
      {children}
    </ButtonLink>
  );
};
