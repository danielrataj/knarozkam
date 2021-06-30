<template>
  <q-page padding>
    <div class="row q-gutter-md">
      <div class="col-12">
        <div class="text-h6">Lidé</div>
        <div class="subtitle">Maximálně můžete vložit 500 záznamů.</div>
      </div>
      <div class="col-12">
        <hot-table
          :data="tableData"
          :rowHeaders="true"
          :colHeaders="true"
          :licenseKey="licenseKey"
          ref="hotTableComponent"
        >
          <hot-column title="Odesílatel" />
          <hot-column title="Jméno" />
          <hot-column title="Příjmení" />
          <hot-column title="E-mail" />
          <hot-column title="Den" type="numeric" />
          <hot-column title="Měsíc" type="numeric" />
          <hot-column title="Hodina" type="numeric" />
          <hot-column title="Minuta" type="numeric" />
          <hot-column title="Pohlaví" editor="select" :selectOptions="gender" />
          <hot-column title="Předmět" />
          <hot-column title="Oslovení" />
          <hot-column title="Text" />
          <hot-column title="Podpis" />
          <hot-column title="Příloha" editor="select" :selectOptions="attachments" />
          <hot-column title="Poznámka" />
        </hot-table>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="save" color="secondary" @click="save" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Handsontable from 'handsontable'
import { HotTable, HotColumn } from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'

export default {
  name: 'PageImageIndex',
  components: {
    HotTable,
    HotColumn
  },
  data () {
    return {
      licenseKey: 'non-commercial-and-evaluation',
      tableData: Handsontable.helper.createEmptySpreadsheetData(500),
      id: '',
      dataSet: {},
      loading: {
        data: false
      },
      gender: [
        'm', 'ž'
      ],
      attachments: []
    }
  },
  async created () {
    await this.fetchData()
    await this.fetchAttachments()
  },
  methods: {
    async fetchData () {
      try {
        this.$q.loading.show()

        const item = await this.$axios.get('/v1/datatable', {
          where: {
            version: 1
          }
        }).then((response) => response.data)

        if (item.length) {
          this.id = item[0].id
          this.dataSet = item[0].data

          if (this.dataSet) {
            this.dataSet = JSON.parse(this.dataSet)

            this.$refs.hotTableComponent.hotInstance.loadData(this.dataSet)
            this.$refs.hotTableComponent.hotInstance.validateCells()
          }
        }
      } catch (error) {
        console.error(error)

        if (error) {
          this.$notify.negative({
            message: 'Není možné nahrát data. Zkuste to prosím znovu.'
          })
        }
      } finally {
        this.$q.loading.hide()
      }
    },

    async fetchAttachments () {
      try {
        const attachments = await this.$axios.get('/v1/attachment?select=title').then((response) => response.data)

        for (const attachment of attachments) {
          this.attachments.push(attachment.title)
        }
      } catch (error) {
        console.error(error)

        if (error) {
          this.$notify.negative({
            message: 'Není možné nahrát data. Zkuste to prosím znovu.'
          })
        }
      }
    },

    async save () {
      try {
        this.$q.loading.show()
        const data = this.$refs.hotTableComponent.hotInstance.getData()

        await this.$axios.patch(`/v1/datatable/${this.id}`, {
          data: JSON.stringify(data)
        }).then((response) => response.data)

        this.$notify.positive({
          message: 'Informace jsme uložili.'
        })
      } catch (error) {
        console.error(error)

        if (error) {
          this.$notify.negative({
            message: 'Není možné stránku s údaji uložit. Zkuste to prosím znovu.'
          })
        }
      } finally {
        this.$q.loading.hide()
      }
    }
  }
}
</script>
