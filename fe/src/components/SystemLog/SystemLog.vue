<script lang="jsx">
import LogPresenter from '@/components/SystemLog/LogPresenter.vue';
import {systemAPI} from '@/api'
import dayjs from 'dayjs';
import {ref, onMounted} from 'vue';

export default {
  name: 'SystemLog',
  components: {LogPresenter},
  setup() {
    const logSetting = ref({ })
    const logFiles = ref([])
    const logFile = ref()
    const logContent = ref()

    // log present
    const showErrorOnly = ref()
    const fallback = ref()
    const filter = ref('')

    onMounted(async () => {
      logSetting.value = await systemAPI.getLogSetting();
      logFiles.value = await systemAPI.getLogs();
    })

    async function showLogFile(file) {
      logFile.value = file
      logContent.value = await systemAPI.getLog(file);
    }

    async function setLogEnable(enable) {
      await systemAPI.updateLogSetting({enable})
    }

    return () => <div class="h-100 w-100 bc:rgb(246,248,250)">
      <div class="fr ai-c h-50px px-2" style="border-bottom: 1px solid #ddd">
        <t-switch v-model={logSetting.value.enableLog} onUpdate:modelValue={setLogEnable} label="Enable Log"/>
      </div>
      <div class="fr" style="height: calc(100% - 50px);">
        <div style="width: 160px; border-right: 1px solid #ddd" class="ovf-y-s hide-scroll-bar">
          {
            logFiles.value.map(logFile =>
              <div style="padding: 5px 10px; border-bottom: 1px solid #ddd; font-size: 12px; cursor: pointer;"
                   onClick={() => showLogFile(logFile)}>
                {dayjs(logFile).format('YYYY-MM-DD HH:mm:ss')}
              </div>)
          }
        </div>
        <div class="f1">
          {logFile.value && <div style="height: 41px; border-bottom: 1px solid #ddd" class="fr ai-c fg-12px pl-1 pr-3 py-1">
            <span class="fw-700">File:</span> {dayjs(logFile.value).format('YYYY-MM-DD HH:mm:ss')}
            <t-spacer/>
            <t-switch v-model={showErrorOnly.value} label="Error only"/>
            <t-switch v-model={fallback.value} label="Fallback"/>
            <t-text v-model={filter.value} placeholder="Filter"/>
          </div>}
          { (!!logContent.value) && <log-presenter
              class="ovf-y-s hide-scroll-bar"
              style="height: calc(100% - 41px);"
              filter={filter.value}
              content={logContent.value}
              showErrorOnly={showErrorOnly.value}
              fallback={fallback.value}/> }
        </div>
      </div>
    </div>
  }
}
</script>
