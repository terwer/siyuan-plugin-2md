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

import { ILogger, simpleLogger } from "zhi-lib-base"
import { defaultNotebook, isDev } from "../Constants"
import ExportMdPlugin from "../index"
import { SiyuanDevice } from "zhi-device"
import KernelApi from "../api/kernel-api"
import { HtmlUtil } from "zhi-common"
import RenderOptions from "../models/renderOptions"

/**
 * Markdown渲染器
 *
 * @author terwer
 * @since 1.0.0
 */
class BaseMarkdownRenderer {
  protected readonly logger: ILogger
  protected readonly kernelApi: KernelApi
  protected opts: RenderOptions

  constructor(pluginInstance: ExportMdPlugin) {
    this.logger = simpleLogger("base-markdown-renderer", "export-md", isDev)
    this.kernelApi = new KernelApi()

    // 默认是思源笔记用户指南
    const notebook = "20210808180117-czj9bvb"
    const workspaceFolder = SiyuanDevice.siyuanWorkspacePath()
    const outputFolder = SiyuanDevice.joinPath(workspaceFolder, "temp", "siyuan2md", "default")
    const opts = new RenderOptions()
    opts.notebook = notebook
    opts.outputFolder = outputFolder
    opts.basePath = "/"
    opts.assetFolder = "assets"
    opts.fixTitle = false
    opts.linkAsPlainText = false
    this.opts = opts
    this.logger.info(`default outputFolder => ${this.opts.outputFolder}`)
  }

  public setOpts(opts: RenderOptions) {
    this.opts = opts
  }

  /**
   * 执行渲染入口
   */
  public async doRender() {
    await this.initConfig(this.opts)
    return await this.renderMd()
  }

  /**
   * 初始化入口
   *
   * @protected
   */
  protected async initConfig(opts: RenderOptions) {}

  protected async renderSingleDoc(pageId: string) {
    const mdRes = await this.kernelApi.exportMdContent(pageId)
    if (mdRes.code !== 0) {
      throw new Error(mdRes.msg)
    }
    const mdResData = mdRes.data as any
    let md = mdResData.content
    // 处理图片、音频文件、视频、附件
    md = await this.processAssets(md)
    // 处理链接
    md = await this.processLinks(md)
    return md
  }

