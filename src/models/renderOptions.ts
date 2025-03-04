import ExportMode from "./ExportMode"

/**
 * 偏好设置
 *
 * @author terwer
 * @since 1.0.0
 */
class RenderOptions {
  /**
   * 导出模式
   */
  exportMode: ExportMode = ExportMode.NOTEBOOK
  /**
   * 笔记本ID
   */
  public notebook: string
  /**
   * 首页
   */
  public homePageId: string
  /**
   * 输出文件夹
   */
  public outputFolder: string
  /**
   * 是否移除标题序号
   */
  public fixTitle: boolean
  /**
   * 链接是否忽略，展示为纯文本
   */
  public linkAsPlainText: boolean
  /**
   *  文档跟根路径
   *  const basePath = "/"
   */
  public basePath: string
  /**
   * 资源文件夹
   * const assetFolder = "/assets"
   */
  public assetFolder: string
}

export default RenderOptions
