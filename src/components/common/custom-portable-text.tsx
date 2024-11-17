import { type ReactNode } from "react";
import {
  PortableText as BasePortableText,
  type PortableTextProps,
  type PortableTextReactComponents,
} from "@portabletext/react";
import { Text } from "../ui/text";
import { cn } from "@/utils/helpers";

interface CustomPortableTextProps {
  value?: PortableTextProps["value"];
  className?: string;
  components?: Partial<PortableTextReactComponents>;
}

export const CustomPortableText = ({
  value,
  className,
  components: customComponents,
}: CustomPortableTextProps) => {
  if (!value) return null;

  const defaultComponents = {
    block: {
      normal: ({ children }: { children?: ReactNode }) => (
        <Text variant="body" className={cn("mb-4 lg:mb-8", className)}>
          {children}
        </Text>
      ),
      h1: ({ children }: { children?: ReactNode }) => (
        <Text variant="h1" className={cn("mb-4 lg:mb-8", className)}>
          {children}
        </Text>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <Text variant="h2" className={cn("mb-3 lg:mb-6", className)}>
          {children}
        </Text>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <Text variant="h3" className={cn("mb-2 lg:mb-4", className)}>
          {children}
        </Text>
      ),
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote
          className={cn("border-l-4 border-gray-200 pl-4 italic", className)}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <ul className={cn("mb-4 list-disc pl-5 lg:mb-8", className)}>
          {children}
        </ul>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <ol className={cn("mb-4 list-decimal pl-5 lg:mb-8", className)}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <li className="mb-2">{children}</li>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <li className="mb-2">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => (
        <em className="italic">{children}</em>
      ),
      link: ({
        value,
        children,
      }: {
        value?: { href: string };
        children?: ReactNode;
      }) => (
        <a
          href={value?.href}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...customComponents,
  };

  return <BasePortableText value={value} components={mergedComponents} />;
};
