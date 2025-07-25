"use client";
import { useAppStore } from '@/lib/store';
import WelcomeStep from '@/components/steps/WelcomeStep';
import SessionCodeStep from '@/components/steps/SessionCodeStep';
import UserDetailsStep from '@/components/steps/UserDetailsStep';
import ConfirmationStep from '@/components/steps/ConfirmationStep';
import TermsStep from '@/components/steps/TermsStep';
import TeamNameStep from '@/components/steps/TeamNameStep';
import TeamNameInputStep from '@/components/steps/TeamNameInputStep';
import CompletionStep from '@/components/steps/CompletionStep';
import { useEffect } from 'react';
import GameSelectionStep from '@/components/steps/GameSelectionStep';

interface UserClientProps {
    storeId: string;
}

export const UserClient = ({ storeId }: UserClientProps) => {
    const { team, initializeSession } = useAppStore();

    useEffect(() => {
        if (!team.sessionCode) {
            initializeSession(storeId);
        }
    }, [team.sessionCode, initializeSession, storeId]);

    const renderCurrentStep = () => {
        switch (team.currentStep) {
            case 'welcome':
                return <WelcomeStep />;
            case 'game-selection':
                return <GameSelectionStep />;
            case 'session-code':
                return <SessionCodeStep />;
            case 'user-details':
                return <UserDetailsStep />;
            case 'confirmation':
                return <ConfirmationStep />;
            case 'terms':
                return <TermsStep />;
            case 'team-name':
                return <TeamNameStep />;
            case 'team-name-input':
                return <TeamNameInputStep />;
            case 'completion':
                return <CompletionStep />;
            default:
                return <WelcomeStep />;
        }
    };

    return (
        <>
        {renderCurrentStep()}
        </>
    );
};
