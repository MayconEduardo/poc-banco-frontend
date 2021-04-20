<template>
</template>

<script>
import Contas from '../services/contas'

export default {
  mounted() {
    Contas.listarContas().then(response => {
      console.log(response)
      console.log("Teste")
    })
  }
}
</script>

<style scoped>
</style>
