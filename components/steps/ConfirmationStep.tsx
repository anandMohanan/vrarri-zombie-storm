'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';
import Image from 'next/image';

export default function ConfirmationStep() {
    const { currentPlayer, setCurrentStep } = useAppStore();

    const handleEdit = () => {
        setCurrentStep('user-details');
    };

    const handleConfirm = () => {
        setCurrentStep('terms');
    };

    const getGenderDisplay = (gender: string) => {
        const genderMap = {
            'male': '男性 / Male',
            'female': '女性 / Female',
            'other': 'その他 / Other',
            'prefer-not-to-say': '回答しない / Prefer not to say'
        };
        return genderMap[gender as keyof typeof genderMap] || gender;
    };

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

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={true}>
            <div className="space-y-8">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-gray-900">
                        入力内容に間違いがないかご確認ください。
                    </h1>
                    <p className="text-gray-600">
                        Make Sure All The Information Is Correct
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Game Image Placeholder */}
                    <div className="space-y-4">
                        <Image src="/images/zombie-storm.jpg" alt="Zombie Storm" width={400} height={200} />
                    </div>

                    {/* Player Information */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-600">名前 / Name</span>
                                    <div className="font-medium text-lg">{currentPlayer.name}</div>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-600">メールアドレス / Email address</span>
                                    <div className="font-medium">{currentPlayer.email}</div>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-600">電話番号 / Phone number</span>
                                    <div className="font-medium">{currentPlayer.phone}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600">生年月日 / Date of birth</span>
                                        <div className="font-medium">{currentPlayer.dateOfBirth}</div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-600">性別 / Gender</span>
                                        <div className="font-medium">{getGenderDisplay(currentPlayer.gender || '')}</div>
                                    </div>
                                </div>

                                {/* Player Color Indicator */}
                                <div className="flex items-center space-x-2 pt-2">
                                    <span className="text-sm text-gray-600">Player Color:</span>
                                    <div
                                        className={`w-6 h-6 rounded ${getPlayerColorClass(currentPlayer.color || '')} border-2 border-white shadow-sm`}
                                    ></div>
                                    <span className="text-sm font-medium capitalize">{currentPlayer.color}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-6">
                    <Button
                        onClick={handleEdit}
                        variant="outline"
                        size="lg"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-md"
                    >
                        修正 / Edit
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        size="lg"
                        className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-md transition-colors duration-200"
                    >
                        登録する / Confirm
                    </Button>
                </div>
            </div>
        </StepLayout>
    );
}
