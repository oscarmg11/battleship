interface ImportMetaEnv {
    readonly VITE_WEBSOCKET_URI: string;
    readonly VITE_GAME_API: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
