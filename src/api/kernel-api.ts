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

import { BaseApi, SiyuanData } from "./base-api"

/**
 * 思源笔记服务端API v2.8.9
 *
 * @see {@link https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md API}
 *
 * @author terwer
 * @version 0.0.1
 * @since 0.0.1
 */
class KernelApi extends BaseApi {
  /**
   * 导出markdown文本
   *
   * @param docId - 文档id
   */
  public async exportMdContent(docId: string): Promise<SiyuanData> {
    const data = {
      id: docId,
    }
    const url = "/api/export/exportMdContent"
    return await this.siyuanRequest(url, data)
  }

  public async getHPathByID(docId: string): Promise<SiyuanData> {
    const data = {
      id: docId,
    }
    const url = "/api/filetree/getHPathByID"
    return await this.siyuanRequest(url, data)
  }

  public async lsNotebooks(): Promise<SiyuanData> {
    const data = {
      flashcard: false,
    }
    const url = "/api/notebook/lsNotebooks"
    return await this.siyuanRequest(url, data)
  }

  public async getDocInfo(docId: string): Promise<SiyuanData> {
    const data = {
      id: docId,
    }
    const url = "/api/block/getDocInfo"
    return await this.siyuanRequest(url, data)
  }

  public async getDoc(docId: string, startId?: string, endId?: string, highlight = false): Promise<SiyuanData> {
    const data = {
      id: docId,
      startID: startId,
      endID: endId,
      highlight: highlight,
    }
    const url = "/api/filetree/getDoc"
    return await this.siyuanRequest(url, data)
  }
}

export default KernelApi
