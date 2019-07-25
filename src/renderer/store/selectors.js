export const getConfig = (state, name) => {
  return state.config[name]
}

export const getDownloadingProgress = (state) => {
  return state.progress.downloading
}
