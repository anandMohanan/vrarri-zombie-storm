'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

export default function WelcomeStep() {
    const { setCurrentStep } = useAppStore();

    const handleStart = () => {
        setCurrentStep('game-selection');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl rounded-lg ">
                <div className="text-center space-y-8">
                    {/* Logo - Large version for welcome screen */}
                    <div className="mb-12">
                        <div className="text-6xl font-bold text-black mb-2">
                            XR
                            <span className="text-2xl font-normal ml-2">CENTER</span>
                        </div>
                        <div className="flex items-center justify-center space-x-4 mt-4">
                            <div className="h-1 w-16 bg-gray-300"></div>
                            <div className="text-3xl font-bold text-black">GAME SPACE</div>
                            <div className="h-1 w-16 bg-gray-300"></div>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            ようこそ！体験の受付を開始します
                        </h1>
                        <p className="text-lg text-gray-600">
                            Welcome! Begin your check-in below.
                        </p>

                        <div className="mt-8">
                            <p className="text-lg text-gray-700 mb-2">
                                プレイヤー情報の登録を行ってください。
                            </p>
                            <p className="text-base text-gray-600">
                                Please enter your player information to start.
                            </p>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="pt-8">
                        <Button
                            onClick={handleStart}
                            size="lg"
                            variant={"default"}
                            className='cursor-pointer'
                        >
                            Start
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
