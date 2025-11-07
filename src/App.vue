<template>
  <div class="app">
    <h1 class="text-center my-4">Aplicatie Cheltuieli</h1>

    <div class="mx-5 mb-4">
      <div class="row g-3">
        <div class="col-md-3 col-sm-6" v-for="card in summaryCards" :key="card.label">
          <div class="summary-card text-left">
            <div class="icon mb-2" v-html="card.icon"></div>
            <div class="fw-bold">
              <h4 style="font-weight: bold">{{ card.label }}</h4>
            </div>
            <div class="fs-5 mt-1">
              <strong>{{ card.total }} RON</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mx-5">
      <div class="card-body">
        <h5 class="fw-bold mb-4">+ Adauga Cheltuiala Noua</h5>

        <div class="row g-3 align-items-center">
          <div class="col-lg-3 col-md-6">
            <input
              type="text"
              class="form-control"
              v-model="denumire"
              placeholder="Denumire cheltuiala"
              :class="{ 'is-invalid': showErrors && !denumire }"
            />
          </div>

          <div class="col-lg-3 col-md-6">
            <input
              type="number"
              class="form-control"
              v-model.number="suma"
              placeholder="Suma (RON)"
              :class="{ 'is-invalid': showErrors && (!suma || suma <= 0) }"
            />
          </div>

          <div class="col-lg-3 col-md-6">
            <select
              class="form-select"
              v-model="categorie"
              :class="{ 'is-invalid': showErrors && !categorie }"
            >
              <option disabled selected value="">Selecteaza categoria</option>
              <option value="Mancare">Mancare</option>
              <option value="Transport">Transport</option>
              <option value="Divertisment">Divertisment</option>
            </select>
          </div>

          <div class="col-lg-3 col-md-6">
            <input
              type="date"
              class="form-control"
              v-model="data"
              :class="{ 'is-invalid': showErrors && !data }"
            />
          </div>

          <div class="col-lg-3 col-md-12 text-end">
            <button class="btn btn-primary w-100" @click="adaugaCheltuiala">
              Adauga cheltuiala
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</div>
      </div>
    </div>

    <br /><br />

    <div class="card mx-5 mt-4 shadow-sm border-0">
      <div class="card-body d-flex justify-content-between">
        <h4 class="fw-bold mb-0">📋 Istoric Cheltuieli</h4>
        <div class="d-flex gap-2">
          <select
            class="form-select form-select-sm"
            v-model="selectedCategory"
            style="width: 160px"
          >
            <option value="">Toate categoriile</option>
            <option value="Mancare">Mancare</option>
            <option value="Transport">Transport</option>
            <option value="Divertisment">Divertisment</option>
          </select>

          <select class="form-select form-select-sm" v-model="sortType" style="width: 150px">
            <option value="data-desc">Sorteaza dupa data desc.</option>
            <option value="data-asd">Sorteaza dupa data asc.</option>
            <option value="suma-desc">Sorteaza dupa suma desc.</option>
            <option value="suma-asc">Sorteaza dupa suma asc.</option>
          </select>
        </div>
      </div>

      <div class="card-body">
        <table class="table table-hover ml-3 mr-3">
          <thead class="table-light">
            <tr>
              <th>Denumire</th>
              <th>Suma</th>
              <th>Categorie</th>
              <th>Data</th>
              <th class="text-center">Actiuni</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in filteredAndSortedExpenses" :key="item.id" class="expense-row">
              <td class="fw-semibold">{{ item.denumire }}</td>
              <td>
                <strong>{{ item.suma }} RON</strong>
              </td>
              <td>
                <span :class="['badge', 'category-badge', categoryColor(item.categorie)]">
                  <span class="icon" v-html="categoryIcon(item.categorie)"></span>
                  {{ item.categorie }}
                </span>
              </td>

              <td>{{ formatDate(item.data) }}</td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="stergeCheltuiala(item.id)"
                  title="Sterge cheltuiala"
                >
                  Sterge
                </button>
              </td>
            </tr>

            <tr v-if="filteredAndSortedExpenses.length === 0">
              <td colspan="5" class="text-center text-muted py-3">Nicio cheltuiala gasita</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();
