import whitelist from '@/constants/whitelist'

export default {
  isWhitelistFileOrFolder: (fullPath) => {
    return whitelist.Folders.map((folder) => fullPath.includes(folder)).includes(true)
  }
}
