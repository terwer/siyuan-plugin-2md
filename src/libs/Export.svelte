<script lang="ts">
  import ExportMdPlugin from "../index"
  import { onMount } from "svelte"
  import { StrUtil } from "zhi-common"
  import PlatformType from "../models/PlatformType"

  export let pluginInstance: ExportMdPlugin

  // 导出配置数据
  let exportConfig = {
    notebook: "",
    outputFolder: "",
    fixTitle: true,
    linkAsPlainText: false,
    basePath: "/",
    assetFolder: "/assets",
    platform: PlatformType.MKDOCS,
  }

  let notebooks = []
  // 平台选项数据（使用枚举）
  const platforms = [
    { id: PlatformType.HEXO, name: "Hexo", icon: "🌍" },
    { id: PlatformType.HUGO, name: "Hugo", icon: "⚡" },
    { id: PlatformType.MKDOCS, name: "MkDocs", icon: "📘" },
    { id: PlatformType.VITEPRESS, name: "VitePress", icon: "🚀" },
    { id: PlatformType.DEFAULT, name: "Default", icon: "📁" },
  ]
  let isAdvancedOpen = false // 高级设置展开状态
  let isExporting = false

  // 处理文件夹选择
  const handleBrowse = async () => {
    // const path = await pluginInstance.showFolderDialog()
    // if (path) exportConfig.outputFolder = path
  }

  const handleExport = async () => {
    switch (exportConfig.platform) {
      case PlatformType.HEXO:
        // Hexo专用处理逻辑
        break
      case PlatformType.HUGO:
        // Hugo专用处理逻辑
        break
      // ...其他平台处理
    }
  }

  // lifecycle
  onMount(async () => {
    // 读取配置
    // 读取笔记本
    const res = await pluginInstance.kernelApi.lsNotebooks()
    notebooks = (res?.data as any)?.notebooks ?? []
    if (StrUtil.isEmptyString(exportConfig.notebook)) {
      exportConfig.notebook = notebooks[0]?.id
    }
  })
</script>

