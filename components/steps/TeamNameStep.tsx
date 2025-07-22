'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';

export default function TeamNameStep() {
  const { team, setTeamName, addNewPlayer, completeRegistration, setCurrentStep } = useAppStore();
  const [teamNameInput, setTeamNameInput] = useState(team.teamName || '');

  const handleCompleteRegistration = () => {
    setTeamName(teamNameInput);
    completeRegistration();
  };

  const handleAddMember = () => {
    setTeamName(teamNameInput);
    addNewPlayer();
    setCurrentStep('user-details');
  };

  const canAddMorePlayers = team.players.length < team.maxPlayers;

  return (
    <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={false}>
      <div className="space-y-8">
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
          <Label htmlFor="teamName" className="text-sm font-medium text-gray-700">
            Team Name
          </Label>
          <Input
            id="teamName"
            placeholder="Team XRC"
            value={teamNameInput}
            onChange={(e) => setTeamNameInput(e.target.value)}
            className="text-lg p-4 border-gray-300 text-center"
          />
        </div>

        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-lg text-gray-700 mb-2">
            現在：{team.players.length}/{team.maxPlayers}人が登録されています
          </p>
          <p className="text-base text-gray-600">
            Current: {team.players.length} out of {team.maxPlayers} players have been registered
          </p>
          
          {/* Player List */}
          {team.players.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 font-medium">Registered Players:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {team.players.map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-2 bg-white rounded-md px-3 py-1 border">
                    <div 
                      className={`w-4 h-4 rounded border border-white shadow-sm ${
                        player.color === 'red' ? 'bg-red-500' :
                        player.color === 'light-blue' ? 'bg-sky-400' :
                        player.color === 'yellow' ? 'bg-yellow-500' :
                        player.color === 'green' ? 'bg-green-500' :
                        player.color === 'purple' ? 'bg-purple-500' :
                        player.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                    ></div>
                    <span className="text-sm">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Complete Registration Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleCompleteRegistration}
              disabled={!teamNameInput.trim()}
              size="lg"
              className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-8 py-4 text-lg font-medium rounded-md transition-colors duration-200"
            >
              チーム登録を完了する / Complete Team Registration
            </Button>
          </div>

          {/* Add Member Button */}
          {canAddMorePlayers && (
            <div className="flex justify-center">
              <Button 
                onClick={handleAddMember}
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base font-medium rounded-md"
              >
                メンバーを追加 / Add member
              </Button>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500">
          <p>
            {canAddMorePlayers 
              ? `最大${team.maxPlayers}人まで追加できます / Up to ${team.maxPlayers} players can be added`
              : `最大人数に達しました / Maximum number of players reached`
            }
          </p>
        </div>
      </div>
    </StepLayout>
  );
}
