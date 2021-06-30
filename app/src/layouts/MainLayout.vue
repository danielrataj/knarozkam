<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>K narozkám</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item
          clickable
          tag="a"
          :to="{ name: 'dashboard' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Domů</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list>
        <q-item
          clickable
          tag="a"
          :to="{ name: 'people.index' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="group" />
          </q-item-section>

          <q-item-section>
            <q-item-label ref="guide-checks">
              Lidé
            </q-item-label>
            <q-item-label caption>
              seznam osob a narozenin
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          :to="{ name: 'attachments.index' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="attachment" />
          </q-item-section>

          <q-item-section>
            <q-item-label ref="guide-checks">
              Přílohy
            </q-item-label>
            <q-item-label caption>
              spravuj přílohy
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="fixed-bottom q-mb-md text-center">
        <q-img
          src="logo/favicon_1024_1024.png"
          style="max-width: 200px"
          basic
          contain
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      documentTitle: ''
    }
  },
  async created () {
    this.documentTitle = document.title
  }
}
</script>
