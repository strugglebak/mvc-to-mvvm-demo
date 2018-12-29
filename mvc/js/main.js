// code start
mockLocalData();

var model = new Model({
  data: { id: '', voter: '', number: 0 },
  resource: 'voter',
});

var view = new View({
  el: '#app',
  context: `
    <div>
    被投票人: <span id="voter">__voter__</span>
    票数: <span id="number">__number__</span>
    </div>
    <div class="actions">
      <button id="addOne">投一票</button>
      <button id="minusOne">减一票</button>
      <button id="reset">重置</button>
    </div>
  `
});

Controller.init({
  view: view,
  model: model
});
