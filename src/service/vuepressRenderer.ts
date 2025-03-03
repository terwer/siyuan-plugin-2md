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

import BaseMarkdownRenderer from "./baseMarkdownRenderer"
import { SiyuanDevice } from "zhi-device"
import { isDev } from "../Constants"
import RenderOptions from "../models/renderOptions"

/**
 * Markdown渲染器
 *
 * @author terwer
 * @since 1.0.0
 */
class VuepressRenderer extends BaseMarkdownRenderer {
  protected async initConfig(opts: RenderOptions): Promise<void> {
    await super.initConfig(opts)
    const notebook = "20210808180117-czj9bvb"
    const workspaceFolder = SiyuanDevice.siyuanWorkspacePath()
    const outputFolder = SiyuanDevice.joinPath(workspaceFolder, "temp", "siyuan2md", "vuepress")
    opts.notebook = notebook
    opts.outputFolder = outputFolder
    if (isDev) {
      opts.notebook = "20231011174146-kexkngw"
      opts.outputFolder = "/Users/terwer/Downloads/vuepress-demo/docs"
    }
    this.logger.info(`vuepress outputFolder => ${opts.outputFolder}`)
  }

  protected async renderMd() {
    this.logger.info("render md to vuepress")
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

      const first_dir = path.join(this.opts.outputFolder, "000.目录页")
      let first_file: string
      let first_file_name: string
      let first_file_slug: string

      let save_dir: string
      let save_file: string
      const dir_arr = []
      paths.forEach((item: string) => {
        dir_arr.push(nameMap[item])
      })
      const toDir = path.join(...dir_arr)
      if (file.subFileCount > 0) {
        first_file_name = dir_arr[0]
        // first_file_slug = dir_arr[0]
        first_file_slug = "test" + i
        first_file = path.join(first_dir, dir_arr[0] + ".md")
        save_dir = path.join(this.opts.outputFolder, toDir)
        save_file = path.join(save_dir, "README.md")
        this.logger.debug("生成目录 => ", save_dir)
        this.logger.debug("一级目录目录 => ", first_dir)
        this.logger.debug("一级目录目录文件 => ", first_file)
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

      // 确保有目录
      if (!fs.existsSync(first_dir)) {
        fs.mkdirSync(first_dir)
      }

      // md正文
      const mdFM = `---
title: Java_SE之Java_SE平台与JDK
date: 2022-09-05 12:20:12
permalink: /post/java-se-platform-and-jdk.html
meta:
  - name: keywords
    content: 平台 版本 jdk javase java kotlin
  - name: description
    content: >-
      java平台javase_javaplatformstandardeditionjavase是一个计算平台用于为桌面和服务器环境开发和部署可移植代码。javase以前称为javaplatformstandardedition(jse)。javame_javaplatformmicroeditionjavame是一个计算平台用于为嵌入式和移动设备（微控制器传感器网关移动电话个人数字助理电视机顶盒打印机）开发和部署可移植代码。javame以前称为javaplatformmicroedition或jme。截至年
categories:
  - 默认分类
tags:
  - 平台
  - 版本
  - jdk
  - javase
  - java
  - kotlin
author:
  name: terwer
  link: https://github.com/terwer
---`
      // 渲染单个 MD（核心方法）
      const mdContent = await this.renderSingleDoc(pageId)
      const md = mdFM + "\n" + mdContent
      // this.logger.info("save_dir=", { toPath: save_dir })
      // this.logger.info("md=>", { md: md })
      const fsPromise = SiyuanDevice.requireLib("fs").promises
      await fsPromise.writeFile(save_file, md, { encoding: "utf8" })

      // 目录正文
      if (first_file) {
        const dirMd = `---
pageComponent:
  name: Catalogue
  data:
    path: ${first_file_name}
    imgUrl: /img/web.png
    description: 服务端技术分享
title: ${first_file_name}
date: 2011-03-11 21:50:53
permalink: /${first_file_slug}/
article: false
comment: false
editLink: false
author:
  name: terwer
  link: https://github.com/terwer
---`
        await fsPromise.writeFile(first_file, dirMd, { encoding: "utf8" })
      }
    }

    return files.length
  }
}

export default VuepressRenderer
