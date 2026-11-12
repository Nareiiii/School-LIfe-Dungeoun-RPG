export type CharacterRoleId = 'knight' | 'mage' | 'healer' | 'ranger';

export interface CharacterRole {
  id: CharacterRoleId;
  name: string;
  title: string;
  avatar: string;
  spriteUrl: string;
  hp: number;
  maxHp: number;
  status: string;
  specialTrait: string;
  color: string;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  hp: number;
  maxHp: number;
  level: number;
  avatar: string;
  spriteUrl: string;
  theme: string;
  distractionDebuffs: string[];
}

export interface MetacognitiveEntry {
  id: string;
  studentName: string;
  role: string;
  subject: string;
  topic: string;
  summary: string;
  comprehensionRating: number;
  damageDealt: number;
  timestamp: string;
}

export interface GuildLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  motto: string;
  membersCount: number;
  focusMinutes: number;
  bossesDefeated: number;
  checkpointsCompleted: number;
  shieldIntegrity: number;
  totalExp: number;
  level: number;
  badge: string;
  isCurrentParty?: boolean;
}

// Mode Penggunaan Platform
export type UsageMode = 'teacher_guided' | 'self_directed';

export type UserRole = 'student' | 'teacher';

export type ActiveTab =
  | 'mode_select'
  | 'portal'
  | 'guild_select'
  | 'lobby'
  | 'dungeon'
  | 'leaderboard'
  | 'journal';

export interface DistractionLog {
  id: string;
  heroId: CharacterRoleId;
  heroName: string;
  reason: string;
  timestamp: string;
}

// Online Room & Realtime State Interfaces
export interface RoomTimerState {
  isRunning: boolean;
  timeLeft: number;
  duration: number; // in minutes
  mode: 'focus' | 'break';
  sessionRound: number;
  lastUpdatedBy: 'teacher' | 'student';
  timestamp: number;
}

export interface GuildRoomData {
  guildId: string;
  guildName: string;
  classCode: string;
  shieldHp: number;
  maxShieldHp: number;
  bossHp: number;
  bossMaxHp: number;
  totalExp: number;
  focusMinutes: number;
  checkpointsCompleted: number;
  infractionsCount: number;
  characters: CharacterRole[];
  lastUpdated: number;
}

export interface TeacherActionPayload {
  type: 'appreciate' | 'reminder';
  message: string;
  expBonus?: number;
  timestamp: number;
}

export interface InfractionPayload {
  studentName: string;
  roleId: CharacterRoleId;
  guildId: string;
  guildName: string;
  reason: string;
  penaltyText: string;
  timestamp: string;
}

export type RoomSyncMessage =
  | { type: 'TIMER_SYNC'; payload: RoomTimerState }
  | { type: 'GUILD_UPDATE'; payload: GuildRoomData }
  | { type: 'TEACHER_ACTION'; payload: TeacherActionPayload }
  | { type: 'INFRACTION_EVENT'; payload: InfractionPayload }
  | { type: 'REQUEST_ROOM_STATE'; payload: { requesterId: string } }
  | { type: 'RESPONSE_ROOM_STATE'; payload: { timer: RoomTimerState; guilds: GuildRoomData[] } };
