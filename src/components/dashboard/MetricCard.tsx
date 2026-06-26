import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MetricCardProps = {
    title: string;
    value: string;
    change: string;
    icon: ReactNode;
    changeIcon?: ReactNode;
    changeColor?: string;
}

export function MetricCard({ title, value, change, icon, changeIcon, changeColor }: MetricCardProps) {
    return (
        <Card className="overflow-hidden border-border/70 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
          </CardHeader>
          <CardContent>
            <div className="font-headline text-2xl font-bold tracking-normal">{value}</div>
            <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", changeColor)}>
                {changeIcon}
                <span>{change}</span>
            </div>
          </CardContent>
        </Card>
    )
}
