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
import VuepressRenderer from "./service/vuepressRenderer"
import DefaultRenderer from "./service/defaultRenderer"

/**
 * 顶栏按钮
 *
 * @param pluginInstance - 插件实例
 * @author terwer
 * @version 0.0.1
 * @since 0.0.1
 */
export async function initTopbar(pluginInstance: ExportMdPlugin) {
  const topBarElement = pluginInstance.addTopBar({
    icon: icons.icon2md,
    title: pluginInstance.i18n.exportMd,
    position: "right",
    callback: () => {},
  })

  topBarElement.addEventListener("click", async (event) => {
    pluginInstance.logger.info("Start syncing markdown files ...")
    const startTime = Date.now()

    const markdownRender = new DefaultRenderer(pluginInstance)
    // const markdownRender = new VuepressRenderer(pluginInstance)
    const count = await markdownRender.doRender()

    pluginInstance.logger.info(`Synced (${count}) markdown files.`)
    const endTime = Date.now()
    const cost = ((endTime - startTime) / 1000.0).toFixed(2)
    pluginInstance.logger.info(`Render cost: ${cost} seconds`)

    event.stopPropagation()
  })
}
