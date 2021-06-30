<template>
  <q-page padding>
    <div class="row q-gutter-md">
      <div class="col-12">
        <div class="text-h6">Přílohy</div>
      </div>
      <div class="col-12">
        <q-list bordered separator v-if="attachments.length">
          <q-item
            v-for="template in attachments"
            :key="template.id"
          >
            <q-item-section side>
              <q-btn color="red" size="sm" round icon="delete" @click="deleteAttachment(template)" />
            </q-item-section>
            <q-item-section thumbnail v-if="template.content" class="q-pa-sm">
              <img :src="`${template.content}`" height="100" />
            </q-item-section>
            <q-item-section>
              {{ template.title }}
            </q-item-section>
          </q-item>
        </q-list>
        <p v-else>
          Momentálně zde nejsou žádné přílohy. Zkuste nahrát první kliknutím na ikonu vpravo dole.
        </p>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" type="a" :to="{ name: 'attachments.add' }" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'PageAttachmentIndex',
  data () {
    return {
      attachments: []
    }
  },
  async created () {
    await this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        this.$q.loading.show()

        this.attachments = await this.$axios.get('/v1/attachment').then((response) => response.data)
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

    async deleteAttachment (item) {
      try {
        this.$q.loading.show()

        await this.$axios.delete(`/v1/attachment/${item.id}`).then((response) => response.data)

        await this.fetchData()
      } catch (error) {
        console.error(error)

        if (error) {
          this.$notify.negative({
            message: 'Není možné přílohu smazat. Zkuste to prosím znovu.'
          })
        }
      } finally {
        this.$q.loading.hide()
      }
    }
  }
}
</script>
