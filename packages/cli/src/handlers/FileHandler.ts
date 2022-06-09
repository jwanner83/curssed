import { readdir } from 'fs/promises'
import { sep } from 'path'

export default class FileHandler {
  /**
   * Get all files recursively from directory
   * @param dir
   */
  public async getFiles (dir: string) {
    const files: string[] = []
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isFile()) {
        files.push(`${dir}${sep}${entry.name}`)
      } else if (entry.isDirectory()) {
        const children = await this.getFiles(`${dir}${sep}${entry.name}`)
        files.push(...children)
      }
    }

    return files
  }

}
