<template>
  <div>
    <div id="result"></div>
    <div id="control">
      <div>
        <el-button @click="undoHandler"  icon="el-icon-back" circle></el-button>
        <el-button @click="redoHandler"  icon="el-icon-right" circle></el-button>
        <el-button @click="settingHandler"  icon="el-icon-setting" circle></el-button>
        <el-button @click="clearHandler" type="danger" icon="el-icon-delete" circle></el-button>
      </div>
      <div>
        <div style="display: flex;">
          <div v-for="(item, index) in colorConfigure.colors"
               :key="index"
               class="tags"
               :style="{borderColor: item.color, backgroundColor: colorActive === item.id ? item.color : '#ffffff'}"
               @click="colorClickHandler(item)"
          />
        </div>
      </div>
      <div>
        <el-button @click="refreshHandler">刷新</el-button>
        <el-button @click="convertHandler">转换</el-button>
        <el-button @click="exportHandler">导出</el-button>
      </div>
    </div>
    <div id="editor" touch-action="none"></div>
  </div>
</template>

<script>
import iink from 'iink-js'
import katex from 'katex/dist/katex.min'
import saveAs from 'save-as'
import { mapState } from 'vuex'
import uToolsUtils from '@/utils/uToolsUtils'
export default {
  data () {
    return {
      editorElement: undefined,
      resultElement: undefined,
      colorActive: 1,
      exportFileType: {
        png: {
          mimeType: 'image/png',
          transform: this.base64toBlob,
          name: 'PNG',
          extension: 'png'
        },
        jpeg: {
          mimeType: 'image/jpeg',
          transform: this.base64toBlob,
          name: 'JPEG',
          extension: 'jpg'
        }
      }
    }
  },
  computed: {
    ...mapState(['keys', 'colorConfigure'])
  },
  created () {
    if (window.utools) {
      // eslint-disable-next-line no-undef
      utools.onPluginOut(() => {
        window.saveALL()
      })
      // eslint-disable-next-line no-undef
      utools.onPluginEnter(({ code, type, payload, optional }) => {
        uToolsUtils.readAll()
        if (!this.keys.applicationKey || !this.keys.HMACKey) {
          this.$router.replace({ name: 'setting' })
          this.$message.warning('需要设置 key')
          return
        }
        this.register()
      })
    }
  },
  mounted () {

  },
  methods: {
    colorClickHandler (item) {
      this.colorActive = item.id
      this.editor.penStyle = {
        color: item.color,
        '-myscript-pen-width': 1
      }
    },
    refreshHandler () {
      this.register()
    },
    register () {
      this.editorElement = document.getElementById('editor')
      this.resultElement = document.getElementById('result')
      console.log(this.keys.applicationKey)
      console.log(this.keys.HMACKey)
      const configuration = {
        recognitionParams: {
          type: 'MATH',
          protocol: 'WEBSOCKET',
          server: {
            applicationKey: this.keys.applicationKey,
            hmacKey: this.keys.HMACKey
          }
        },
        iink: {
          math: {
            mimeTypes: ['application/x-latex', 'application/vnd.myscript.jiix']
          },
          export: {
            jiix: {
              strokes: true
            }
          },
          text: {
            smartGuide: true
          }
        }
      }
      this.editorElement.addEventListener('exported', (evt) => {
        const exports = evt.detail.exports
        console.log(evt.detail)
        if (exports && exports['application/x-latex']) {
          // convertElement.disabled = false
          katex.render(this.cleanLatex(exports['application/x-latex']), this.resultElement)
          // resultElement.innerHTML = '<span>' + exports['application/x-latex'] + '</span>';
        } else if (exports && exports['application/mathml+xml']) {
          // convertElement.disabled = false
          this.resultElement.innerText = exports['application/mathml+xml']
        } else if (exports && exports['application/mathofficeXML']) {
          // convertElement.disabled = false
          this.resultElement.innerText = exports['application/mathofficeXML']
        } else {
          // convertElement.disabled = true
          this.resultElement.innerHTML = ''
        }
        console.log(this.resultElement.querySelector('math'))
        if (!this.resultElement.querySelector('math')) {
          this.resultElement.innerHTML = ''
        }
        const fileType = this.exportFileType.png
        if (evt.detail && evt.detail.exports && evt.detail.exports[fileType.mimeType]) {
          saveAs(this.base64toBlob(evt.detail.exports[this.exportFileType.png.mimeType], this.exportFileType.png.mimeType), `${Date.now()}.${this.exportFileType.png.extension}`)
        }
      })
      this.editor = iink.register(this.editorElement, configuration)
      this.colorActive = 1
    },
    settingHandler () {
      this.$router.push({ name: 'setting' })
    },
    exportHandler () {
      // const mimeType = this.exportFileType.png.mimeType
      // this.editorElement.editor.export_([mimeType, 'application/vnd.myscript.jiix'])
      this.editorElement.editor.export_()
    },
    convertHandler () {
      this.editorElement.editor.convert()
    },
    redoHandler () {
      this.editorElement.editor.redo()
    },
    undoHandler () {
      this.editorElement.editor.undo()
    },
    clearHandler () {
      this.editorElement.editor.clear()
    },
    toBlob (data, mimeType) {
      return new Blob([data], { type: mimeType })
    },
    base64toBlob (data, mimeType) {
      const byteCharacters = window.atob(data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return this.toBlob(byteArray, mimeType)
    },
    cleanLatex (latexExport) {
      if (latexExport.includes('\\\\')) {
        const steps = '\\begin{align*}' + latexExport + '\\end{align*}'
        return steps.replace('\\begin{aligned}', '')
          .replace('\\end{aligned}', '')
          .replace(new RegExp('(align.{1})', 'g'), 'aligned')
      }
      return latexExport
        .replace(new RegExp('(align.{1})', 'g'), 'aligned')
    }
  }
}
</script>

<style scoped>
.tags {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid;
  margin: 12px;
}
#editor {
  width: 90vw;
  height: 70vh;
}
#result {
  height: 100px;
  max-height: 100px;
  overflow-y: auto;
  border-bottom: 1px dashed #ccc;
}
#control {
  border-bottom: 1px dashed #ccc;
  height: 66px;
  line-height: 66px;
  display: flex;
  justify-content: space-between;
}
</style>
