import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Swords,
  Trophy,
  BookOpen,
  Volume2,
  VolumeX,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Home,
  GraduationCap,
  Users,
  Info,
  Radio,
  Lock,
} from 'lucide-react';
import {
  CharacterRole,
  Boss,
  MetacognitiveEntry,
  GuildLeaderboardEntry,
  ActiveTab,
  UserRole,
  UsageMode,
  DistractionLog,
} from './types/game';
import { sound } from './utils/audio';
import { roomSync } from './services/roomSync';
import { ModeSelection } from './components/ModeSelection';
import { PortalSelection } from './components/PortalSelection';
import { GuildSelection } from './components/GuildSelection';
import { RoleSelectionLobby } from './components/RoleSelectionLobby';
import { BossArena } from './components/BossArena';
import { TeacherLiveDashboard } from './components/TeacherLiveDashboard';
import { TeacherLeaderboard } from './components/TeacherLeaderboard';
import { ReturnWarningModal } from './components/ReturnWarningModal';
import { MetacognitiveModal } from './components/MetacognitiveModal';
import { MotivationModal } from './components/MotivationModal';
import { StudyJournalModal } from './components/StudyJournalModal';
import { VictoryModal } from './components/VictoryModal';
import { RaidOutcomeModal } from './components/RaidOutcomeModal';
import { PWAInstallButton } from './components/PWAInstallButton';

const INITIAL_CHARACTERS: CharacterRole[] = [
  {
    id: 'knight',
    name: 'Bima (Knight)',
    title: 'Penjaga Ritme Belajar',
    avatar: '🛡️',
    spriteUrl: '/sprites/knight.svg',
    hp: 100,
    maxHp: 100,
    status: 'Fokus Penuh Membaca Modul',
    specialTrait: 'Pelindung Perisai Tim',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'mage',
    name: 'Citra (Mage)',
    title: 'Penyusun Rangkuman Materi',
    avatar: '🔮',
    spriteUrl: '/sprites/mage.svg',
    hp: 80,
    maxHp: 100,
    status: 'Menyiapkan Metacognitive Checkpoint',
    specialTrait: 'Pemicu Serangan Mantra Materi',
    color: 'from-purple-600 to-indigo-800',
  },
  {
    id: 'healer',
    name: 'Dewi (Healer)',
    title: 'Pembangkit Semangat Tim',
    avatar: '🌿',
    spriteUrl: '/sprites/healer.svg',
    hp: 100,
    maxHp: 100,
    status: 'Siaga Mendukung Kawan',
    specialTrait: 'Pemulih HP & Perisai Rekan',
    color: 'from-teal-600 to-emerald-700',
  },
  {
    id: 'ranger',
    name: 'Faris (Ranger)',
    title: 'Pengintai Ritme & Durasi',
    avatar: '🏹',
    spriteUrl: '/sprites/ranger.svg',
    hp: 100,
    maxHp: 100,
    status: 'Pengali EXP 1.5x Aktif',
    specialTrait: 'Pengendali Durasi Pertempuran',
    color: 'from-amber-600 to-yellow-600',
  },
];

const INITIAL_BOSS: Boss = {
  id: 'boss-prokrastinasi',
  name: 'Lord Prokrastinasi & Doomscroll',
  title: 'Raja Kegelapan Distraksi Digital',
  subtitle: 'Kalahkan dengan Rangkuman Materi & Fokus Kelompok!',
  hp: 7500,
  maxHp: 10000,
  level: 5,
  avatar: '🐉',
  spriteUrl: '/sprites/boss-demon.svg',
  theme: 'crimson',
  distractionDebuffs: ['Notifikasi Medsos', 'Hasrat Membuka Game', 'Melamun / Hilang Fokus'],
};

const INITIAL_JOURNAL: MetacognitiveEntry[] = [
  {
    id: 'journal-1',
    studentName: 'Citra (Mage)',
    role: 'mage',
    subject: 'Biologi Sel',
    topic: 'Respirasi Aerob & Siklus Krebs',
    summary:
      'Glikolisis di sitoplasma menghasilkan 2 ATP, siklus Krebs di matriks mitokondria menghasilkan NADH & FADH2, yang memicu sintesis 34 ATP di krista mitokondria.',
    comprehensionRating: 5,
    damageDealt: 1350,
    timestamp: '08:55 WIB',
  },
];

const INITIAL_GUILDS: GuildLeaderboardEntry[] = [
  {
    id: 'guild-garuda',
    rank: 1,
    name: 'Guild Garuda',
    motto: 'Belajar Keras, Perisai Baja, Nilai Sempurna',
    membersCount: 4,
    focusMinutes: 175,
    bossesDefeated: 3,
    checkpointsCompleted: 7,
    shieldIntegrity: 90,
    totalExp: 4850,
    level: 6,
    badge: '🦅',
    isCurrentParty: true,
  },
  {
    id: 'guild-harimau',
    rank: 2,
    name: 'Guild Harimau',
    motto: 'Terjang Soal Sulit Tanpa Ragu',
    membersCount: 4,
    focusMinutes: 150,
    bossesDefeated: 2,
    checkpointsCompleted: 6,
    shieldIntegrity: 82,
    totalExp: 4200,
    level: 5,
    badge: '🐯',
  },
  {
    id: 'guild-rajawali',
    rank: 3,
    name: 'Guild Rajawali',
    motto: 'Terbang Tinggi Menggapai Pemahaman',
    membersCount: 4,
    focusMinutes: 125,
    bossesDefeated: 2,
    checkpointsCompleted: 5,
    shieldIntegrity: 78,
    totalExp: 3600,
    level: 4,
    badge: '🦅',
  },
];

const INITIAL_DISTRACTION_LOGS: DistractionLog[] = [
  {
    id: 'log-1',
    heroId: 'mage',
    heroName: 'Citra (Mage)',
    reason: 'Buka Sosmed / Notifikasi Instagram',
    timestamp: '08:42 WIB',
  },
  {
    id: 'log-2',
    heroId: 'ranger',
    heroName: 'Faris (Ranger)',
    reason: 'Pindah Aplikasi / Buka Game',
    timestamp: '08:50 WIB',
  },
];

