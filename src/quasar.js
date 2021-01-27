import Vue from 'vue'

import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar } from 'quasar'
import {
  QMenu,
  ClosePopup,
  QFab,
  QFabAction,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSplitter,
  Notify,
  QChatMessage,
  QExpansionItem,
  QTabPanels,
  QTabPanel,
  QBtnDropdown
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  plugins: {
    Notify
  },
  components: {
    QMenu,
    QFab,
    QFabAction,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QSplitter,
    QChatMessage,
    QExpansionItem,
    QTabPanels,
    QTabPanel,
    QBtnDropdown
  },
  directives: {
    ClosePopup
  }
});
