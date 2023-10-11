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

import MarkdownRenderer from "./markdownRenderer"
import { SiyuanDevice } from "zhi-device"

/**
 * Markdown渲染器
 *
 * @author terwer
 * @since 1.0.0
 */
class VuepressRenderer extends MarkdownRenderer {
  public async renderMd() {
    this.logger.info("render md to vuepress")
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
}

export default VuepressRenderer