const getRoleTitleShort = (id: string): string => {
  switch (id) {
    case 'knight':
      return 'Knight';
    case 'mage':
      return 'Mage';
    case 'healer':
      return 'Healer';
    case 'ranger':
      return 'Ranger';
    default:
      return id;
  }
};

export default function App() {
  // 1. MODE PENGGUNAAN PLATFORM (HIT-STOP AWAL: Mode A vs Mode B)
  const [usageMode, setUsageMode] = useState<UsageMode>('teacher_guided');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('mode_select');

  // Room & Identity State
  const [classCode, setClassCode] = useState<string>('XI-MIPA-1');
  const [guildName, setGuildName] = useState<string>('Guild Garuda');
  const [playerName, setPlayerName] = useState<string>('Bima');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('knight');
  const [sessionDuration, setSessionDuration] = useState<number>(25); // Default 25 Menit

  // App-Restriction Engine (Deteksi Pindah Aplikasi / Tab)
  const [infractionCount, setInfractionCount] = useState<number>(0);
  const [isReturnWarningOpen, setIsReturnWarningOpen] = useState<boolean>(false);
  const [returnPenaltyType, setReturnPenaltyType] = useState<'hp' | 'shield' | 'both'>('hp');
  const hasPendingReturnWarningRef = useRef<boolean>(false);
  const lastInfractionTimeRef = useRef<number>(0);

  // Modals
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(false);
  const [isMotivationOpen, setIsMotivationOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isRaidOutcomeOpen, setIsRaidOutcomeOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Audio Mute
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // RPG Combat & Bars State
  const [boss, setBoss] = useState<Boss>(INITIAL_BOSS);
  const [shieldHp, setShieldHp] = useState<number>(900); // 90% of 1000 max
  const maxShieldHp = 1000;
  const [characters, setCharacters] = useState<CharacterRole[]>(INITIAL_CHARACTERS);
  const [guilds, setGuilds] = useState<GuildLeaderboardEntry[]>(INITIAL_GUILDS);
  const [journalEntries, setJournalEntries] = useState<MetacognitiveEntry[]>(INITIAL_JOURNAL);
  const [distractionLogs, setDistractionLogs] = useState<DistractionLog[]>(INITIAL_DISTRACTION_LOGS);

  // Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [sessionRound, setSessionRound] = useState<number>(1);
  const [streakCount, setStreakCount] = useState<number>(3);
  const [expMultiplier, setExpMultiplier] = useState<number>(1.5);

  // Visual Combat Effects
  const [isBossHit, setIsBossHit] = useState(false);
  const [slashActive, setSlashActive] = useState(false);
  const [floatingDamages, setFloatingDamages] = useState<Array<{ id: string; text: string; isCrit?: boolean; isShield?: boolean }>>([]);
  const [alertNotification, setAlertNotification] = useState<{ type: 'violation' | 'motivation' | 'tip'; message: string } | null>(null);

  // Active Skill States for Knight & Ranger
  const [isShieldWallActive, setIsShieldWallActive] = useState(false);
  const [shieldWallTimer, setShieldWallTimer] = useState(0);
  const [shieldWallShimmer, setShieldWallShimmer] = useState(false);

  const [isEagleEyeActive, setIsEagleEyeActive] = useState(false);
  const [eagleEyeTimer, setEagleEyeTimer] = useState(0);
  const [arrowStrikeActive, setArrowStrikeActive] = useState(false);

  // Boss Attack on Violation Animation States
  const [isBossAttacking, setIsBossAttacking] = useState(false);
  const [bossAttackTarget, setBossAttackTarget] = useState<string | null>(null);
  const [darkProjectileActive, setDarkProjectileActive] = useState(false);
  const [heroHitTarget, setHeroHitTarget] = useState<string | null>(null);
  const [heroFloatingText, setHeroFloatingText] = useState<{ [key: string]: string | null }>({});

  // Dynamic Party Naming (Chosen role takes playerName, other 3 take Bima, Citra, Dewi, Faris)
  useEffect(() => {
    const cleanName = playerName.trim() || 'Pemain';
    const defaultRoleNames: { [key: string]: string } = {
      knight: 'Bima',
      mage: 'Citra',
      healer: 'Dewi',
      ranger: 'Faris',
    };

    setCharacters((prev) =>
      prev.map((char) => {
        let displayName = '';
        if (char.id === selectedRoleId) {
          displayName = `${cleanName} (${getRoleTitleShort(char.id)})`;
        } else {
          const defaultName = defaultRoleNames[char.id] || 'Rekan';
          displayName = `${defaultName} (${getRoleTitleShort(char.id)})`;
        }
        return {
          ...char,
          name: displayName,
        };
      })
    );
  }, [playerName, selectedRoleId]);

  // Sync guildName into guilds state for currentParty so Leaderboard updates automatically
  useEffect(() => {
    const trimmed = guildName.trim() || 'Guild Garuda';
    setGuilds((prev) =>
      prev.map((g) => (g.isCurrentParty ? { ...g, name: trimmed } : g))
    );
  }, [guildName]);

  // Dedicated Active Skill Countdown Timer (every 1 second)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setShieldWallTimer((prev) => {
        if (prev <= 1) {
          setIsShieldWallActive(false);
          return 0;
        }
        return prev - 1;
      });

      setEagleEyeTimer((prev) => {
        if (prev <= 1) {
          setIsEagleEyeActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Trigger floating damage text
  const addFloatingDamage = (text: string, isCrit = false, isShield = false) => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingDamages((prev) => [...prev, { id, text, isCrit, isShield }]);
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1200);
  };

  // ========================================================
  // REAL-TIME ONLINE ROOM ENGINE (BroadcastChannel + LocalStorage)
  // ========================================================
  useEffect(() => {
    if (!classCode) return;

    roomSync.init(classCode, (msg) => {
      if (msg.type === 'TIMER_SYNC') {
        // If student in Mode A (Teacher-guided), sync master timer from Guru!
        if (userRole === 'student' && usageMode === 'teacher_guided') {
          setTimeLeft(msg.payload.timeLeft);
          setIsRunning(msg.payload.isRunning);
          setSessionDuration(msg.payload.duration);
          setTimerMode(msg.payload.mode);
          setSessionRound(msg.payload.sessionRound);
        }
      } else if (msg.type === 'TEACHER_ACTION') {
        if (msg.payload.type === 'appreciate') {
          sound.playTeacherAppreciation();
          setGuilds((prev) =>
            prev.map((g) => ({
              ...g,
              totalExp: g.totalExp + (msg.payload.expBonus || 500),
              shieldIntegrity: Math.min(100, g.shieldIntegrity + 10),
            }))
          );
          setShieldHp((prev) => Math.min(maxShieldHp, prev + 100));
          addFloatingDamage('🏆 +500 EXP (Apresiasi Guru)!', true, true);
          setAlertNotification({
            type: 'motivation',
            message: `🏆 APRESIASI GURU: "${msg.payload.message}" (+500 EXP & +10% Perisai Tim)`,
          });
        } else if (msg.payload.type === 'reminder') {
          sound.playClick();
          setAlertNotification({
            type: 'tip',
            message: `📢 PENGINGAT GURU: "${msg.payload.message}"`,
          });
        }
      } else if (msg.type === 'INFRACTION_EVENT') {
        const newLog: DistractionLog = {
          id: `log-net-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          heroId: msg.payload.roleId,
          heroName: `${msg.payload.studentName} (${msg.payload.guildName})`,
          reason: `${msg.payload.reason} [${msg.payload.penaltyText}]`,
          timestamp: msg.payload.timestamp,
        };
        setDistractionLogs((prev) => [newLog, ...prev]);
      }
    });

    return () => {
      roomSync.cleanup();
    };
  }, [classCode, userRole, usageMode]);

  // Teacher Helper to Broadcast Master Timer updates to students
  const broadcastTimerToStudents = (
    running: boolean,
    time: number,
    dur: number,
    mode: 'focus' | 'break',
    round: number
  ) => {
    if (userRole === 'teacher' && usageMode === 'teacher_guided') {
      roomSync.syncTimer({
        isRunning: running,
        timeLeft: time,
        duration: dur,
        mode: mode,
        sessionRound: round,
        lastUpdatedBy: 'teacher',
        timestamp: Date.now(),
      });
    }
  };

  // ========================================================
  // DETEKSI OTOMATIS: PAGE VISIBILITY API & BLUR EVENT
  // (App-Restriction Engine)
  // ========================================================
  useEffect(() => {
    const triggerBackgroundPenalty = () => {
      // Hanya aktif saat berada di layar arena dungeon dan sesi sedang berjalan (running)
      if (activeTab !== 'dungeon' || !isRunning) return;

      const now = Date.now();
      if (now - lastInfractionTimeRef.current < 3500) return; // cooldown 3.5 detik
      lastInfractionTimeRef.current = now;

      // Ambil hero pemain terpilih
      const currentHero = characters.find((c) => c.id === selectedRoleId);
      const heroHp = currentHero ? currentHero.hp : 100;

      let penalty: 'hp' | 'shield' = 'hp';
      let penaltyDescription = '';

      if (heroHp > 0) {
        // Aturan 1: Potong HP individu Hero pemain sebesar -20%
        penalty = 'hp';
        penaltyDescription = '-20% HP Karakter';

        setCharacters((prev) =>
          prev.map((c) =>
            c.id === selectedRoleId
              ? {
                  ...c,
                  hp: Math.max(0, c.hp - 20),
                  status: '⚠️ Diserang Boss (-20% HP): Deteksi Pindah Aplikasi / Tab',
                }
              : c
          )
        );
        addFloatingDamage('-20% HP (Pindah Aplikasi)!', false, false);
      } else {
        // Aturan 2: Jika HP individu Hero sudah 0%, penalti otomatis mengikis Team Shield sebesar -15%
        penalty = 'shield';
        penaltyDescription = '-15% Perisai Tim (HP Hero 0%)';

        setShieldHp((prev) => Math.max(0, prev - 150));
        setGuilds((prev) =>
          prev.map((g) => (g.isCurrentParty ? { ...g, shieldIntegrity: Math.max(0, g.shieldIntegrity - 15) } : g))
        );
        addFloatingDamage('-15% Team Shield!', false, true);
      }

      // Aturan 3: Simpan jumlah riwayat pelanggaran (Infraction Count)
      setInfractionCount((prev) => prev + 1);

      const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      const newLog: DistractionLog = {
        id: `log-auto-${Date.now()}`,
        heroId: selectedRoleId as any,
        heroName: currentHero?.name || playerName,
        reason: `Pindah Aplikasi / Keluar Tab (Deteksi Otomatis: ${penaltyDescription})`,
        timestamp,
      };
      setDistractionLogs((prev) => [newLog, ...prev]);

      // Broadcast ke Guru via roomSync
      roomSync.sendInfraction({
        studentName: currentHero?.name || playerName,
        roleId: selectedRoleId as any,
        guildId: 'current-guild',
        guildName: guildName,
        reason: 'Pindah Aplikasi / Keluar Tab (Deteksi Otomatis)',
        penaltyText: penaltyDescription,
        timestamp,
      });

      setReturnPenaltyType(penalty);
      hasPendingReturnWarningRef.current = true;
    };

    const handleReturnToGame = () => {
      if (hasPendingReturnWarningRef.current) {
        hasPendingReturnWarningRef.current = false;
        sound.playMonsterAttack();
        setIsReturnWarningOpen(true);

        // Visual serangan boss
        setIsBossAttacking(true);
        setDarkProjectileActive(true);
        setTimeout(() => {
          setIsBossAttacking(false);
          setDarkProjectileActive(false);
        }, 900);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerBackgroundPenalty();
      } else {
        handleReturnToGame();
      }
    };

    const handleBlur = () => {
      triggerBackgroundPenalty();
    };

    const handleFocus = () => {
      handleReturnToGame();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeTab, isRunning, characters, selectedRoleId, playerName, guildName]);

  // Pomodoro Timer Tick Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          // Mid-point prompt at exactly 50% duration if in focus mode
          const midPoint = Math.floor((sessionDuration * 60) / 2);
          if (prev === midPoint && timerMode === 'focus') {
            sound.playMagicSpell();
            setIsCheckpointOpen(true);
            setAlertNotification({
              type: 'tip',
              message: `🔔 Pertengahan sesi tercapai (${Math.floor(midPoint / 60)}:00)! Waktunya Metacognitive Checkpoint.`,
            });
          }

          // In Mode A Teacher tab, occasionally broadcast timer
          if (userRole === 'teacher' && usageMode === 'teacher_guided' && prev % 5 === 0) {
            broadcastTimerToStudents(true, prev - 1, sessionDuration, timerMode, sessionRound);
          }

          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, timerMode, sessionDuration, userRole, usageMode, sessionRound]);

  // Handle natural timer expiration
  const handleTimerComplete = () => {
    setIsRunning(false);
    sound.stopBGM();
    broadcastTimerToStudents(false, 0, sessionDuration, timerMode, sessionRound);

    if (timerMode === 'focus') {
      setGuilds((prev) =>
        prev.map((g) =>
          g.isCurrentParty ? { ...g, focusMinutes: g.focusMinutes + sessionDuration, totalExp: g.totalExp + 250 } : g
        )
      );
      setIsRaidOutcomeOpen(true);
    } else {
      sound.playHeal();
      setAlertNotification({
        type: 'motivation',
        message: '☕ Waktu istirahat selesai! Bersiap kembali ke medan fokus.',
      });
      setTimeLeft(sessionDuration * 60);
      setTimerMode('focus');
      setSessionRound((prev) => prev + 1);
    }
  };

  // Fast-Forward Timer
  const handleFastForwardTimer = () => {
    sound.playClick();
    setIsRunning(false);
    sound.stopBGM();
    setTimeLeft(0);
    broadcastTimerToStudents(false, 0, sessionDuration, timerMode, sessionRound);
    setIsRaidOutcomeOpen(true);
  };

  // Reset to Lobby from Outcome Modal
  const handleResetToLobby = () => {
    setIsRaidOutcomeOpen(false);
    setIsRunning(false);
    sound.stopBGM();
    sound.startLobbyBGM();
    setActiveTab('lobby');
    setShieldHp(maxShieldHp);
    setTimeLeft(sessionDuration * 60);
    broadcastTimerToStudents(false, sessionDuration * 60, sessionDuration, 'focus', sessionRound);

    setCharacters((prev) =>
      prev.map((c) => ({
        ...c,
        hp: c.maxHp,
        status: 'Fokus Penuh Bersiap Masuk Dungeon',
      }))
    );
    setAlertNotification({
      type: 'motivation',
      message: '🏠 Kembali ke Lobby! Kamu dapat mengubah nama dan memilih peran tim untuk sesi baru.',
    });
  };

  // Selection handlers
  const handleSelectUsageMode = (mode: UsageMode) => {
    setUsageMode(mode);
    if (mode === 'teacher_guided') {
      setActiveTab('portal');
    } else {
      // Mode B: Mandiri Tanpa Guru
      setUserRole('student');
      setClassCode('MANDIRI');
      setActiveTab('lobby');
      sound.stopBGM();
      sound.startLobbyBGM();
    }
  };

  const handleSelectPortalRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') {
      // Siswa: masuk ke halaman pilih atau buat Guild
      setActiveTab('guild_select');
      sound.stopBGM();
      sound.startLobbyBGM();
    } else {
      // Guru: langsung masuk ke Teacher Live Dashboard
      setActiveTab('dungeon');
      sound.stopBGM();
      sound.startBattleBGM();
    }
  };

  const handleCreateGuild = (newGuildName: string, motto: string) => {
    setGuildName(newGuildName);
    const newGuildEntry: GuildLeaderboardEntry = {
      id: `guild-${Date.now()}`,
      rank: guilds.length + 1,
      name: newGuildName,
      motto,
      membersCount: 4,
      focusMinutes: 0,
      bossesDefeated: 0,
      checkpointsCompleted: 0,
      shieldIntegrity: 100,
      totalExp: 1000,
      level: 1,
      badge: '🛡️',
      isCurrentParty: true,
    };
    setGuilds((prev) => [newGuildEntry, ...prev.map((g) => ({ ...g, isCurrentParty: false }))]);
    setActiveTab('lobby');
  };

  const handleStartRaid = () => {
    sound.playClick();
    sound.stopBGM();
    sound.startBattleBGM();
    setActiveTab('dungeon');
    setIsRunning(true);
    setTimeLeft(sessionDuration * 60);

    // If teacher started raid, broadcast
    if (userRole === 'teacher') {
      broadcastTimerToStudents(true, sessionDuration * 60, sessionDuration, 'focus', sessionRound);
    }

    setAlertNotification({
      type: 'motivation',
      message: `⚔️ Pertempuran Dimulai! Sesi Pomodoro ${sessionDuration} Menit aktif. Pertahankan perisai tim!`,
    });
  };

  const handleToggleTimer = () => {
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        sound.startBattleBGM();
      } else {
        sound.stopBGM();
      }
      broadcastTimerToStudents(next, timeLeft, sessionDuration, timerMode, sessionRound);
      return next;
    });
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    sound.stopBGM();
    const resetTime = sessionDuration * 60;
    setTimeLeft(resetTime);
    broadcastTimerToStudents(false, resetTime, sessionDuration, timerMode, sessionRound);
  };

  const handleSetTimerDuration = (secondsOrMinutes: number, mode?: 'focus' | 'break') => {
    setIsRunning(false);
    sound.stopBGM();
    // Support both seconds or minutes
    const durMinutes = secondsOrMinutes > 60 ? Math.floor(secondsOrMinutes / 60) : secondsOrMinutes;
    setSessionDuration(durMinutes);
    if (mode) setTimerMode(mode);
    const newSeconds = durMinutes * 60;
    setTimeLeft(newSeconds);
    broadcastTimerToStudents(false, newSeconds, durMinutes, mode || timerMode, sessionRound);
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      if (activeTab === 'lobby' || activeTab === 'guild_select') {
        sound.startLobbyBGM();
      } else if (activeTab === 'dungeon') {
        sound.startBattleBGM();
      }
    }
  };

  const handleSessionDurationChange = (dur: number) => {
    setSessionDuration(dur);
    setTimeLeft(dur * 60);
    broadcastTimerToStudents(isRunning, dur * 60, dur, timerMode, sessionRound);
  };

  // ========================================================
  // COMBAT SKILLS
  // ========================================================
  const handleKnightShieldWall = () => {
    sound.playShieldDeflect();
    setIsShieldWallActive(true);
    setShieldWallTimer(5 * 60);
    setShieldWallShimmer(true);
    setTimeout(() => setShieldWallShimmer(false), 1600);

    setShieldHp((prev) => Math.min(maxShieldHp, prev + 100));
    addFloatingDamage('+10% Shield Wall!', false, true);

    setCharacters((prev) =>
      prev.map((c) =>
        c.id === 'knight'
          ? { ...c, status: '🛡️ Mengaktifkan Benteng Pelindung (Menyerap Penalti 5m)' }
          : c
      )
    );

    setAlertNotification({
      type: 'motivation',
      message: 'Knight mengaktifkan Benteng Pelindung! Penalti tim diserap Knight selama 5 menit.',
    });
  };

  const executeViolation = (roleId: string, roleName: string, violationReason: string) => {
    setInfractionCount((prev) => prev + 1);

    const newLog: DistractionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      heroId: roleId as any,
      heroName: roleName,
      reason: violationReason,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setDistractionLogs((prev) => [newLog, ...prev]);

    // Broadcast ke ruang kelas
    roomSync.sendInfraction({
      studentName: roleName,
      roleId: roleId as any,
      guildId: 'current-guild',
      guildName,
      reason: violationReason,
      penaltyText: isShieldWallActive ? 'Diserap Benteng' : '-25% HP & -15% Shield',
      timestamp: newLog.timestamp,
    });

    if (isShieldWallActive) {
      sound.playShieldDeflect();
      addFloatingDamage('🛡️ Diserap Benteng!', false, true);
      setAlertNotification({
        type: 'motivation',
        message: `🛡️ BENTENG PELINDUNG EFEKTIF! Pelanggaran ${roleName} (${violationReason}) berhasil ditangkis!`,
      });
      return;
    }

    sound.playMonsterAttack();
    setIsBossAttacking(true);
    setBossAttackTarget(roleId);
    setDarkProjectileActive(true);

    setTimeout(() => {
      setHeroHitTarget(roleId);
      setHeroFloatingText((prev) => ({ ...prev, [roleId]: '-25% HP! & -15% Shield!' }));
      setShieldHp((prev) => Math.max(0, prev - 150));

      setCharacters((prev) =>
        prev.map((c) =>
          c.id === roleId
            ? {
                ...c,
                hp: Math.max(0, c.hp - 25),
                status: `⚠️ Diserang Boss (-25% HP): ${violationReason}`,
              }
            : c
        )
      );

      addFloatingDamage(`-15% SP & -25% HP (${roleName})!`, false, true);

      setGuilds((prev) =>
        prev.map((g) => (g.isCurrentParty ? { ...g, shieldIntegrity: Math.max(0, g.shieldIntegrity - 15) } : g))
      );
    }, 260);

    setTimeout(() => {
      setIsBossAttacking(false);
      setBossAttackTarget(null);
      setDarkProjectileActive(false);
      setHeroHitTarget(null);
    }, 900);

    setTimeout(() => {
      setHeroFloatingText((prev) => ({ ...prev, [roleId]: null }));
    }, 1800);

    setAlertNotification({
      type: 'violation',
      message: `⚠️ SIMULASI MELANGGAR: ${roleName} (${violationReason})! Boss menyerang: -15% Perisai Tim & -25% HP!`,
    });
  };

  const handleKnightDistract = () => executeViolation('knight', 'Knight', 'HP Tergeser / Melamun');
  const handleMageDistract = () => executeViolation('mage', 'Mage', 'Buka Sosmed / Notifikasi Instagram');
  const handleHealerDistract = () => executeViolation('healer', 'Healer', 'Tinggalkan Layar / Meja Belajar');
  const handleRangerDistract = () => executeViolation('ranger', 'Ranger', 'Pindah Aplikasi / Buka Game');

  const handleMageCheckpoint = () => {
    sound.playMagicSpell();
    setIsCheckpointOpen(true);
  };

  const handleCheckpointSubmit = (data: {
    subject: string;
    topic: string;
    summary: string;
    comprehensionRating: number;
  }) => {
    setIsCheckpointOpen(false);
    const baseDamage = 850 + data.summary.length * 10 + data.comprehensionRating * 120;
    const finalDamage = Math.round(baseDamage * expMultiplier);

    sound.playExplosion();
    setIsBossHit(true);
    setSlashActive(true);
    addFloatingDamage(`-${finalDamage.toLocaleString()} 💥 CRITICAL!`, true);

    setTimeout(() => setIsBossHit(false), 500);
    setTimeout(() => setSlashActive(false), 450);

    setBoss((prev) => {
      const nextHp = Math.max(0, prev.hp - finalDamage);
      if (nextHp <= 0) setTimeout(() => setIsVictoryOpen(true), 600);
      return { ...prev, hp: nextHp };
    });

    const newEntry: MetacognitiveEntry = {
      id: `journal-${Date.now()}`,
      studentName: `${characters.find((c) => c.id === selectedRoleId)?.name || 'Citra (Mage)'}`,
      role: selectedRoleId,
      subject: data.subject,
      topic: data.topic,
      summary: data.summary,
      comprehensionRating: data.comprehensionRating,
      damageDealt: finalDamage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setJournalEntries((prev) => [newEntry, ...prev]);

    setGuilds((prev) =>
      prev.map((g) =>
        g.isCurrentParty
          ? {
              ...g,
              checkpointsCompleted: g.checkpointsCompleted + 1,
              totalExp: g.totalExp + Math.round(finalDamage / 2),
            }
          : g
      )
    );

    setAlertNotification({
      type: 'motivation',
      message: `⚡ Hantaman Mantra Berhasil! Boss terkena -${finalDamage.toLocaleString()} DMG dari Rangkuman "${data.topic}"!`,
    });
  };

  const handleHealerMotivate = () => {
    sound.playHeal();
    setIsMotivationOpen(true);
  };

  const handleSendMotivation = (message: string) => {
    sound.playHeal();
    setCharacters((prev) =>
      prev.map((c) => ({ ...c, hp: Math.min(c.maxHp, c.hp + 35), status: 'Semangat Penuh dari Healer!' }))
    );

    setShieldHp((prev) => Math.min(maxShieldHp, prev + 150));
    addFloatingDamage('+15% Shield & +HP Kawan!', false, true);

    setAlertNotification({
      type: 'motivation',
      message: `💌 Pesan Penyemangat Terkirim: "${message}" (HP Kawan Pulih & +15% Perisai Tim)!`,
    });
  };

  const handleRangerEagleEye = () => {
    sound.playArrowShot();
    setIsEagleEyeActive(true);
    setEagleEyeTimer(5 * 60);
    setArrowStrikeActive(true);
    setIsBossHit(true);

    setTimeout(() => {
      setArrowStrikeActive(false);
      setIsBossHit(false);
    }, 1200);

    const eagleDamage = 1500;
    addFloatingDamage(`-${eagleDamage.toLocaleString()} 🏹 EAGLE EYE!`, true);

    setBoss((prev) => {
      const nextHp = Math.max(0, prev.hp - eagleDamage);
      if (nextHp <= 0) setTimeout(() => setIsVictoryOpen(true), 600);
      return { ...prev, hp: nextHp };
    });

    setCharacters((prev) =>
      prev.map((c) =>
        c.id === 'ranger'
          ? { ...c, status: '🏹 Radar Fokus Terkunci! Mode Focus Combo 5 Menit Aktif' }
          : c
      )
    );

    setAlertNotification({
      type: 'motivation',
      message: 'Ranger mengaktifkan Radar Fokus (Eagle Eye)! Menghantam Boss -1.500 HP dan memicu Focus Combo 5 Menit!',
    });
  };

  const handleTeacherAppreciate = () => {
    sound.playTeacherAppreciation();
    setGuilds((prev) =>
      prev.map((g) => ({
        ...g,
        totalExp: g.totalExp + 500,
        shieldIntegrity: Math.min(100, g.shieldIntegrity + 10),
      }))
    );
    setShieldHp((prev) => Math.min(maxShieldHp, prev + 100));
    addFloatingDamage('🏆 +500 EXP (Apresiasi Guru)!', true, true);

    // Broadcast ke seluruh murid
    roomSync.sendTeacherAction({
      type: 'appreciate',
      message: 'Kerja sama fokus kalian sangat luar biasa hari ini!',
      expBonus: 500,
      timestamp: Date.now(),
    });

    setAlertNotification({
      type: 'motivation',
      message: '🏆 Apresiasi Guru Berhasil Dikirim ke Seluruh Murid! (+500 EXP & +10% Perisai Tim)',
    });
  };

  const handleTeacherReminder = () => {
    sound.playClick();
    roomSync.sendTeacherAction({
      type: 'reminder',
      message: 'Tetap konsisten dan pertahankan ritme belajar. Saling ingatkan kawan satu tim!',
      timestamp: Date.now(),
    });
    setAlertNotification({
      type: 'tip',
      message: '📢 Pengingat Guru Berhasil Disiarkan ke Layar Seluruh Murid!',
    });
  };

  const handleNextBoss = () => {
    setIsVictoryOpen(false);
    sound.playVictory();
    setBoss({
      id: `boss-level-${boss.level + 1}`,
      name: 'Arch-Demon Distraksi & Doomscroll',
      title: 'Tuan Penguasa Notifikasi Tingkat Lanjut',
      subtitle: 'Memerlukan rangkuman materi lebih mendalam',
      hp: 12000,
      maxHp: 12000,
      level: boss.level + 1,
      avatar: '👿',
      spriteUrl: '/sprites/boss-demon.svg',
      theme: 'purple',
      distractionDebuffs: ['Gelombang FYP', 'Aura Multitasking Palsu', 'Pemberitahuan Mendesak'],
    });
    setShieldHp(maxShieldHp);
    setStreakCount((prev) => prev + 1);
    setExpMultiplier((prev) => Number((prev + 0.1).toFixed(1)));
    setGuilds((prev) =>
      prev.map((g) => (g.isCurrentParty ? { ...g, bossesDefeated: g.bossesDefeated + 1, level: g.level + 1 } : g))
    );
  };

  const handleAwardBonusExp = () => {
    setGuilds((prev) =>
      prev.map((g) => ({
        ...g,
        totalExp: g.totalExp + 300,
      }))
    );
  };

  // ========================================================
  // RENDER SCREEN 0: HIT-STOP AWAL SELEKSI MODE PENGGUNAAN
  // ========================================================
  if (activeTab === 'mode_select') {
    return <ModeSelection onSelectMode={handleSelectUsageMode} />;
  }

  // ========================================================
  // RENDER SCREEN 1: PORTAL GURU VS SISWA (MODE A)
  // ========================================================
  if (activeTab === 'portal' || (!userRole && usageMode === 'teacher_guided')) {
    return (
      <PortalSelection
        roomCode={classCode}
        onChangeRoomCode={setClassCode}
        onSelectRole={handleSelectPortalRole}
        onBackToModeSelect={() => setActiveTab('mode_select')}
      />
    );
  }

  // ========================================================
  // RENDER SCREEN 1.5: GUILD SELECTION (SISWA DALAM MODE A)
  // ========================================================
  if (activeTab === 'guild_select' && usageMode === 'teacher_guided') {
    return (
      <GuildSelection
        roomCode={classCode}
        guilds={guilds}
        selectedGuildName={guildName}
        onSelectGuild={setGuildName}
        onCreateGuild={handleCreateGuild}
        onContinue={() => setActiveTab('lobby')}
        onBack={() => setActiveTab('portal')}
      />
    );
  }

  // ========================================================
  // MAIN APP SHELL
  // ========================================================
  return (
    <div className="h-[100dvh] w-full bg-[#080D1A] text-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* GLOBAL COMPACT NAVIGATION BAR */}
      <nav className="shrink-0 bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-5 py-1.5 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Brand Logo & Portal Switcher */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                sound.playClick();
                if (userRole === 'student') {
                  sound.stopBGM();
                  sound.startLobbyBGM();
                  setActiveTab('lobby');
                } else {
                  setActiveTab('dungeon');
                }
              }}
              title="Kembali ke Layar Utama"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md border border-teal-400/40 shrink-0">
                <Swords className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-rpg font-bold text-xs sm:text-sm text-white tracking-wide leading-none block">
                  School-Life RPG
                </span>
                <span className="text-[9px] text-teal-400 hidden xs:inline leading-none font-semibold">
                  Co-op Study Dungeon
                </span>
              </div>
            </div>

            {/* Mode & Room Indicator Tag */}
            <button
              onClick={() => {
                sound.playClick();
                sound.stopBGM();
                setActiveTab('mode_select');
                setUserRole(null);
              }}
              className="ml-1 sm:ml-2 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 text-[10px] font-bold text-slate-300 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
              title="Ganti Mode Penggunaan Platform"
            >
              {usageMode === 'teacher_guided' ? (
                <>
                  <GraduationCap className="w-3 h-3 text-indigo-400" />
                  <span className="text-indigo-300 font-pixel">
                    {userRole === 'teacher' ? 'GURU' : 'SISWA'} [{classCode}]
                  </span>
                </>
              ) : (
                <>
                  <Users className="w-3 h-3 text-teal-400" />
                  <span className="text-teal-300 font-pixel">MANDIRI</span>
                </>
              )}
              <span className="text-[9px] text-slate-500 hidden sm:inline">(Ganti)</span>
            </button>
          </div>

          {/* Navigation Tabs Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-xs">
            {/* If Student: Show Lobby */}
            {userRole === 'student' && (
              <button
                onClick={() => {
                  sound.playClick();
                  sound.stopBGM();
                  sound.startLobbyBGM();
                  setActiveTab('lobby');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'lobby'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Home className="w-3 h-3 text-blue-300" />
                <span className="hidden xs:inline">Lobby</span>
              </button>
            )}

            {/* Arena Tab */}
            <button
              onClick={() => {
                sound.playClick();
                sound.stopBGM();
                sound.startBattleBGM();
                setActiveTab('dungeon');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'dungeon'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3 h-3 text-teal-300" />
              <span>{userRole === 'teacher' ? 'Dashboard Guru' : 'Arena'}</span>
            </button>

            {/* Leaderboard Tab (HANYA AKTIF PADA MODE A: DENGAN PENDAMPINGAN GURU) */}
            {usageMode === 'teacher_guided' && (
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('leaderboard');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-amber-600 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span className="hidden xs:inline">Ranking</span>
              </button>
            )}

            {/* Jurnal Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsJournalOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Lihat Jurnal Catatan Rangkuman Belajar"
            >
              <BookOpen className="w-3 h-3 text-purple-400" />
              <span className="hidden sm:inline">Jurnal ({journalEntries.length})</span>
            </button>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className={`px-2 py-1 rounded-xl border transition flex items-center gap-1 cursor-pointer font-bold text-xs ${
                isMuted
                  ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                  : 'bg-teal-950/70 border-teal-400/60 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.3)]'
              }`}
              title={isMuted ? 'Nyalakan Audio & BGM (Unmute)' : 'Matikan Audio (Mute)'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              )}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio ON'}</span>
            </button>

            <PWAInstallButton />

            <button
              onClick={() => setIsGuideOpen(true)}
              className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Panduan Cara Bermain Co-op Study RPG"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </nav>

      {/* Live Alert Notification Banner (Violations, Motivation, Tips) */}
      {alertNotification && (
        <div className="shrink-0 max-w-5xl mx-auto w-full px-3 pt-1.5 z-40">
          <div
            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all shadow-lg animate-in fade-in slide-in-from-top-1 ${
              alertNotification.type === 'violation'
                ? 'bg-rose-950/95 border-rose-500/60 text-rose-200'
                : alertNotification.type === 'motivation'
                ? 'bg-teal-950/95 border-teal-500/60 text-teal-200'
                : 'bg-amber-950/95 border-amber-500/60 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {alertNotification.type === 'violation' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
              ) : alertNotification.type === 'motivation' ? (
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="font-medium leading-tight truncate">{alertNotification.message}</span>
            </div>
            <button
              onClick={() => setAlertNotification(null)}
              className="text-[10px] opacity-75 hover:opacity-100 ml-2 px-1.5 py-0.2 rounded bg-black/40 cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        
        {/* LAYAR 1: LOBBY & SELEKSI ROLE (SISWA) */}
        {activeTab === 'lobby' && userRole === 'student' && (
          <div className="flex-1 overflow-y-auto p-2 sm:p-4">
            <RoleSelectionLobby
              usageMode={usageMode}
              characters={characters}
              selectedRoleId={selectedRoleId}
              onSelectRole={setSelectedRoleId}
              guildName={guildName}
              onChangeGuildName={setGuildName}
              playerName={playerName}
              onChangePlayerName={setPlayerName}
              classCode={classCode}
              onChangeClassCode={setClassCode}
              sessionDuration={sessionDuration}
              onChangeSessionDuration={handleSessionDurationChange}
              onStartRaid={handleStartRaid}
              onOpenLeaderboard={() => setActiveTab('leaderboard')}
              onBackToMode={() => setActiveTab('mode_select')}
            />
          </div>
        )}

        {/* LAYAR 2: ARENA PERTEMPURAN ATAU TEACHER LIVE DASHBOARD */}
        {activeTab === 'dungeon' && (
          <div className="flex-1 w-full overflow-y-auto p-2 sm:p-4">
            <div className="max-w-6xl mx-auto w-full">
              {userRole === 'teacher' && usageMode === 'teacher_guided' ? (
                <TeacherLiveDashboard
                  roomCode={classCode}
                  timeLeft={timeLeft}
                  isRunning={isRunning}
                  timerMode={timerMode}
                  sessionDuration={sessionDuration}
                  sessionRound={sessionRound}
                  onToggleTimer={handleToggleTimer}
                  onResetTimer={handleResetTimer}
                  onSetTimerDuration={(mins) => handleSetTimerDuration(mins)}
                  onFastForwardTimer={handleFastForwardTimer}
                  guilds={guilds}
                  distractionLogs={distractionLogs}
                  onTeacherAppreciate={handleTeacherAppreciate}
                  onTeacherReminder={handleTeacherReminder}
                  onOpenJournal={() => setIsJournalOpen(true)}
                />
              ) : (
                <BossArena
                  usageMode={usageMode}
                  guildName={guildName}
                  classCode={classCode}
                  boss={boss}
                  characters={characters}
                  isHit={isBossHit}
                  slashActive={slashActive}
                  floatingDamages={floatingDamages}
                  streakCount={streakCount}
                  expMultiplier={expMultiplier}
                  shieldHp={shieldHp}
                  maxShieldHp={maxShieldHp}
                  timeLeft={timeLeft}
                  isRunning={isRunning}
                  onToggleTimer={handleToggleTimer}
                  onResetTimer={handleResetTimer}
                  onFastForwardTimer={handleFastForwardTimer}
                  sessionRound={sessionRound}
                  timerMode={timerMode}
                  onSetTimerDuration={handleSetTimerDuration}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  isShieldWallActive={isShieldWallActive}
                  shieldWallShimmer={shieldWallShimmer}
                  shieldWallTimer={shieldWallTimer}
                  isEagleEyeActive={isEagleEyeActive}
                  arrowStrikeActive={arrowStrikeActive}
                  eagleEyeTimer={eagleEyeTimer}
                  isBossAttacking={isBossAttacking}
                  bossAttackTarget={bossAttackTarget}
                  darkProjectileActive={darkProjectileActive}
                  heroHitTarget={heroHitTarget}
                  heroFloatingText={heroFloatingText}
                  userRole={userRole || 'student'}
                  selectedRoleId={selectedRoleId}
                  distractionLogs={distractionLogs}
                  onKnightShieldWall={handleKnightShieldWall}
                  onMageCheckpoint={handleMageCheckpoint}
                  onHealerMotivate={handleHealerMotivate}
                  onRangerEagleEye={handleRangerEagleEye}
                  onKnightDistract={handleKnightDistract}
                  onMageDistract={handleMageDistract}
                  onHealerDistract={handleHealerDistract}
                  onRangerDistract={handleRangerDistract}
                  onTeacherAppreciate={handleTeacherAppreciate}
                  onTeacherReminder={handleTeacherReminder}
                />
              )}
            </div>
          </div>
        )}

        {/* LAYAR 3: CLASSROOM LEADERBOARD (HANYA AKTIF PADA MODE A: DENGAN PENDAMPINGAN GURU) */}
        {activeTab === 'leaderboard' && usageMode === 'teacher_guided' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            <TeacherLeaderboard
              guilds={guilds}
              onAwardBonusExp={handleAwardBonusExp}
              onOpenJournal={() => setIsJournalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* POPUP MODALS */}
      {/* App-Restriction Engine: Return Warning Popup */}
      <ReturnWarningModal
        isOpen={isReturnWarningOpen}
        onClose={() => setIsReturnWarningOpen(false)}
        penaltyType={returnPenaltyType}
        heroName={characters.find((c) => c.id === selectedRoleId)?.name || playerName}
        infractionCount={infractionCount}
      />

      <MetacognitiveModal
        isOpen={isCheckpointOpen}
        onClose={() => setIsCheckpointOpen(false)}
        onSubmit={handleCheckpointSubmit}
        expMultiplier={expMultiplier}
      />

      <MotivationModal
        isOpen={isMotivationOpen}
        onClose={() => setIsMotivationOpen(false)}
        onSendMotivation={handleSendMotivation}
      />

      <StudyJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        entries={journalEntries}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        bossName={boss.name}
        expEarned={1250}
        onNextBoss={handleNextBoss}
      />

      <RaidOutcomeModal
        isOpen={isRaidOutcomeOpen}
        onClose={() => setIsRaidOutcomeOpen(false)}
        onReturnToLobby={handleResetToLobby}
        shieldHp={shieldHp}
        maxShieldHp={maxShieldHp}
        characters={characters}
        boss={boss}
        sessionMinutes={sessionDuration}
        expMultiplier={expMultiplier}
      />

      {/* Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-teal-500/40 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-teal-400" />
                <h3 className="font-rpg font-bold text-white text-base">
                  Panduan School-Life RPG v2.5
                </h3>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-teal-300 mb-1">1. Mode A vs Mode B</h4>
                <p>
                  <strong>Mode A (Dengan Pendampingan Guru):</strong> Master Timer dikontrol terpusat oleh Guru, siswa memilih Guild di kelas yang sama, dan Classroom Leaderboard aktif.<br />
                  <strong>Mode B (Mandiri):</strong> Kelompok belajar mandiri dengan timer dikontrol bebas oleh party, dan leaderboard ditiadakan.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-teal-300 mb-1">2. App-Restriction Engine</h4>
                <p>
                  Jika kamu berpindah ke aplikasi lain (TikTok, Instagram, game lain), berpindah tab, atau mengunci layar HP saat sesi fokus berjalan, sistem otomatis memotong -20% HP Karaktermu! Jika HP Hero habis, penalti otomatis mengikis -15% Perisai Tim.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="font-bold text-teal-300 mb-1">3. Real-Time Online Room Sync</h4>
                <p>
                  Setiap ruang kelas tersinkronisasi via BroadcastChannel & LocalStorage secara real-time. Guru dapat melihat status HP, shield, dan pelanggaran siswa secara langsung.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Mengerti & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
