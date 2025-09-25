
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

const ads = [
  {
    title: "Anuncie sua Marca Aqui",
    description: "Alcance milhares de investidores e entusiastas do mercado financeiro.",
    imageUrl: "https://picsum.photos/seed/finance-ad/800/400",
    link: "#",
    dataAiHint: "finance advertising",
  },
  {
    title: "Relatórios de Mercado Exclusivos",
    description: "Assine nosso plano premium e receba análises aprofundadas.",
    imageUrl: "https://picsum.photos/seed/market-report/800/400",
    link: "#",
    dataAiHint: "market reports",
  },
  {
    title: "A Melhor Plataforma para Day Trade",
    description: "Opere com a menor latência e as melhores ferramentas.",
    imageUrl: "https://picsum.photos/seed/trading-desk/800/400",
    link: "#",
    dataAiHint: "trading platform",
  },
];

export function AdCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {ads.map((ad, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative h-[300px] w-full">
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={ad.dataAiHint}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h3 className="text-2xl font-bold font-headline text-shadow-lg">{ad.title}</h3>
                    <p className="mt-2 max-w-md text-shadow">{ad.description}</p>
                    <Button variant="secondary" className="mt-4">Saiba Mais</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