  /**
   * 渲染 Markdown 的入口
   */
  protected async renderMd() {
    const fs = SiyuanDevice.requireLib("fs")
    const path = SiyuanDevice.requireLib("path")
    if (!fs.existsSync(this.opts.outputFolder)) {
      fs.mkdirSync(this.opts.outputFolder, { recursive: true })
    }
    const ret: any = await this.getAllFileList(this.opts.notebook, "")
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
        save_dir = path.join(this.opts.outputFolder, toDir)
        save_file = path.join(save_dir, "README.md")
        this.logger.debug("生成目录 => ", save_dir)
        this.logger.debug("生成目录文件 => ", save_file)
      } else {
        const toFile = path.join(this.opts.outputFolder, toDir + ".md")
        save_dir = path.dirname(toFile)
        save_file = toFile
        this.logger.debug("复用文档目录 => ", save_dir)
        this.logger.debug("生成文档 => ", save_file)
      }
      // 确保有目录
      if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir)
      }
      // 渲染单个 MD（核心方法）
      const md = await this.renderSingleDoc(pageId)
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
  protected async getAllFileList(notebook: string, path: string): Promise<any> {
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

  private async processAssets(md: any) {
    // 资源链接一般是 [](assets/xxx.文件后缀)
    // 例如：
    // [test.json](assets/test-20250303161112-r42wpuu.json)
    // 特殊的，图片是 ![]((assets/xxx.文件后缀)
    // ![](assets/test-20250303161112-r42wpuu.png)
    //
    // 支持的资源扩展名配置
    const supportedExtensions = [
      // 图片类型
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      // 文档类型
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "xls",
      "xlsx",
      "txt",
      // 压缩包
      "zip",
      "rar",
      // 音频视频
      "mp3",
      "mp4",
    ]
    // 资源正则（匹配图片和普通附件）
    const assetRegex = /(!?)\[([^\]]*)]\(([^)]+)\)/g
    const matches = Array.from(md.matchAll(assetRegex))
    if (!matches.length) {
      this.logger.debug("No assets found.")
      return md
    }
    this.logger.debug("asset matches =>", matches)

    for (const match of matches) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [fullMatch, isImage, altText, assetPath] = match

      // 过滤非资源和非支持格式
      const isAssetSupported = this.shouldProcessAsset(assetPath, supportedExtensions)
      if (!isAssetSupported.flag) {
        continue
      }
      const assetExt = isAssetSupported.ext
      try {
        // 本地下载
        if (assetPath.startsWith("assets/")) {
          try {
            const assetUrl = await this.downloadAsset(assetPath, assetExt)
            // 替换链接
            md = md.replace(fullMatch, `${isImage}[${altText}](${assetUrl})`)
          } catch (err) {
            this.logger.error(`资源处理失败：${assetPath}`, err)
          }
        } else {
          if (!assetPath.startsWith("http://")) {
            this.logger.warn("assetPath is not a url", assetPath)
          } else {
            // 远程下载
            try {
              const assetUrl = await this.downloadAsset(assetPath, assetExt, true)
              // 替换链接
              md = md.replace(fullMatch, `${isImage}[${altText}](${assetUrl})`)
            } catch (err) {
              this.logger.error(`资源处理失败：${assetPath}`, err)
            }
          }
        }
      } catch (err) {
        this.logger.error(`资源处理失败：${assetPath}`, err)
      }
    }
    return md
  }

  private async downloadAsset(originalPath: string, fileExt: string, isRemote = false): Promise<string> {
    const fs = SiyuanDevice.requireLib("fs").promises
    const path = SiyuanDevice.requireLib("path")

    // 统一资源输出目录
    const assetOutputDir = SiyuanDevice.joinPath(this.opts.outputFolder, this.opts.assetFolder)
    await fs.mkdir(assetOutputDir, { recursive: true })

    // 生成目标文件名（保留原始文件名+哈希后缀）
    const originalName = path.basename(originalPath)
    const hashSuffix = `-${Date.now().toString(16)}`

    try {
      if (isRemote) {
        // 处理远程资源下载
        const targetFileName = `${path.parse(originalName).name}${hashSuffix}.${fileExt}`
        const targetPath = SiyuanDevice.joinPath(assetOutputDir, targetFileName)

        return await this.handleRemoteAsset(originalPath, targetPath)
      } else {
        // 处理本地资源复制
        const targetFileName = `${path.parse(originalName).name}.${fileExt}`
        const targetPath = SiyuanDevice.joinPath(assetOutputDir, targetFileName)
        return await this.handleLocalAsset(originalPath, targetPath)
      }
    } catch (err) {
      this.logger.error(`资源处理失败：${originalPath}`, err)
      throw new Error("资源处理失败")
    }
  }

  private async handleLocalAsset(sourcePath: string, targetPath: string): Promise<string> {
    // 偏好设置 ==========================================================
    const mkDocsAssetFolder = "/assets"
    // const mkDocsBasePath = "/docs"
    const mkDocsBasePath = ""
    // 偏好设置 ==========================================================

    const fs = SiyuanDevice.requireLib("fs").promises
    const path = SiyuanDevice.requireLib("path")

    // 获取绝对路径
    let assetBaseFolder = SiyuanDevice.siyuanDataPath()
    if (defaultNotebook === this.opts.notebook) {
      // 20210808180117-czj9bvb
      assetBaseFolder = SiyuanDevice.joinPath(assetBaseFolder, defaultNotebook)
    }
    const absSourcePath = SiyuanDevice.joinPath(assetBaseFolder, sourcePath)
    this.logger.info("siyuan absSourcePath =>", absSourcePath)
    // 验证文件存在性
    try {
      await fs.access(absSourcePath)
    } catch {
      throw new Error("本地文件不存在：" + absSourcePath)
    }

    // 执行复制操作
    await fs.copyFile(absSourcePath, targetPath)

    // 返回相对输出目录的路径
    const fileName = path.basename(targetPath)
    return path.join(mkDocsBasePath, mkDocsAssetFolder, fileName)
  }

  private async handleRemoteAsset(url: string, targetPath: string): Promise<string> {
    const fs = SiyuanDevice.requireLib("fs").promises
    const path = SiyuanDevice.requireLib("path")

    // 创建写入流
    const writer = fs.createWriteStream(targetPath)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      // 获取可读流
      const reader = response.body.getReader()
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        writer.write(value)
      }

      // 返回相对路径
      return path.relative(this.opts.outputFolder, targetPath)
    } catch (err) {
      this.logger.error(`远程资源下载失败：${url}`, err)
      throw err
    } finally {
      writer.close()
    }
  }

  /**
   * 判断是否需要处理该资源
   */
  private shouldProcessAsset(
    assetPath: string,
    supportedExts: string[]
  ): {
    flag: boolean
    ext: string
  } {
    // 提取扩展名
    const pathParts = assetPath.split(".")
    if (pathParts.length < 2) {
      this.logger.warn(`not a asset, ignore：${assetPath}`)
      // 无后缀名文件
      return {
        flag: false,
        ext: "",
      }
    }
    const extension = pathParts.pop()!.toLowerCase()
    // 支持的类型
    if (!supportedExts.includes(extension)) {
      this.logger.warn(`file is not supported：${extension}`)
      return {
        flag: false,
        ext: "",
      }
    }
    return {
      flag: true,
      ext: extension,
    }
  }

  private async processLinks(md: any) {
    // 链接处理
    const outerLinkRegex = /\[(.+?)]\(siyuan:\/\/blocks\/(\d+-\w+)\)/g
    const matches = Array.from(md.matchAll(outerLinkRegex))
    this.logger.debug("link matches =>", matches)
    // /请从这里开始/通用操作/闪卡
    let replacedText = md
    for (const match of matches) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [fullMatch, title, id] = match
      // processedTitle
      let processedTitle = title
      if (this.opts.fixTitle) {
        processedTitle = HtmlUtil.removeTitleNumber(processedTitle)
      }
      // outerLink
      let outerLink = ""
      // 获取预览链接
      if (this.opts.linkAsPlainText) {
        // 配置了忽略块链接的直接用纯文本
        // https://github.com/terwer/siyuan-plugin-publisher/issues/1202#issuecomment-2542653498
        // outerLink = `siyuan://blocks/${id}`
        replacedText = replacedText.replace(fullMatch, processedTitle)
      } else {
        if (!fullMatch.includes("siyuan://block")) {
          // 保持原样，不处理
        } else {
          // 获取文档路径
          try {
            const hPathRes = await this.kernelApi.getHPathByID(id)
            if (hPathRes.code !== 0) {
              this.logger.error("获取文档路径失败：", hPathRes)
            } else if (!hPathRes.data || hPathRes.data.toString().length === 0) {
              this.logger.error("获取文档路径失败：", hPathRes)
            } else {
              outerLink = SiyuanDevice.joinPath(this.opts.basePath, hPathRes.data as unknown as string)
              replacedText = replacedText.replace(fullMatch, `[${processedTitle}](${outerLink})`)
            }
          } catch (e) {
            this.logger.error("获取文档路径失败", e)
          }
        }
      }
    }

    return replacedText
  }
}

export default BaseMarkdownRenderer
