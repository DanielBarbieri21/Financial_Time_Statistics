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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{value}</div>
            <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", changeColor)}>
                {changeIcon}
                <span>{change}</span>
            </div>
          </CardContent>
        </Card>
    )
}
