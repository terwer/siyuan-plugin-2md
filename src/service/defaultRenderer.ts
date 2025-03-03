import BaseMarkdownRenderer from "./baseMarkdownRenderer"
import ExportMdPlugin from "../index"

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

  public async renderMd() {
    const startTime = Date.now()
    const count = await super.renderMd()
    const endTime = Date.now()
    const cost = ((endTime - startTime) / 1000.0).toFixed(2)
    this.logger.info(`Render cost: ${cost} seconds`)
    return count
  }
}

export default DefaultRenderer
