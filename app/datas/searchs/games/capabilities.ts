import type { SearchFilterOption, SearchGameCapabilities, SearchGameId } from '../types'
import { buildEloOptions } from '../filters/options'

export const searchGameOptions: SearchFilterOption[] = [
  { label: 'Valorant', value: 'valorant', icon: 'simple-icons:valorant' },
  { label: 'League of Legends', value: 'league-of-legends', icon: 'simple-icons:leagueoflegends' },
  { label: 'Rocket League', value: 'rocket-league', icon: 'lucide:rocket' }
]

const valorantRanks: SearchFilterOption[] = [
  { label: 'Iron', value: 100 },
  { label: 'Bronze', value: 200 },
  { label: 'Silver', value: 300 },
  { label: 'Gold', value: 400 },
  { label: 'Platinum', value: 500 },
  { label: 'Diamond', value: 600 },
  { label: 'Ascendant', value: 700 },
  { label: 'Immortal', value: 800 },
  { label: 'Radiant', value: 900 }
]

const leagueOfLegendsRanks: SearchFilterOption[] = [
  { label: 'Iron', value: 100 },
  { label: 'Bronze', value: 200 },
  { label: 'Silver', value: 300 },
  { label: 'Gold', value: 400 },
  { label: 'Platinum', value: 500 },
  { label: 'Emerald', value: 600 },
  { label: 'Diamond', value: 700 },
  { label: 'Master', value: 800 },
  { label: 'Grandmaster', value: 900 },
  { label: 'Challenger', value: 1000 }
]

const rocketLeagueRanks: SearchFilterOption[] = [
  { label: 'Bronze', value: 100 },
  { label: 'Silver', value: 200 },
  { label: 'Gold', value: 300 },
  { label: 'Platinum', value: 400 },
  { label: 'Diamond', value: 500 },
  { label: 'Champion', value: 600 },
  { label: 'Grand Champion', value: 700 },
  { label: 'Supersonic Legend', value: 800 }
]

export const searchGameCapabilities: Record<SearchGameId, SearchGameCapabilities> = {
  valorant: {
    game: 'valorant',
    platforms: [
      { label: 'Windows', value: 'windows', icon: 'simple-icons:windows' }
    ],
    modes: [
      { label: 'Competitive', value: 'competitive' },
      { label: 'Premier', value: 'premier' }
    ],
    ranks: valorantRanks,
    elo: buildEloOptions(0, 3000, 100),
    positions: [
      { label: 'Duelist', value: 'duelist' },
      { label: 'Controller', value: 'controller' },
      { label: 'Initiator', value: 'initiator' },
      { label: 'Sentinel', value: 'sentinel' },
      { label: 'IGL', value: 'igl' },
      { label: 'Flex', value: 'flex' }
    ]
  },
  'league-of-legends': {
    game: 'league-of-legends',
    modes: [
      { label: 'Solo queue', value: 'solo-queue' },
      { label: 'Flex queue', value: 'flex-queue' },
      { label: 'Team ranked', value: 'team-ranked' }
    ],
    ranks: leagueOfLegendsRanks,
    positions: [
      { label: 'Top', value: 'top' },
      { label: 'Jungle', value: 'jungle' },
      { label: 'Mid', value: 'mid' },
      { label: 'ADC', value: 'adc' },
      { label: 'Support', value: 'support' }
    ]
  },
  'rocket-league': {
    game: 'rocket-league',
    platforms: [
      { label: 'Windows', value: 'windows', icon: 'simple-icons:windows' },
      { label: 'PlayStation', value: 'playstation', icon: 'simple-icons:playstation' },
      { label: 'Xbox', value: 'xbox', icon: 'simple-icons:xbox' },
      { label: 'Steam', value: 'steam', icon: 'simple-icons:steam' }
    ],
    modes: [
      { label: 'Duel', value: 'duel' },
      { label: 'Doubles', value: 'doubles' },
      { label: 'Standard', value: 'standard' }
    ],
    ranks: rocketLeagueRanks
  }
}
