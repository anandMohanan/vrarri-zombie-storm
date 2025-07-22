'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import StepLayout from '../layout/StepLayout';

const games = [
    {
        name: 'Zombie Storm',
        img: '/images/zombie-storm.jpg',
        jpDesc: '宝探しアドベンチャー',
        enDesc: 'Rescue the scientist NOA from the zombie stronghold!',
    },
];

export default function GameSelectionStep() {
    const [selected, setSelected] = useState<string | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    const { setSelectedGame, setCurrentStep } = useAppStore();

    useEffect(() => {
        if (!api) return;

        const updateSelected = () => {
            const currentIndex = api.selectedScrollSnap();
            setSelected(games[currentIndex].name);
        };

        updateSelected();
        api.on('select', updateSelected);

        return () => {
            api.off('select', updateSelected);
        };
    }, [api]);

    const handleNext = () => {
        if (!selected) return;
        setSelectedGame(selected);
        setCurrentStep('session-code');
    };

    return (
        <StepLayout showHeader={true} showTeamNumber={false} showPlayerIndicator={false}>
            <div className="max-w-xl mx-auto p-6 ">
                <p className="text-2xl font-bold text-center mb-2">
                    ゲームを選択してください
                </p>
                <p className="text-lg text-center mb-6">Select a Game to Play</p>

                <Carousel className="w-full" setApi={setApi}>
                    <CarouselContent>
                        {games.map((g) => (
                            <CarouselItem key={g.name} className="basis-full">
                                <div className="transition">
                                    <Image
                                        src={g.img}
                                        alt={g.name}
                                        width={400}
                                        height={200}
                                    />
                                    <p className="text-center mt-2">{g.jpDesc}</p>
                                    <p className="text-center text-sm text-gray-600">
                                        {g.enDesc}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

                <Button
                    className="w-full mt-6"
                    disabled={!selected}
                    onClick={handleNext}
                >
                    Next
                </Button>
            </div>
        </StepLayout>
    );
}
