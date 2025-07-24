"use client";

import SessionInputStep from '@/components/steps/staff/SessionInputStep';
import PlayerSelectionStep from '@/components/steps/staff/PlayerSelectionStep';
import PhotoCaptureStep from '@/components/steps/staff/PhotoCaptureStep';
import WeaponSelectionStep from '@/components/steps/staff/WeaponSelectionStep';
import CompletionStep from '@/components/steps/staff/CompletionStep';
import { useEffect } from 'react';
import { useStaffStore } from '@/lib/staff-store';

interface StaffClientProps {
    storeId: string;
}

export const StaffClient = ({ storeId }: StaffClientProps) => {
    const { currentStep, resetSession } = useStaffStore();

    useEffect(() => {
        // Initialize staff session with store context
        // Could be used for store-specific configurations
        console.log('Staff app initialized for store:', storeId);
    }, [storeId]);

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'session-input':
                return <SessionInputStep storeId={storeId} />;
            case 'player-selection':
                return <PlayerSelectionStep />;
            case 'photo-capture':
                return <PhotoCaptureStep />;
            case 'weapon-selection':
                return <WeaponSelectionStep />;
            case 'completion':
                return <CompletionStep />;
            default:
                return <SessionInputStep storeId={storeId} />;
        }
    };

    return (
        <>
            {renderCurrentStep()}
        </>
    );
};
