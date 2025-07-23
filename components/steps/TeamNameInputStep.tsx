'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function TeamNameInputStep() {
    const { team, setTeamName, completeRegistration } = useAppStore();
    const [teamNameInput, setTeamNameInput] = useState(team.teamName || '');
    const [isCompleting, setIsCompleting] = useState(false);

    const handleCompleteRegistration = async () => {
        setIsCompleting(true);
        try {
            setTeamName(teamNameInput);
            await completeRegistration();
            toast.success('Team registration completed! / チーム登録が完了しました');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again. / 登録に失敗しました。もう一度お試しください。');
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={false}>
            <div className="space-y-16 gap-8">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-gray-900">
                        チーム名を入力してください
                    </h1>
                    <p className="text-gray-600">
                        Please enter the team name.
                    </p>
                </div>

                {/* Team Name Input */}
                <div className="space-y-4">
                    <Input
                        id="teamName"
                        placeholder="Team XRC"
                        value={teamNameInput}
                        onChange={(e) => setTeamNameInput(e.target.value)}
                        className="text-lg p-4 border-gray-300 text-center"
                        disabled={isCompleting}
                    />
                </div>

                {/* Complete Registration Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={handleCompleteRegistration}
                        disabled={!teamNameInput.trim() || isCompleting}
                        size="lg"
                        className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-8 py-4 text-lg font-medium rounded-md transition-colors duration-200 min-w-[320px]"
                    >
                        {isCompleting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            '登録する / Confirm'
                        )}
                    </Button>
                </div>
            </div>
        </StepLayout>
    );
}
