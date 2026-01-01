export type SleepLog = {
    id : number;
    user_id : string;
    sleep_date : string;
    sleep_time : string;
    wake_time : string;
    sleep_duration_minutes : number;
    notes? : string;
    created_at : string;
};