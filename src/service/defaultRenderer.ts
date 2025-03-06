import BaseMarkdownRenderer from "./baseMarkdownRenderer"
import ExportMdPlugin from "../index"
import { SiyuanDevice } from "zhi-device"
import { isDev } from "../Constants"
import RenderOptions from "../models/renderOptions"
import { StrUtil } from "zhi-common"

/**
 * Markdown渲染器
 *
 * @author terwer
 * @since 1.0.0
 */
class DefaultRenderer extends BaseMarkdownRenderer {
  constructor(pluginInstance: ExportMdPlugin) {
    super(pluginInstance)
  }

  protected async initConfig(opts: RenderOptions): Promise<void> {
    await super.initConfig(opts)
    const notebook = "20210808180117-czj9bvb"
    const workspaceFolder = SiyuanDevice.siyuanWorkspacePath()
    const outputFolder = SiyuanDevice.joinPath(workspaceFolder, "temp", "siyuan2md", "default")
    if (StrUtil.isEmptyString(opts.notebook)) {
      opts.notebook = notebook
    }
    if (StrUtil.isEmptyString(opts.outputFolder)) {
      opts.outputFolder = outputFolder
    }
    this.logger.info(`default outputFolder => ${opts.outputFolder}`)
  }

  protected async renderMd() {
    return await super.renderMd()
  }
}

export default DefaultRenderer
