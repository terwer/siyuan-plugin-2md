<script lang="ts">
  import ExportMdPlugin from "../index"
  import { onMount } from "svelte"

  export let pluginInstance: ExportMdPlugin

  // 导出配置数据
  let exportConfig = {
    notebook: "", // 选中的笔记本
    platform: "markdown", // 导出平台
    outputPath: "", // 输出路径
    includeAssets: true, // 包含资源文件
    fileNameTemplate: "${title}", // 文件名模板
  }
  let notebooks = []
  let templates = []
  // 导出状态
  let isExporting = false

  // 处理导出操作
  const handleExport = async () => {}

  //
  //   topBarElement.addEventListener("click", async (event) => {
  //     // pluginInstance.logger.info("Start syncing markdown files ...")
  //     // const startTime = Date.now()
  //     //
  //     // const markdownRender = new DefaultRenderer(pluginInstance)
  //     // // const markdownRender = new VuepressRenderer(pluginInstance)
  //     // const count = await markdownRender.doRender()
  //     //
  //     // pluginInstance.logger.info(`Synced (${count}) markdown files.`)
  //     // const endTime = Date.now()
  //     // const cost = ((endTime - startTime) / 1000.0).toFixed(2)
  //     // pluginInstance.logger.info(`Render cost: ${cost} seconds`)
  //     const menu = new Menu("exportMdMenu")
  //     const el = menu.addItem({
  //       iconHTML: "",
  //       label: "",
  //     })
  //     // 挂载内容到菜单
  //     new Export({
  //       target: el,
  //     })
  //     // 显示菜单
  //     const rect = topBarElement.getBoundingClientRect()
  //     menu.open({
  //       x: rect.right,
  //       y: rect.bottom,
  //       isLeft: true,
  //     })
  //     // createBootStrap(props, el)
  //     event.stopPropagation()
  //   })

  // lifecycle
  onMount(async () => {
    alert(1111111)
    // // 读取笔记本
    // const res = await pluginInstance.kernelApi.lsNotebooks()
    // debugger
    // notebooks = (res?.data as any)?.notebooks ?? []
  })
</script>

<div id="export-container">
  <div class="export-header">
    <h3 class="export-title">pluginInstance.i18n.export.title1</h3>
    <div class="export-divider" />
  </div>

  <!-- 笔记本选择 -->
  <div class="export-section">
    <label class="export-label">pluginInstance.i18n.export.selectNotebook</label>
    <select class="export-select" bind:value={exportConfig.notebook} disabled={isExporting}>
      {#each notebooks as notebook}
        <option value={notebook.id}>{notebook.name}</option>
      {/each}
    </select>
  </div>

  <!-- 平台选择 -->
  <div class="export-section">
    <label class="export-label">pluginInstance.i18n.export.selectFormat</label>
    <div class="export-radio-group">
      {#each ["markdown", "pdf", "html", "vuepress"] as format}
        <label class="export-radio">
          <input
            type="radio"
            name="export-format"
            value={format}
            bind:group={exportConfig.platform}
            disabled={isExporting}
          />
          pluginInstance.i18n.export.formats[format]
        </label>
      {/each}
    </div>
  </div>

  <!-- 高级设置 -->
  <div class="export-section">
    <label class="export-label">pluginInstance.i18n.export.advancedSettings</label>
    <div class="export-advanced">
      <label class="export-checkbox">
        <input type="checkbox" bind:checked={exportConfig.includeAssets} disabled={isExporting} />
        pluginInstance.i18n.export.includeAssets
      </label>

      <div class="export-path">
        <input
          type="text"
          class="export-input"
          bind:value={exportConfig.outputPath}
          placeholder="pluginInstance.i18n.export.outputPathPlaceholder"
          disabled={isExporting}
        />
        <button class="export-browse-btn" on:click={() => {}} disabled={isExporting}>
          pluginInstance.i18n.export.browse
        </button>
      </div>

      <div class="export-template">
        <label>pluginInstance.i18n.export.fileNameTemplate</label>
        <select class="export-select" bind:value={exportConfig.fileNameTemplate} disabled={isExporting}>
          {#each templates as template}
            <option value={template.value}>{template.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- 导出按钮 -->
  <button
    class="export-primary-btn"
    class:loading={isExporting}
    on:click={handleExport}
    disabled={isExporting || !exportConfig.notebook}
  >
    {#if isExporting}
      <span class="export-spinner" />
    {/if}
    pluginInstance.i18n.export.exportButton
  </button>
</div>

<style lang="stylus">
  #export-container
    min-width: 480px
    padding: 16px 24px
    font-family: "LXGW WenKai", -apple-system, sans-serif
    background: #FFFFFF
    border-radius: 8px
    box-shadow: 0 8px 24px rgba(15,15,15,0.05)

  .export-header
    margin-bottom: 24px

  .export-title
    font-size: 18px
    font-weight: 600
    margin: 0 0 8px 0
    color: #2F3437

  .export-divider
    height: 1px
    background: #EBECED
    margin: 12px 0

  .export-label
    display: block
    font-size: 14px
    font-weight: 500
    margin-bottom: 8px
    color: #646D7B

  .export-select
    width: 100%
    padding: 8px 12px
    border: 1px solid #D9DCE0
    border-radius: 6px
    background: #F5F6F8
    color: #2F3437
    font-size: 14px
    transition: all 0.2s

    &:focus
      outline: none
      border-color: #2D7FF9
      box-shadow: 0 0 0 2px rgba(45, 127, 249, 0.1)

  .export-radio-group
    display: flex
    gap: 16px
    flex-wrap: wrap

  .export-radio
    display: flex
    align-items: center
    gap: 6px
    cursor: pointer
    font-size: 14px
    color: #454D56

    input[type="radio"]
      accent-color: #2D7FF9

  .export-checkbox
    display: flex
    align-items: center
    gap: 8px
    margin-bottom: 12px
    font-size: 14px
    color: #454D56

    input[type="checkbox"]
      accent-color: #2D7FF9

  .export-input
    flex: 1
    padding: 8px 12px
    border: 1px solid #D9DCE0
    border-radius: 6px
    background: #F5F6F8
    color: #2F3437

  .export-browse-btn
    padding: 8px 16px
    background: #F5F6F8
    border: 1px solid #D9DCE0
    border-radius: 6px
    color: #454D56
    cursor: pointer
    transition: all 0.2s

    &:hover
      background: #EBECED

  .export-primary-btn
    width: 100%
    padding: 12px
    background: #2D7FF9
    color: white
    border: none
    border-radius: 8px
    font-size: 14px
    font-weight: 500
    cursor: pointer
    transition: all 0.2s
    display: flex
    align-items: center
    justify-content: center
    gap: 8px

    &:hover
      background: #1C68D3

    &:disabled
      background: #EBECED
      color: #999999
      cursor: not-allowed

  .export-spinner
    width: 18px
    height: 18px
    border: 2px solid rgba(255,255,255,0.3)
    border-top-color: white
    border-radius: 50%
    animation: spin 1s linear infinite

  @keyframes spin
    to { transform: rotate(360deg) }
</style>
