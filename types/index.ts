export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
  expires: string;
}

export type MediaType = 'film' | 'serie' | 'livre' | 'manga' | 'anime';
export type MediaStatus = 'a_voir' | 'en_cours' | 'termine';

export interface MediaEntry {
  id: string;
  user_id: string;
  type: MediaType;
  title: string;
  status: MediaStatus;
  rating: number | null;
  rank: number | null;
  notes: string | null;
  started_at: Date | string | null;
  finished_at: Date | string | null;
  created_at: Date | string;
}

export interface MediaInsert {
  title: string;
  type: MediaType;
  status?: MediaStatus;
  rating?: number | null;
  rank?: number | null;
  notes?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
}
