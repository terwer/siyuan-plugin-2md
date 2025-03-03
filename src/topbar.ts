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

import ExportMdPlugin from "./index"
import { icons } from "./utils/svg"
import { Dialog, Menu } from "siyuan"
import Export from "./libs/Export.svelte"
import pkg from "../package.json"

class Topbar {
  protected pluginInstance: ExportMdPlugin
  private rect: DOMRect
  private contentMenu: Menu
  private contentMenuElement: HTMLElement

  constructor(pluginInstance: ExportMdPlugin) {
    this.pluginInstance = pluginInstance
  }

  /**
   * 顶栏按钮
   *
   * @author terwer
   * @version 0.0.1
   * @since 0.0.1
   */
  public async initTopbar() {
    const topBarElement = this.pluginInstance.addTopBar({
      icon: icons.icon2md,
      title: this.pluginInstance.i18n.exportMd,
      position: "right",
      callback: () => {},
    })

    topBarElement.addEventListener("click", async (event) => {
      const exportId = "export-md-dialog"
      const d = new Dialog({
        title: `${this.pluginInstance.i18n.exportMd} - ${this.pluginInstance.i18n.sharePro} v${pkg.version}`,
        content: `<div id="${exportId}"></div>`,
        width: this.pluginInstance.isMobile ? "92vw" : "61.8vw",
      })
      new Export({
        target: document.getElementById(exportId) as HTMLElement,
        props: {
          pluginInstance: this.pluginInstance,
        },
      })
    })
  }
}

export { Topbar }