const denumire = ref('')
const suma = ref(null)
const categorie = ref('')
const data = ref('')
const showErrors = ref(false)
const errorMessage = ref('')
const listaTotalCheltuieli = ref([])
const selectedCategory = ref('')
const sortType = ref('data-desc')

onMounted(() => {
  getAllData()
})

function getAllData() {
  const stored = localStorage.getItem('cheltuieli')
  listaTotalCheltuieli.value = stored ? JSON.parse(stored) : []
}

function adaugaCheltuiala() {
  showErrors.value = true
  errorMessage.value = ''

  if (!denumire.value || !categorie.value || !data.value || !suma.value || suma.value <= 0) {
    errorMessage.value = 'Completeaza toate campurile corect!'
    return
  }

  const newItem = {
    id: Date.now(),
    denumire: denumire.value,
    suma: suma.value,
    categorie: categorie.value,
    data: data.value,
  }

  listaTotalCheltuieli.value.push(newItem)
  localStorage.setItem('cheltuieli', JSON.stringify(listaTotalCheltuieli.value))

  $toast.success('Cheltuiala a fost adaugata cu succes!');
  showErrors.value = false

  denumire.value = ''
  suma.value = null
  categorie.value = ''
  data.value = ''
}

function stergeCheltuiala(id) {
  listaTotalCheltuieli.value = listaTotalCheltuieli.value.filter((item) => item.id !== id)
  localStorage.setItem('cheltuieli', JSON.stringify(listaTotalCheltuieli.value))
  $toast.info('Cheltuiala a fost stearsa cu succes!');
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ro-RO')
}

const summaryCards = computed(() => {
  const total = listaTotalCheltuieli.value.reduce((a, b) => a + Number(b.suma || 0), 0)
  const mancare = listaTotalCheltuieli.value
    .filter((x) => x.categorie === 'Mancare')
    .reduce((a, b) => a + Number(b.suma || 0), 0)
  const transport = listaTotalCheltuieli.value
    .filter((x) => x.categorie === 'Transport')
    .reduce((a, b) => a + Number(b.suma || 0), 0)
  const divertisment = listaTotalCheltuieli.value
    .filter((x) => x.categorie === 'Divertisment')
    .reduce((a, b) => a + Number(b.suma || 0), 0)

  return [
    { label: 'Total Cheltuieli', total: total, icon: '💳' },
    { label: 'Mancare', total: mancare, icon: '🍕' },
    { label: 'Transport', total: transport, icon: '🚗' },
    { label: 'Divertisment', total: divertisment, icon: '🎮' },
  ]
})

const filteredAndSortedExpenses = computed(() => {
  let items = [...listaTotalCheltuieli.value]

  if (selectedCategory.value) items = items.filter((i) => i.categorie === selectedCategory.value)

  if (sortType.value === 'data-desc') items.sort((a, b) => new Date(b.data) - new Date(a.data))
  else if (sortType.value === 'data-asc') items.sort((a, b) => new Date(a.data) - new Date(b.data))
  else if (sortType.value === 'suma-desc') items.sort((a, b) => b.suma - a.suma)
  else if (sortType.value === 'suma-asc') items.sort((a, b) => a.suma - b.suma)

  return items
})

function categoryColor(categorie) {
  switch (categorie) {
    case 'Mancare':
      return 'bg-danger-subtle text-danger fw-bold'
    case 'Transport':
      return 'bg-info-subtle text-info fw-bold'
    case 'Divertisment':
      return 'bg-success-subtle text-success fw-bold'
    default:
      return 'bg-secondary-subtle text-secondary'
  }
}

function categoryIcon(categorie) {
  switch (categorie) {
    case 'Mancare':
      return '🍕'
    case 'Transport':
      return '🚗'
    case 'Divertisment':
      return '🎮'
    default:
      return '💳'
  }
}
</script>

<style scoped>
.app {
  background-color: #eeeeee;
  min-height: 100vh;
  padding-top: 40px;
}

.summary-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  transition: transform 0.3s ease;
}
.summary-card:hover {
  transform: translateY(-5px);
}

.btn-primary {
  background-color: #6c63ff;
  border-color: #6c63ff;
}
.btn-primary:hover {
  background-color: #574fd8;
}
.is-invalid {
  border-color: #dc3545;
}
.card {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}
</style>
