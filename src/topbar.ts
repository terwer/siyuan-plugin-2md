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
import { Menu } from "siyuan"
import Export from "./libs/Export.svelte"

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
      const menu = new Menu("exportMdMenu")
      // 创建独立容器（关键修复点）
      const container = document.createElement("div")
      container.className = "export-md-container"
      // 创建带有容器的菜单项
      menu.addItem({
        element: container, // 显式指定容器
        iconHTML: "",
        label: "",
      })
      new Export({
        target: container,
        props: {
          pluginInstance: this.pluginInstance,
        },
      })
      // 显示菜单
      const rect = topBarElement.getBoundingClientRect()
      menu.open({
        x: rect.right,
        y: rect.bottom,
        isLeft: true,
      })
    })
  }
}

export { Topbar }
