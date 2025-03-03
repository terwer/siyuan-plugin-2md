import BaseMarkdownRenderer from "./baseMarkdownRenderer"
import ExportMdPlugin from "../index"
import { SiyuanDevice } from "zhi-device"
import { isDev } from "../Constants"
import RenderOptions from "../models/renderOptions"

/**
 * Markdown渲染器
 *
 * @author terwer
 * @since 1.0.0
 */
class MkdocsMaterialRenderer extends BaseMarkdownRenderer {
  constructor(pluginInstance: ExportMdPlugin) {
    super(pluginInstance)
  }

  protected async initConfig(opts: RenderOptions): Promise<void> {
    await super.initConfig(opts)
    const notebook = "20210808180117-czj9bvb"
    const workspaceFolder = SiyuanDevice.siyuanWorkspacePath()
    const outputFolder = SiyuanDevice.joinPath(workspaceFolder, "temp", "siyuan2md", "mkdocs-material")
    opts.notebook = notebook
    opts.outputFolder = outputFolder
    if (isDev) {
      opts.notebook = "20231011174146-kexkngw"
      opts.outputFolder = "/Volumes/workspace/mydocs/other-projects/mkdocs-demo/demo/docs"
    }
    this.logger.info(`mkdocs-material outputFolder => ${opts.outputFolder}`)
  }

  public async renderMd() {
    return await super.renderMd()
  }
}

export default MkdocsMaterialRenderer
