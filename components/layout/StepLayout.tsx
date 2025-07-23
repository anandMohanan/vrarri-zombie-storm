'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StepLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    showTeamNumber?: boolean;
    showPlayerIndicator?: boolean;
}

export default function StepLayout({
    children,
    showHeader = true,
    showTeamNumber = false,
    showPlayerIndicator = false
}: StepLayoutProps) {
    const { team, currentPlayer } = useAppStore();

    const getPlayerColorClass = (color: string) => {
        const colorMap = {
            'red': 'bg-red-500',
            'light-blue': 'bg-sky-400',
            'yellow': 'bg-yellow-500',
            'green': 'bg-green-500',
            'purple': 'bg-purple-500',
            'orange': 'bg-orange-500',
        };
        return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
    };

    const getPlayerNumber = () => {
        return team.players.length + 1;
    };

    return (
        <div className="w-full min-h-screen">
            {/* Header - Full Width */}
            {showHeader && (
                <div className=" sticky top-0 rounded-xl p-6 w-full bg-white z-50">
                    <div className="flex items-center justify-between w-full max-w-none px-4">
                        {/* Logo */}
                        <Image src={"/xrcenter_logo_black.png"} width={200} height={50} alt="XR Center Logo" />

                        {/* Team Number and Player Indicator */}
                        <div className="flex items-center space-x-4 align-middle flex-col">
                            {showTeamNumber && team.sessionCode && (
                                <div className="text-xl font-bold ">
                                     <span className="">{team.sessionCode}</span>
                                </div>
                            )}

                            {showPlayerIndicator && currentPlayer.color && (
                                <div className="flex items-center space-x-2">
                                    <span className={cn("text-sm font-medium text-white  px-2 py-1 rounded", getPlayerColorClass(currentPlayer.color))}>
                                        Player{getPlayerNumber()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <Card className="w-full max-w-2xl  ">
                    <CardContent className="">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
