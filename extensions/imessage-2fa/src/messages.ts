import { homedir } from "os";
import { resolve } from "path";
import { useSQL } from "@raycast/utils";
import { Message } from "./types";
import { lookBackMinutes } from "./preferences";
import { execSync } from "child_process";

const DB_PATH = resolve(homedir(), "Library/Messages/chat.db");

function getTwoFactorCodesQuery() {
  return `
    select
      message.guid,
      message.rowid,
      ifnull(handle.uncanonicalized_id, chat.chat_identifier) AS sender,
      message.service,
      datetime(message.date / 1000000000 + 978307200, 'unixepoch', 'localtime') AS message_date,
      message.text
    from message
      left join chat_message_join on chat_message_join.message_id = message.ROWID
      left join chat on chat.ROWID = chat_message_join.chat_id
      left join handle on message.handle_id = handle.ROWID
    where message.is_from_me = 0
      and message.text is not null
      and length(message.text) > 0
      and datetime(message.date / 1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') >= datetime('now', '-${lookBackMinutes} minutes', 'localtime')
      and (
        message.text glob '*[0-9][0-9][0-9]*'
        or message.text glob '*[0-9][0-9][0-9][0-9]*'
        or message.text glob '*[0-9][0-9][0-9][0-9][0-9]*'
        or message.text glob '*[0-9][0-9][0-9][0-9][0-9][0-9]*'
        or message.text glob '*[0-9][0-9][0-9]-[0-9][0-9][0-9]*'
        or message.text glob '*[0-9][0-9][0-9][0-9][0-9][0-9][0-9]*'
        or message.text glob '*[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]*'
      ) 
    order by
      message.date desc 
    limit 100
  `;
}

export function useTwoFactorCodes() {
  const query = getTwoFactorCodesQuery();
  return useSQL<Message>(DB_PATH, query);
}

export function markAsRead(message: Message) {
  execSync(
    `sqlite3 ${DB_PATH} "UPDATE message SET is_read = 1, date_read = datetime('now', 'unixepoch', 'localtime') WHERE ROWID = ${message.ROWID}"`
  );
}
