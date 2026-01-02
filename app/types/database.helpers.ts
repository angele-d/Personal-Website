import { Database } from './supabase';

// 1. Raccourcis génériques (tu n'y touches plus)
type Tables = Database['public']['Tables'];
type Enums = Database['public']['Enums'];

// --- MEDIA ---

// Reading
export type Media = Tables['media']['Row'];

// Insertion
export type MediaInsert = Tables['media']['Insert'];

// Updating
export type MediaUpdate = Tables['media']['Update'];

// ENUM MediaType : type : 'film' | 'serie' | 'livre' | 'manga' | 'anime'
export type MediaType = Enums['media_type'];

// ENUM MediaStatus : type : 'a_voir' | 'en_cours' | 'termine'
export type MediaStatus = Enums['media_status'];

// --- SLEEP LOGS ---

// 1. Le log individuel (Row)
export type SleepLog = Tables['sleep_logs']['Row'];

// Insertion
// ⚠️ Attention ici : TypeScript va croire que 'duration_minutes' est obligatoire
// car il est "NOT NULL" dans la DB. Mais c'est ton trigger qui le remplit !
// On va créer un type personnalisé "Input" qui retire ce champ.
export type SleepLogInsert = Omit<Tables['sleep_logs']['Insert'], 'duration_minutes'>;

// Updating
export type SleepLogUpdate = Tables['sleep_logs']['Update'];


// --- VUES (STATS) ---
// Supabase range les vues dans 'Views' et non 'Tables'
type Views = Database['public']['Views'];

export type SleepStatsMonthly = Views['sleep_stats_monthly']['Row'];
export type SleepStatsYearly = Views['sleep_stats_yearly']['Row'];
export type SleepStatsGlobal = Views['sleep_stats_global']['Row'];

