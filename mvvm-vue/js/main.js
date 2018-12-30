// code start
mockLocalData();

var model = new Model({
  data: { id: '', voter: '', number: 0 },
  resource: 'voter',
});

var view = new Vue({
  el: '#app',
  data: {
    person: {
      id: '',
      voter: '',
      number: 0
    },
    tickets: 0
  },
  template: `
  <div id="app-wrapper">
    <div>
    被投票人: <span id="voter">{{person.voter}}</span>
    票数: <span id="number">{{person.number}}</span>
    </div>
    <input v-model="tickets" />
    投的票数为 {{tickets}}
    <div class="actions">
      <button v-on:click="addOne">投{{tickets}}票</button>
      <button v-on:click="minusOne">减{{tickets}}票</button>
      <button v-on:click="reset">重置</button>
    </div>
  </div>
  `,
  methods: {
    addOne() {
      let newNumber = this.person.number + (this.tickets - 0);
      model.update({number: newNumber}).then(()=> {
        this.person = model.data;
      })
    },
    minusOne() {
      let newNumber = this.person.number - (this.tickets - 0);
      model.update({number: newNumber}).then(()=> {
        this.person = model.data;
      })
    },
    reset() {
      let newNumber = 0;
      model.update({number: newNumber}).then(()=> {
        this.person = model.data;
      })
    }
  },
  created() {
    model.fetch(1).then(()=> {
      this.person = model.data
    });
  }
});

