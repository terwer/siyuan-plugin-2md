import BaseMarkdownRenderer from "./baseMarkdownRenderer"
import ExportMdPlugin from "../index"
import { SiyuanDevice } from "zhi-device"
import { isDev } from "../Constants"
import RenderOptions from "./renderOptions"

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
    opts.notebook = notebook
    opts.outputFolder = outputFolder
    if (isDev) {
      opts.notebook = "20231011174146-kexkngw"
      opts.outputFolder = "/Volumes/workspace/mydocs/other-projects/mkdocs-demo/demo/docs"
    }
    this.logger.info(`default outputFolder => ${opts.outputFolder}`)
  }

  protected async renderMd() {
    return await super.renderMd()
  }
}

export default DefaultRenderer
