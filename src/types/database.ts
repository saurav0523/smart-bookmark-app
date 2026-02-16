export interface BookmarkRow {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
  owner_email?: string | null;
}

export interface BookmarkInsert {
  user_id: string;
  url: string;
  title: string;
  owner_email?: string | null;
  id?: string;
  created_at?: string;
}
