import BaseMarkdownRenderer from "./baseMarkdownRenderer"
import ExportMdPlugin from "../index"
import { SiyuanDevice } from "zhi-device"
import { isDev } from "../Constants"

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

  protected async initConfig(): Promise<void> {
    await super.initConfig()
    this.notebook = "20210808180117-czj9bvb"
    const workspaceFolder = SiyuanDevice.siyuanWorkspacePath()
    this.outputFolder = SiyuanDevice.joinPath(workspaceFolder, "temp", "siyuan2md", "mkdocs-material")
    if (isDev) {
      this.notebook = "20231011174146-kexkngw"
      this.outputFolder = "/Volumes/workspace/mydocs/other-projects/mkdocs-demo/demo/docs"
    }
    this.logger.info(`mkdocs-material outputFolder => ${this.outputFolder}`)
  }

  public async renderMd() {
    return await super.renderMd()
  }
}

export default MkdocsMaterialRenderer
