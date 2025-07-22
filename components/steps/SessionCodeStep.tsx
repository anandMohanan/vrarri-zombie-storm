'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';

export default function SessionCodeStep() {
  const { team, setCurrentStep } = useAppStore();

  const handleNext = () => {
    setCurrentStep('user-details');
  };

  return (
    <StepLayout showHeader={true} showTeamNumber={false} showPlayerIndicator={false}>
      <div className="text-center space-y-8">
        {/* Session Code Display */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-xl text-gray-900">
              あなたのチーム番号は 
              <span className="font-bold text-2xl mx-2">{team.sessionCode}</span> 
              です。
            </h1>
            <p className="text-lg text-gray-600">
              Your team number is <span className="font-bold">{team.sessionCode}</span>.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <p className="text-lg text-gray-700 mb-2">
              チーム全員でこの番号を使って登録を進めます。
            </p>
            <p className="text-base text-gray-600">
              All teammates should use this number to register.
            </p>
          </div>
        </div>

        {/* Session Code Highlight */}
        <div className=" rounded-lg p-4 ">
          <div className="text-sm mb-2">Team Number</div>
          <div className="text-4xl font-bold">{team.sessionCode}</div>
        </div>

        {/* Next Button */}
        <div className="">
          <Button 
            onClick={handleNext}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium rounded-md transition-colors duration-200"
          >
            Next
          </Button>
        </div>
      </div>
    </StepLayout>
  );
}
