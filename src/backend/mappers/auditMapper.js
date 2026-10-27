export function mapAuditLogFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    tableName: row.table_name,
    recordId: row.record_id,
    changes: row.changes,
    createdAt: row.created_at,
  };
}

export function mapNotificationFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}
