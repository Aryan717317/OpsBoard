import { cn } from "../../lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'secondary' | 'danger' | 'warning' | 'success';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: "bg-primary/10 text-primary border-primary/20",
        outline: "border border-muted text-text-secondary",
        secondary: "bg-secondary/10 text-secondary-foreground",
        danger: "bg-danger/10 text-danger",
        warning: "bg-warning/10 text-warning",
        success: "bg-success/10 text-success",
    };

    return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
}
