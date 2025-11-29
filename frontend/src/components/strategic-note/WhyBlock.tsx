import { cn } from "@/lib/utils";

interface WhyBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function WhyBlock({ title, children, className }: WhyBlockProps) {
  return (
    <div
      className={cn(
        "bg-beige border-l-4 border-or rounded-r-lg p-6 my-6",
        className
      )}
    >
      <h4 className="font-serif text-lg font-semibold text-noir mb-2 flex items-center gap-2">
        <span className="text-or">&#9670;</span>
        {title}
      </h4>
      <div className="text-gris-700 text-base leading-relaxed">{children}</div>
    </div>
  );
}

export default WhyBlock;
