export interface BookmarkRow {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
}

export interface BookmarkInsert {
  user_id: string;
  url: string;
  title: string;
  id?: string;
  created_at?: string;
}
