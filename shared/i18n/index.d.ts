import en from './locales/en.json'
export declare const dictionaries: {
  readonly en: {
    common: {
      ok: string
      cancel: string
      save: string
      delete: string
      loading: string
      error: string
      settings: string
      close: string
    }
    errors: {
      not_found: string
      already_exists: string
      invalid_arg: string
      internal_server_error: string
      validation_error: string
    }
    board: {
      note: string
      group: string
      show_notes: string
      hide_notes: string
      export: string
      import: string
      leave: string
      export_json: string
      import_json: string
      leave_board: string
      delete_note: string
      hidden_note: string
      note_placeholder: string
      pin_group: string
      unpin_group: string
      delete_group: string
      group_desc_placeholder: string
      group_desc_empty: string
      confirm_reset_voting: string
      votes_per_user_prompt: string
      pause_voting: string
      reset_voting: string
      start_voting: string
      vote: string
      clear: string
      create_note: string
      create_group: string
    }
    setup: {
      title: string
      create_board: string
      join_board: string
      create_desc: string
      join_desc: string
      create_tab: string
      join_tab: string
      username_label: string
      username_placeholder: string
      board_id_label: string
      board_id_placeholder: string
      password_label: string
      password_placeholder: string
      regenerate: string
      generate_id_title: string
      submit_create: string
      submit_join: string
      username_error: string
      server_config_title: string
      server_config_desc: string
      server_url_label: string
      server_url_placeholder: string
      connect: string
      connecting: string
      preferences_tab: string
      server_tab: string
      preferences_title: string
      language_label: string
      test_connection: string
      connection_success: string
    }
    user: {
      me_suffix: string
    }
    languages: {
      en: string
      es: string
      select: string
    }
    connection: {
      wrong_password: string
      access_denied: string
      reconnecting: string
      session_full: string
    }
    notifications: {
      import_success: string
      invalid_json: string
    }
    session_expired: {
      title: string
      description: string
      go_back: string
      export_board: string
      admin_warning: string
      data_erased: string
    }
    ws_close: {
      invalid_password: string
      session_expired: string
      session_full: string
    }
  }
  readonly es: {
    common: {
      ok: string
      cancel: string
      save: string
      delete: string
      loading: string
      error: string
      settings: string
      close: string
    }
    errors: {
      not_found: string
      already_exists: string
      invalid_arg: string
      internal_server_error: string
      validation_error: string
    }
    board: {
      note: string
      group: string
      show_notes: string
      hide_notes: string
      export: string
      import: string
      leave: string
      export_json: string
      import_json: string
      leave_board: string
      delete_note: string
      hidden_note: string
      note_placeholder: string
      pin_group: string
      unpin_group: string
      delete_group: string
      group_desc_placeholder: string
      group_desc_empty: string
      confirm_reset_voting: string
      votes_per_user_prompt: string
      pause_voting: string
      reset_voting: string
      start_voting: string
      vote: string
      clear: string
      create_note: string
      create_group: string
    }
    setup: {
      title: string
      create_board: string
      join_board: string
      create_desc: string
      join_desc: string
      create_tab: string
      join_tab: string
      username_label: string
      username_placeholder: string
      board_id_label: string
      board_id_placeholder: string
      password_label: string
      password_placeholder: string
      regenerate: string
      generate_id_title: string
      submit_create: string
      submit_join: string
      username_error: string
      server_config_title: string
      server_config_desc: string
      server_url_label: string
      server_url_placeholder: string
      connect: string
      connecting: string
      preferences_tab: string
      server_tab: string
      preferences_title: string
      language_label: string
      test_connection: string
      connection_success: string
    }
    user: {
      me_suffix: string
    }
    languages: {
      en: string
      es: string
      select: string
    }
    connection: {
      wrong_password: string
      access_denied: string
      reconnecting: string
      session_full: string
    }
    notifications: {
      import_success: string
      invalid_json: string
    }
    session_expired: {
      title: string
      description: string
      go_back: string
      export_board: string
      admin_warning: string
      data_erased: string
    }
    ws_close: {
      invalid_password: string
      session_expired: string
      session_full: string
    }
  }
}
export type Locale = keyof typeof dictionaries
export type Dictionary = typeof en
/**
 * Utility type to get all nested keys of an object in dot notation (e.g., 'common.ok')
 */
export type NestedKeyOf<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`
}[keyof T & (string | number)]
export type I18nKeys = NestedKeyOf<Dictionary>
export declare const defaultLocale: Locale
export declare const supportedLocales: Locale[]
export declare const languages: {
  code: string
  name: string
}[]
