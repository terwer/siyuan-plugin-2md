import RenderOptions from "../models/renderOptions"
import PlatformType from "../models/PlatformType"
import MkdocsMaterialRenderer from "./mkdocsMaterialRenderer"
import DefaultRenderer from "./defaultRenderer"

/**
 * 导出服务
 *
 * @author terwer
 * @since 1.0.0
 */
class ExportService {
  private readonly pluginInstance: any
  constructor(pluginInstance: any) {
    this.pluginInstance = pluginInstance
  }

  public async doExport(exportConfig: any) {
    const type = exportConfig.type
    let count = 0
    let markdownRender = null
    switch (type) {
      case PlatformType.MKDOCS: {
        markdownRender = new MkdocsMaterialRenderer(this.pluginInstance)
        break
      }
      default: {
        markdownRender = new DefaultRenderer(this.pluginInstance)
      }
    }
    const opts = new RenderOptions()
    opts.exportMode = exportConfig.exportMode
    opts.notebook = exportConfig.notebook
    opts.homePageId = exportConfig.homePageId
    opts.outputFolder = exportConfig.outputFolder
    opts.basePath = exportConfig.basePath
    opts.assetFolder = exportConfig.assetFolder
    opts.fixTitle = exportConfig.fixTitle
    opts.linkAsPlainText = exportConfig.linkAsPlainText
    this.pluginInstance.logger.info(`Start syncing markdown files => ${opts.outputFolder}`)
    markdownRender.setOpts(opts)
    count = await markdownRender.doRender()
    return count
  }
}

export default ExportService
