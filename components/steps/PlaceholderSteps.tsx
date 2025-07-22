'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';

// User Details Step
export function UserDetailsStep() {
    const { setCurrentStep } = useAppStore();

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={true}>
            <div className="text-center space-y-8">
                <h1 className="text-2xl font-bold">User Details Step</h1>
                <p>This will contain the user input form</p>
                <Button onClick={() => setCurrentStep('confirmation')}>
                    Next (Temporary)
                </Button>
            </div>
        </StepLayout>
    );
}

// Confirmation Step
export function ConfirmationStep() {
    const { setCurrentStep } = useAppStore();

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={true}>
            <div className="text-center space-y-8">
                <h1 className="text-2xl font-bold">Confirmation Step</h1>
                <p>This will show the user's entered information</p>
                <Button onClick={() => setCurrentStep('terms')}>
                    Confirm (Temporary)
                </Button>
            </div>
        </StepLayout>
    );
}

// Terms Step
export function TermsStep() {
    const { setCurrentStep } = useAppStore();

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={true}>
            <div className="text-center space-y-8">
                <h1 className="text-2xl font-bold">Terms and Signature Step</h1>
                <p>This will contain terms and signature pad</p>
                <Button onClick={() => setCurrentStep('team-name')}>
                    Agree (Temporary)
                </Button>
            </div>
        </StepLayout>
    );
}

// Team Name Step
export function TeamNameStep() {
    const { setCurrentStep } = useAppStore();

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={false}>
            <div className="text-center space-y-8">
                <h1 className="text-2xl font-bold">Team Name Step</h1>
                <p>This will contain team name input</p>
                <Button onClick={() => setCurrentStep('completion')}>
                    Complete (Temporary)
                </Button>
            </div>
        </StepLayout>
    );
}

// Completion Step
export function CompletionStep() {
    const { resetToTop } = useAppStore();

    return (
        <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={false}>
            <div className="text-center space-y-8">
                <h1 className="text-2xl font-bold">Registration Complete!</h1>
                <p>This will show completion message</p>
                <Button onClick={resetToTop}>
                    Back to Top (Temporary)
                </Button>
            </div>
        </StepLayout>
    );
}
