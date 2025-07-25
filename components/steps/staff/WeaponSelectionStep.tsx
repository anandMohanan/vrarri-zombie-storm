// WeaponSelectionStep.tsx
'use client';

import StepLayout from '@/components/layout/StepLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStaffStore } from '@/lib/staff-store';

export default function WeaponSelectionStep() {
  const {
    currentTeam,
    selectedPlayer,
    setCurrentStep,
    updatePlayerWeapon,
    getAvailableWeapons,
  } = useStaffStore();

  if (!currentTeam || !selectedPlayer) return <div>Loading…</div>;

  const availableWeapons = getAvailableWeapons();
  const playersWithoutDualPistols = currentTeam.players.filter(
    (p) => p.selectedWeapon && p.selectedWeapon !== 'dual-pistols'
  ).length;

  const handleWeaponSelect = (weaponId: string) => {
    updatePlayerWeapon(selectedPlayer.id, weaponId as any);
    setCurrentStep('player-selection');
  };

  const handleBack = () => setCurrentStep('player-selection');

  const getPlayerColorClass = (color: string) => {
    const map: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    return map[color] ?? 'bg-gray-500';
  };

  const weaponImages: Record<string, string> = {
    'assault-rifle': '/assault_rifle_720.png',
    'submachine-gun': '/smg_720.png',
    'dual-pistols': '/pistol_double.png',
    shotgun: '/shotgun_720.png',
    'sniper-rifle': '/sniper_720.png',
  };

  return (
    <StepLayout staff showTeamNumber>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Team Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-x-4 sm:space-x-6">
                <span>
                  Team number:{' '}
                  <span className="font-bold">#{currentTeam.sessionCode}</span>
                </span>
                <span>
                  Team Name:{' '}
                  <span className="font-bold">{currentTeam.teamName}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded ${getPlayerColorClass(
                    selectedPlayer.color
                  )} border-2 border-white shadow-sm`}
                />
                <span
                  className={`px-3 py-1 text-sm font-medium text-white rounded ${getPlayerColorClass(
                    selectedPlayer.color
                  )}`}
                >
                  Player{' '}
                  {currentTeam.players.findIndex(
                    (p) => p.id === selectedPlayer.id
                  ) + 1}
                </span>
                <span className="font-medium">{selectedPlayer.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weapon Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Weapon Selection
              </h2>
              {playersWithoutDualPistols >= 5 && (
                <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ このプレイヤーは二丁拳銃のみ選択可能です（最大5名のストライカー制限のため）
                  </p>
                  <p className="text-yellow-700 text-xs">
                    This player can only select Dual Pistols (max 5 strikers per
                    team)
                  </p>
                </div>
              )}
            </div>

            {/* Weapons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {availableWeapons.map((weapon) => (
                <button
                  key={weapon.id}
                  onClick={() => handleWeaponSelect(weapon.id)}
                  disabled={weapon.currentCount === 0}
                  className={`
                    relative rounded-xl border-2 transition-all duration-200
                    flex flex-col items-center justify-center p-4 space-y-3
                    ${weapon.currentCount > 0
                      ? 'hover:border-blue-500 hover:scale-105 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed bg-gray-100'
                    }
                    ${weapon.isRequired && playersWithoutDualPistols >= 5
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                    }
                  `}
                >
                  {/* Count badge */}
                  <span className="absolute top-2 right-2 text-xs font-bold bg-blue-600 text-white rounded-full px-2 py-1">
                    {weapon.currentCount} / {weapon.maxCount}
                  </span>

                  {/* Image */}
                  <div className="w-40 h-40 flex items-center justify-center">
                    <img
                      src={weaponImages[weapon.id]}
                      alt={weapon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Labels */}
                  <div className="text-center">
                    <div className="font-semibold text-base">{weapon.name}</div>
                    <div className="text-sm text-gray-600">{weapon.nameJp}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Weapon Preview */}
            {selectedPlayer.selectedWeapon && (
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Currently Selected Weapon
                    </h3>
                    <div className="flex items-center justify-center space-x-4 bg-white rounded-lg p-6 border">
                      <div className="w-32 h-32 flex items-center justify-center">
                        <img
                          src={weaponImages[selectedPlayer.selectedWeapon]}
                          alt={
                            availableWeapons.find(
                              (w) => w.id === selectedPlayer.selectedWeapon
                            )?.name
                          }
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          {
                            availableWeapons.find(
                              (w) => w.id === selectedPlayer.selectedWeapon
                            )?.name
                          }
                        </div>
                        <div className="text-gray-600">
                          {
                            availableWeapons.find(
                              (w) => w.id === selectedPlayer.selectedWeapon
                            )?.nameJp
                          }
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleBack}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                    >
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
            Back
          </Button>
        </div>
      </div>
    </StepLayout>
  );
}
