export default {
  toSize({ total, current }) {
    let totalSize = ((total / 1024) / 1024).toFixed(2)
    let receivedSize = ((current / 1024) / 1024).toFixed(2)
    let sizeUnit = 'MB'
    if (totalSize >= 1024) {
      totalSize = (totalSize / 1024).toFixed(2)
      receivedSize = (receivedSize / 1024).toFixed(2)
      sizeUnit = 'GB'
    }
    return {
      totalSize,
      receivedSize,
      sizeUnit
    }
  },
  toPercentage(currentProgress, total) {
    return Math.floor((currentProgress * 100) / total)
  }
}
