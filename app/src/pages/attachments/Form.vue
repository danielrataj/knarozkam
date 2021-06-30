<template>
  <q-page padding>
    <h1 class="text-h4 q-mt-sm">Nová příloha</h1>

    <q-form
      @submit="onSubmit"
    >
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="general" label="Obecné" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <p>Vyberte přílohu kliknutím na "plus".</p>

              <q-uploader
                label="Příloha"
                style="max-width: 300px"
                accept="application/pdf, image/*"
                :max-files="1"
                :hide-upload-btn="true"
                :auto-upload="true"
                url="http://localhost:1337/v1/attachment"
                @uploaded="fileUploaded"
                field-name="file"
              />
            </div>
            <div class="col-12" v-if="fileUpload">
              <q-input
                filled
                v-model="form.title"
                label="Název *"
                hint="Název obrázku vám pomůže jej lépe rozlišit."
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Prosím zadejte název obrázku.']"
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div class="q-mt-lg">
        <q-btn label="Zrušit" type="reset" color="accent" flat class="q-ml-sm" :to="{ name: 'attachments.index' }" />
        <q-btn label="přidat novou přílohu" type="submit" color="secondary" v-if="fileUpload && form.fd" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'PageAttachmentForm',
  data () {
    return {
      tab: 'general',
      form: {
        title: '',
        fd: '',
        content: ''
      },
      fileUpload: false
    }
  },
  methods: {
    async onSubmit () {
      const method = 'post'
      const form = JSON.parse(JSON.stringify(this.form))

      try {
        this.$q.loading.show()

        await this.$axios[method]('/v1/attachment', form)

        this.$notify.positive({
          message: 'Přidali jsme novou přílohu.'
        })

        this.$router.push({ name: 'attachments.index' })
      } catch (error) {
        console.error(error)
        this.$notify.negative({
          message: 'Není možné přílohu nahrát. Zkuste to prosím znovu.'
        })
      } finally {
        this.$q.loading.hide()
      }
    },

    fileUploaded (info) {
      try {
        for (const file of info.files) {
          this.form.title = file.name
          this.form.fd = JSON.parse(file.xhr.response).data.fd
          break
        }

        this.fileUpload = true
      } catch (error) {
        if (error) {
          console.error(error)
          this.$notify.negative({
            message: 'Není možná nahrát přílohu. Zkuste to prosím znovu.'
          })
        }
      }
    }
  }
}
</script>
