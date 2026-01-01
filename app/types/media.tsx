export type Media = {
    id : number;
    user_id : string;
    type : 'Movie' | 'Serie' | 'Book' | 'Anime' | 'Manga';
    title : string;
    status : 'To Watch/Read' | 'Watching/Reading' | 'Completed' | 'On Hold' | 'Dropped';
    rating? : number; // 1 to 10, 1 = worst, 10 = best
    rank? : number;
    notes? : string;
    started_at? : string;
    finished_at? : string;
    created_at : string;
};