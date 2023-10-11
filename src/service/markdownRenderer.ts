/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { simpleLogger } from "zhi-lib-base"
import { isDev } from "../Constants"
import ExportMdPlugin from "../index"
import { SiyuanDevice } from "zhi-device"
import KernelApi from "../api/kernel-api"
import { StrUtil, ZhiCommon } from "zhi-common"

/**
 * Markdown渲染器
 *
 * @author terwer
 * @since 1.0.0
 */
class MarkdownRenderer {
  private readonly logger
  private readonly kernelApi: KernelApi
  private readonly common
  private readonly notebook
  private readonly outputFolder

  constructor(pluginInstance: ExportMdPlugin) {
    this.logger = simpleLogger("markdown-renderer", "export-md", isDev)

    this.kernelApi = new KernelApi()
    this.common = new ZhiCommon()

    // this.notebook = "20230722212235-lwhprdc"
    // 正式
    this.notebook = "20220712031439-h4ut7wc"
    this.outputFolder = "/Users/terwer/Downloads/siyuan2md/default"
    // const appDataFolder = this.common.electronUtil.getCrossPlatformAppDataFolder()
    // this.outputFolder = this.common.electronUtil.joinPath(appDataFolder, "siyuan2md", "default")
  }

  /**
   * 渲染 Markdown 的入口
   */
  public async renderMd() {
    const fs = SiyuanDevice.requireLib("fs")
    const path = SiyuanDevice.requireLib("path")
    if (!fs.existsSync(this.outputFolder)) {
      fs.mkdirSync(this.outputFolder, { recursive: true })
    }
    const ret: any = await this.getAllFileList(this.notebook, "")
    const files = ret.ret
    const nameMap = ret.nameMap
    this.logger.info(`Found ${files.length} files.`, files)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const pageId = file.id
      const paths = file.path.replace(/\.sy/, "").split("/")
      this.logger.debug("paths =>", paths)

      let save_dir: string
      let save_file: string
      const dir_arr = []
      paths.forEach((item: string) => {
        dir_arr.push(nameMap[item])
      })
      const toDir = path.join(...dir_arr)
      if (file.subFileCount > 0) {
        save_dir = path.join(this.outputFolder, toDir)
        save_file = path.join(save_dir, "README.md")
        this.logger.debug("生成目录 => ", save_dir)
        this.logger.debug("生成目录文件 => ", save_file)
      } else {
        const toFile = path.join(this.outputFolder, toDir + ".md")
        save_dir = path.dirname(toFile)
        save_file = toFile
        this.logger.debug("复用文档目录 => ", save_dir)
        this.logger.debug("生成文档 => ", save_file)
      }
      // 确保有目录
      if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir)
      }

      const mdRes = await this.kernelApi.exportMdContent(pageId)
      if (mdRes.code !== 0) {
        throw new Error(mdRes.msg)
      }
      const mdResData = mdRes.data as any
      const md = mdResData.content

      // this.logger.info("save_dir=", { toPath: save_dir })
      // this.logger.info("md=>", { md: md })
      const fsPromise = SiyuanDevice.requireLib("fs").promises
      await fsPromise.writeFile(save_file, md, { encoding: "utf8" })
    }

    return files.length
  }

  /**
   * 递归获取该笔记本下面的所有文件
   *
   * @param notebook 笔记本
   * @param path 路径，根路径传空
   * @private
   */
  private async getAllFileList(notebook: string, path: string): Promise<any> {
    const that = this
    const ret: any[] = []
    const nameMap = {}

    async function recursivelyGetFiles(path: string, currentPathFiles: any[]): Promise<void> {
      for (let i = 0; i < currentPathFiles.length; i++) {
        const file = currentPathFiles[i] as any
        // 子文件路径
        const subPath = file.path
        const subFilesRes = await that.listDocsByPath(notebook, subPath)
        const subDocs = subFilesRes.data as any
        const isLeaf = subDocs.files.length === 0
        nameMap[file.id] = file.name.replace(/\.sy/, "")

        ret.push({ ...file, isLeaf })

        if (!isLeaf) {
          const subPathFiles = subDocs.files
          await recursivelyGetFiles(subPath, subPathFiles)
        }
      }
    }

    // 第一次请求的情况
    const res = await this.listDocsByPath(notebook, path)
    if (res.code !== 0) {
      throw new Error("Unable to fetch docs")
    }
    const docs = res.data as any
    const initialFiles = docs.files as []

    await recursivelyGetFiles(path, initialFiles)
    this.logger.info("nameMap =>", nameMap)
    return { ret: ret, nameMap: nameMap }
  }

  /**
   * 获取路径下文档列表
   *
   * @param notebook - 笔记本
   * @param path - 路径
   */
  private async listDocsByPath(notebook: string, path?: string) {
    const data = { notebook: notebook, path: path ?? "", sort: 4 }
    const url = "/api/filetree/listDocsByPath"
    //文档hpath与Markdown 内容
    return await this.kernelApi.siyuanRequest(url, data)
  }
}

export default MarkdownRenderer
