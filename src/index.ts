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

import { App, getFrontend, IObject, Plugin } from "siyuan"
import { Topbar } from "./topbar"
import KernelApi from "./api/kernel-api"
import { ILogger, simpleLogger } from "zhi-lib-base"
import { isDev } from "./Constants"

import "./index.styl"
import BaseMarkdownRenderer from "./service/baseMarkdownRenderer"

/**
 * 别名插件
 *
 * @author terwer
 * @version 0.0.1
 * @since 0.0.1
 */
export default class ExportMdPlugin extends Plugin {
  public isMobile: boolean
  public logger: ILogger
  public kernelApi: KernelApi
  private topbar: Topbar

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = simpleLogger("index", "export-md", isDev)
    this.kernelApi = new KernelApi()
    this.topbar = new Topbar(this)
  }

  async onload() {
    const frontEnd = getFrontend()
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile"

    await this.topbar.initTopbar()
  }

  //================================================================
  // private function
  //================================================================
}
