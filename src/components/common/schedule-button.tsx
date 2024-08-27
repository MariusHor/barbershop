import { type VariantProps } from "class-variance-authority";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

import { Button, type buttonVariants } from "../ui/button";
import { cn } from "@/utils/helpers";
import { api } from "@/utils/api";

export type ScheduleButtonProps = {
  text?: string;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  href?: Url;
};

export const ScheduleButton = ({
  text,
  className,
  variant,
  href,
  size = "lg",
}: ScheduleButtonProps): React.JSX.Element | null => {
  const { data } = api.content.getSiteSettings.useQuery(undefined, {
    enabled: !href,
  });

  const linkHref = href ?? data?.scheduleLink;
  if (!linkHref) return null;

  return (
    <Button
      size={size}
      className={cn(
        "font-600 w-fit rounded-none text-lg text-muted hover:bg-primary-foreground",
        className,
      )}
      variant={variant}
      asChild
    >
      <Link href={linkHref} target="_blank">
        {text ?? "Programeaza"}
      </Link>
    </Button>
  );
};
