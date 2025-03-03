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
  // 平台选项数据（增加disabled属性）
  const platforms = [
    { id: PlatformType.DEFAULT, name: "通用MD", icon: "📁", disabled: false },
    { id: PlatformType.MKDOCS, name: "MkDocs", icon: "📘", disabled: false },
    { id: PlatformType.HEXO, name: "Hexo", icon: "🌍", disabled: true },
    { id: PlatformType.HUGO, name: "Hugo", icon: "⚡", disabled: true },
    { id: PlatformType.VITEPRESS, name: "VitePress", icon: "🚀", disabled: true },
  ]
  let isAdvancedOpen = false
  let isExporting = false

  const handleBrowse = async () => {}

  const handleExport = async () => {
    switch (exportConfig.platform) {
      case PlatformType.HEXO:
        break
      case PlatformType.HUGO:
        break
    }
  }

  onMount(async () => {
    const res = await pluginInstance.kernelApi.lsNotebooks()
    notebooks = (res?.data as any)?.notebooks ?? []
    if (StrUtil.isEmptyString(exportConfig.notebook)) {
      exportConfig.notebook = notebooks[0]?.id
    }
  })
</script>

<div id="export-container">
  <div class="header-group">
    <h3 class="title">{pluginInstance.i18n.export.title}</h3>
    <div class="divider" />
  </div>

  <div class="form-group">
    <div class="form-row">
      <label class="label">{pluginInstance.i18n.export.selectNotebook}</label>
      <select class="select" bind:value={exportConfig.notebook}>
        {#each notebooks as notebook}
          <option value={notebook.id}>{notebook.name}</option>
        {/each}
      </select>
    </div>

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

  <div class="platform-group">
    <label class="section-label">{pluginInstance.i18n.export.selectPlatform}</label>
    <div class="platform-options">
      {#each platforms as platform}
        <div
          class="platform-card"
          data-disabled={platform.disabled}
          data-selected={exportConfig.platform === platform.id}
        >
          <input
            type="radio"
            name="platform"
            value={platform.id}
            bind:group={exportConfig.platform}
            class="platform-radio"
            disabled={platform.disabled}
          />
          <span class="platform-content">
            <span class="platform-icon">{platform.icon}</span>
            <span class="platform-name">{platform.name}</span>
          </span>
        </div>
      {/each}
    </div>
  </div>

  <div class="switch-group">
    <div class="switch-item">
      <div class="switch-container">
        <input type="checkbox" bind:checked={exportConfig.fixTitle} class="switch-input" />
        <span class="slider round" />
      </div>
      <span class="label-text">{pluginInstance.i18n.export.fixTitle}</span>
    </div>

    <label class="switch-item">
      <div class="switch-container">
        <input type="checkbox" bind:checked={exportConfig.linkAsPlainText} class="switch-input" />
        <span class="slider round" />
      </div>
      <span class="label-text">{pluginInstance.i18n.export.linkAsPlainText}</span>
    </label>
  </div>

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

  <button class="export-btn" on:click={handleExport}>
    {pluginInstance.i18n.export.exportButton}
  </button>
</div>

<style lang="stylus">
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
    input
      width 100%

  .platform-group {
    margin: 12px 0;
    padding: 0;

    .section-label {
      display: block;
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 500;
      color: #4a4a4a;
    }

    .platform-options {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }

    .platform-card {
      min-height: 32px;
      border: 1px solid #e3e8ef;
      border-radius: 6px;
      padding: 8px;
      background: #f8fafc;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;
      min-width: 0;

      &[data-disabled="true"] {
        pointer-events: none;
        opacity: 0.6;
        background: #f5f5f5;
        border-color: #e0e0e0;

        .platform-icon, .platform-name {
          opacity: 0.7;
        }
      }

      &:not([data-disabled="true"]):hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      &[data-selected="true"] {
        border: 2px solid #3b82f6;
        background: #eff6ff;
        animation: card-selected 0.3s ease;

        &::after {
          content: "✓";
          position: absolute;
          right: 4px;
          top: 4px;
          color: #3b82f6;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.9);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &[data-disabled="true"] {
          background: #f0f0f0;
          border-color: #d9d9d9;
          &::after {
            color: #999;
            background: rgba(255,255,255,0.7);
          }
        }
      }
    }

    .platform-radio {
      position: absolute;
      opacity: 0;
    }

    .platform-content {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .platform-icon {
      font-size: 20px;
    }

    .platform-name {
      font-size: 12px;
      white-space: nowrap;
      color: #333;
    }
  }

  @keyframes card-selected {
    0% { transform: scale(0.98); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .switch-group
    display: flex
    flex-direction: row
    gap: 32px
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

  .input, .select
    background: #fff
    border: 1px solid #ddd

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

        &[data-disabled="true"] {
          background: #404040;
          border-color: #555;
          color: #888;

          &[data-selected="true"] {
            background: #4a4a4a;
            border-color: #666;
          }
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
