import { cn } from "@/utils/helpers";
import { Button } from "../ui/button";
import Link from "next/link";

export type ScheduleButtonProps = {
  className?: string;
};

export const ScheduleButton = ({
  className,
}: ScheduleButtonProps): React.JSX.Element => {
  return (
    <Button size={"lg"} className={cn("w-fit text-lg", className)} asChild>
      <Link href={"https://www.fresha.com"} target="_blank">
        Programeaza
      </Link>
    </Button>
  );
};