<div id="export-container">
  <!-- 紧凑型标题 -->
  <div class="header-group">
    <h3 class="title">{pluginInstance.i18n.export.title}</h3>
    <div class="divider" />
  </div>

  <!-- 基础设置 -->
  <div class="form-group">
    <!-- 笔记本选择 -->
    <div class="form-row">
      <label class="label">{pluginInstance.i18n.export.selectNotebook}</label>
      <select class="select" bind:value={exportConfig.notebook}>
        {#each notebooks as notebook}
          <option value={notebook.id}>{notebook.name}</option>
        {/each}
      </select>
    </div>

    <!-- 导出路径 -->
    <div class="form-row">
      <label class="label">{pluginInstance.i18n.export.outputPath}</label>
      <div class="path-input-group">
        <input
          type="text"
          class="input"
          bind:value={exportConfig.outputFolder}
          placeholder={pluginInstance.i18n.export.outputPathPlaceholder}
        />
        <button class="browse-btn" on:click={handleBrowse}>
          {pluginInstance.i18n.export.browse}
        </button>
      </div>
    </div>
  </div>

  <!-- 新增平台选择 -->
  <div class="platform-group">
    <label class="section-label">{pluginInstance.i18n.export.selectPlatform}</label>
    <div class="platform-options">
      {#each platforms as platform}
        <label class="platform-card" data-selected={exportConfig.platform === platform.id}>
          <input
            type="radio"
            name="platform"
            value={platform.id}
            bind:group={exportConfig.platform}
            class="platform-radio"
          />
          <div class="platform-content">
            <span class="platform-icon">{platform.icon}</span>
            <span class="platform-name">{platform.name}</span>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- 开关选项 -->
  <div class="switch-group">
    <label class="switch-item">
      <div class="switch-container">
        <input type="checkbox" bind:checked={exportConfig.fixTitle} class="switch-input" />
        <span class="slider round" />
      </div>
      <span class="label-text">{pluginInstance.i18n.export.fixTitle}</span>
    </label>

    <label class="switch-item">
      <div class="switch-container">
        <input type="checkbox" bind:checked={exportConfig.linkAsPlainText} class="switch-input" />
        <span class="slider round" />
      </div>
      <span class="label-text">{pluginInstance.i18n.export.linkAsPlainText}</span>
    </label>
  </div>

  <!-- 可折叠高级设置 -->
  <div class="advanced-group">
    <div class="toggle-header" on:click={() => (isAdvancedOpen = !isAdvancedOpen)}>
      <span class="toggle-icon">{isAdvancedOpen ? "▼" : "▶"}</span>
      {pluginInstance.i18n.export.advancedSettings}
    </div>

    {#if isAdvancedOpen}
      <div class="advanced-content">
        <div class="form-row">
          <label class="label">{pluginInstance.i18n.export.basePath}</label>
          <input type="text" class="input" bind:value={exportConfig.basePath} />
        </div>
        <div class="form-row">
          <label class="label">{pluginInstance.i18n.export.assetFolder}</label>
          <input type="text" class="input" bind:value={exportConfig.assetFolder} />
        </div>
      </div>
    {/if}
  </div>

  <!-- 导出按钮 -->
  <button class="export-btn" on:click={handleExport}>
    {pluginInstance.i18n.export.exportButton}
  </button>
</div>

<style lang="stylus">
  // 基础样式
  #export-container
    width: 480px
    padding: 16px
    font-size: 14px
    background: #fff
    color: #333
    border-radius: 8px
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)

  .form-group
    margin: 12px 0

  .form-row
    display: grid
    grid-template-columns: 100px 1fr
    align-items: center
    gap: 8px
    margin: 8px 0

  .path-input-group
    display: flex
    gap: 8px

  /* 新增平台组件样式 */
  .platform-group {
    margin: 20px 0;
    padding: 0;

    .section-label {
      display: block;
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 500;
      color: #4a4a4a;
    }

    .platform-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .platform-card {
      flex: 1 1 160px;
      min-height: 80px;
      border: 1px solid #e3e8ef;
      border-radius: 8px;
      padding: 16px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        background: #f1f5f9;
      }

      &[data-selected="true"] {
        border-color: #3b82f6;
        background: #eff6ff;
        box-shadow: inset 0 0 0 1px #3b82f6;

        &::after {
          content: "✓";
          position: absolute;
          right: 8px;
          top: 8px;
          color: #3b82f6;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.9);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .platform-radio {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .platform-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .platform-icon {
      font-size: 28px;
      line-height: 1;
    }

    .platform-name {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: 0.5px;
    }
  }

  // 开关组件样式
  .switch-group
    display: flex
    flex-direction: column
    gap: 12px
    margin: 12px 0
    padding: 12px 0
    border-top: 1px solid #eee
    border-bottom: 1px solid #eee

  .switch-item
    display: flex
    align-items: center
    gap: 10px
    cursor: pointer
    padding: 4px 0
    user-select: none

  .switch-container
    position: relative
    display: inline-block
    width: 36px
    height: 20px

  .switch-input
    opacity: 0
    width: 0
    height: 0

  .slider
    position: absolute
    cursor: pointer
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: #ccc
    transition: .3s ease
    border-radius: 34px

    &::before
      position: absolute
      content: ""
      height: 16px
      width: 16px
      left: 2px
      bottom: 2px
      background-color: white
      transition: .3s ease
      border-radius: 50%

  .switch-input:checked + .slider
    background-color: #007bff

  .switch-input:checked + .slider::before
    transform: translateX(16px)

  .label-text
    font-size: 14px
    color: #333

  // 高级设置
  .advanced-group
    margin: 12px 0

  .toggle-header
    display: flex
    align-items: center
    gap: 4px
    color: #666
    cursor: pointer
    user-select: none

  .advanced-content
    margin-top: 8px
    padding: 8px
    background: #f8f9fa
    border-radius: 4px

  // 导出按钮
  .export-btn
    width: 100%
    margin-top: 16px
    padding: 10px
    background: #007bff
    color: white
    border: none
    border-radius: 4px
    cursor: pointer
    transition: background 0.2s

    &:hover
      background: #0069d9

  // 输入框样式
  .input, .select
    background: #fff
    border: 1px solid #ddd

  // 暗黑模式全局适配
  :global(html[data-theme-mode="dark"]) {
    #export-container {
      background: #2a2a2a;
      color: #e0e0e0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .switch-group {
      border-top-color: #444;
      border-bottom-color: #444;
    }

    .slider {
      background-color: #555;
      &::before {
        background-color: #ddd;
      }
    }

    .switch-input:checked + .slider {
      background-color: #1a73e8;
    }

    .label-text {
      color: #e0e0e0;
    }

    .toggle-header {
      color: #999;
    }

    .advanced-content {
      background: #363636;
    }

    .export-btn {
      background: #1a73e8;
      &:hover {
        background: #1557b0;
      }
    }

    .input, .select {
      background: #404040;
      border-color: #555;
      color: #e0e0e0;
    }

    .platform-group {
      .section-label {
        color: #e2e8f0;
      }

      .platform-card {
        border-color: #334155;
        background: #1e293b;

        &:hover {
          background: #2d3748;
        }

        &[data-selected="true"] {
          border-color: #60a5fa;
          background: rgba(30, 58, 138, 0.3);
          box-shadow: inset 0 0 0 1px #60a5fa;

          &::after {
            color: #60a5fa;
            background: rgba(30, 41, 59, 0.9);
          }
        }
      }

      .platform-name {
        color: #f8fafc;
      }
    }
  }
</style>
