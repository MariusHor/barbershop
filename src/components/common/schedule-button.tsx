import { cn } from "@/utils/helpers";
import { Button } from "../ui/button";

export type ScheduleButtonProps = {
  className?: string;
};

export const ScheduleButton = ({
  className,
}: ScheduleButtonProps): React.JSX.Element => {
  return (
    <Button size={"lg"} className={cn("w-fit text-lg", className)}>
      Programeaza
    </Button>
  );
};
