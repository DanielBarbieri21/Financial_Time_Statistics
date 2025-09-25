import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { ExternalLink, Briefcase } from "lucide-react";
  import Link from "next/link";
  
  const brokers = [
    { name: "XP Investimentos", url: "https://www.xpi.com.br/" },
    { name: "BTG Pactual", url: "https://www.btgpactual.com/" },
    { name: "Clear Corretora", url: "https://www.clear.com.br/" },
    { name: "Rico", url: "https://www.rico.com.vc/" },
  ];
  
  export function BrokerLinks() {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle className="font-headline">Principais Corretoras</CardTitle>
          </div>
          <CardDescription>Acesse as plataformas para começar a investir.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {brokers.map((broker) => (
              <li key={broker.name}>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href={broker.url} target="_blank">
                    {broker.name}
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
  