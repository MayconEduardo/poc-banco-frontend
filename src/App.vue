<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Conta</th>
          <th scope="col">CPF</th>
          <th scope="col">Nome</th>
          <th scope="col">Saldo</th>
          <th scope="col">Opções</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-if="!contas" colspan="5" class="sem-registro">Nenhum registro encontrado.</td>
        </tr>
        <tr v-for="conta in contas" :key="conta.id">
          <th scope="row">{{ conta.id }}</th>
          <td>{{ conta.cpf }}</td>
          <td>{{ conta.nome }}</td>
          <td>{{ formatPrice(conta.saldo) }}</td>
          <td>
            <button
              type="button"
              class="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              @click="getAcao(conta.id, 1)"
            >
              +
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              @click="getAcao(conta.id, 2)"
            >
              -
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Informe o valor da transação
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cancelar()"
            ></button>
          </div>
          <div class="modal-body">
            <input
              class="form-control"
              type="text"
              maxlength="13"
              v-model="valor"
              v-money="money"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="cancelar()"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
              @click="realizaTransacao()"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Contas from "./services/contas";
import { VMoney } from "v-money";

export default {
  data() {
    return {
      contas: [],
      valor: 0,
      requestValor: {
        valor: 0,
      },
      acao: {
        tipo: "",
        id: 0,
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false,
      },
    };
  },
  mounted() {
    this.listar();
  },
  methods: {
    listar() {
      Contas.listarContas()
        .then((response) => {
          this.contas = response.data;
        })
        .catch((e) => {
          console.log(e);
          this.contas = false
          alert("Sem conexão com a API de contas.");
        });
    },
    depositar() {
      Contas.deposito(this.acao.id, this.requestValor)
        .then((response) => {
          this.listar();
          alert(response.data.data);
        })
        .catch((e) => {
          alert(e.response.data.error);
        });
    },
    sacar() {
      Contas.saque(this.acao.id, this.requestValor)
        .then((response) => {
          this.listar();
          alert(response.data.data);
        })
        .catch((e) => {
          alert(e.response.data.error);
        });
    },
    cancelar() {
      this.valor = 0;
      this.acao.id = 0;
      this.acao.tipo = "";
    },
    getAcao(id, tipo) {
      this.acao.id = id;
      this.acao.tipo = tipo;
    },
    realizaTransacao() {
      this.requestValor.valor = this.valor.replace("R$ ", "");
      this.requestValor.valor = this.requestValor.valor.replace(".", "");
      this.requestValor.valor = this.requestValor.valor.replace(",", ".");

      if (this.acao.tipo == "1") {
        this.depositar();
      }

      if (this.acao.tipo == "2") {
        this.sacar();
      }

      this.cancelar();
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  directives: { money: VMoney },
};
</script>

<style>
.btn.btn-danger {
  margin-left: 10px;
}
.sem-registro {
  text-align: center;
}
</style>
