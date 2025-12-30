import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://uqnzstpqloqcoaiimfyo.supabase.co'
const supabaseKey = 'sb_publishable_lct7Jdki9VK9CSXKG7ZQTQ_BsoVUuJv'
export const supabase = createClient(supabaseUrl,supabaseKey)

