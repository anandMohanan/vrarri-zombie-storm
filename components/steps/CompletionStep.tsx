'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';

export default function CompletionStep() {
  const { team, resetToTop } = useAppStore();


  const handleTopNow = () => {
    resetToTop();
  };

  return (
    <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={false}>
      <div className="space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Completion Message */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            登録が完了しました。
          </h1>
          <p className="text-lg text-gray-600">
            Your registration is complete.
          </p>
        </div>

        {/* Team Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              チーム: {team.teamName}
            </p>
            <p className="text-sm text-gray-600">
              Team: {team.teamName}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {team.players.map((player, index) => (
              <div key={player.id} className="flex items-center justify-center space-x-3 bg-white rounded-md px-4 py-2">
                <div 
                  className={`w-5 h-5 rounded border-2 border-white shadow-sm ${
                    player.color === 'red' ? 'bg-red-500' :
                    player.color === 'light-blue' ? 'bg-sky-400' :
                    player.color === 'yellow' ? 'bg-yellow-500' :
                    player.color === 'green' ? 'bg-green-500' :
                    player.color === 'purple' ? 'bg-purple-500' :
                    player.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}
                ></div>
                <span className="font-medium">Player {index + 1}:</span>
                <span>{player.name}</span>
                <span className="text-sm text-gray-500">({player.email})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
          <p className="text-lg text-gray-800">
            このあとは、スタッフが写真撮影や武器の選択にご案内します。
          </p>
          <p className="text-lg text-gray-800">
            スタッフにお声がけください。
          </p>
          <div className="pt-2 border-t border-blue-200">
            <p className="text-base text-gray-600">
              Next, our staff will guide you through photo and weapon selection.
            </p>
            <p className="text-base text-gray-600">
              Please notify a staff member.
            </p>
          </div>
        </div>


        {/* Manual Return Button */}
        <div className="pt-4">
          <Button 
            onClick={handleTopNow}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-md transition-colors duration-200"
          >
            トップに戻る / Top
          </Button>
        </div>
      </div>
    </StepLayout>
  );
}
