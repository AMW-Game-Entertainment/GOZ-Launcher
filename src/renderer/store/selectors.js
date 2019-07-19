export const getTotalOnlineInGame = (state) => state.inGame.totalOnline

export const getTotalOfflineInGame = (state) => state.inGame.totalOffline

export const getConfig = (state, name) => state.config[name]
