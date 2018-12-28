// 定义 model 类
function Model({data, resource}) {
  this.data = data;
  this.resource = resource;
}
// 抓取数据
Model.prototype.fetch = function() {
  let resource = this.resource;
  let id = this.data.id;
  return axios.get(`/${resource}/${id}`).
    then(function(response) {
      return response;
  });
}
// 更新数据
Model.prototype.update = function(number) {
  let resource = this.resource;
  let id = this.data.id;
  return axios.put(`/${resource}/${id}`, {number: number}).
    then(function(response) {
      return response;
  });
}


// 定义 view 类
function View({el, context}) {
  this.el = el;
  this.context = context;
}
// 初始化
View.prototype.init = function() {
  $(`#${this.el}`).html(this.context);
}
// 渲染对应元素
View.prototype.render = function(el, context) {
  $(`#${el}`).html(context);
}


// 定义 controller 类
function Controller({view, model}) {
  this.view = view;
  this.model = model;
}
// 初始化
Controller.prototype.init = function() {
  this.view.init();
  this.bindEvents();
}
// 绑定事件
Controller.prototype.bindEvents = function() {
  $('#addOne').on('click', function(e) {
    let newNumber = $('#number').text() - 0 + 1;
    // 发送 put 请求,将新数据传给假后端
    model.update(newNumber).then(function(response) {
      let person = response.data.person;
      let number = person[0].number;
      view.render('number', number);
    })
  });

  $('#minusOne').on('click', function(e) {
    let newNumber = $('#number').text() - 0 - 1;
    // 发送 put 请求,将新数据传给假后端
    model.update(newNumber).then(function(response) {
      let person = response.data.person;
      let number = person[0].number;
      view.render('number', number);
    })
  });

  $('#reset').on('click', function(e) {
    let newNumber = 0;
    // 发送 put 请求,将新数据传给假后端
    model.update(newNumber).then(function(response) {
      let person = response.data.person;
      let number = person[0].number;
      $('#number').html(number);
    })
  });
}

// 第三方本地 response 拦截器
function mockLocalData() {
  // This sets the mock adapter on the default instance
  var mock = new AxiosMockAdapter(axios);

  // Mock any request
  // arguments for reply are (status, data, headers)
  mock.onAny().reply(function(config) {
    // 制造假数据
    // 需要的参数 data method url
    let personData = { id: 1, voter: 'John Smith', number: 2 }
    if(config.url === '/voter/1' && config.method === 'get') {
      return [200, {
        person: [ personData ]
      }];
    } else if (config.url === '/voter/1' && config.method === 'put') {
      // 更新数据再传回前端
      let data = config.data;
      personData = JSON.parse(data);
      return [204, {
        person: [ personData ]
      }];
    }
  });
}






// code start
mockLocalData();

var model = new Model({
  data: { id: 1, voter: 'John Smith', number: 2 },
  resource: 'voter',
});

var view = new View({
  el: 'app',
  context: `
    被投票人: <span id="voter">John Smith</span>
    票数: <span id="number">2</span>
    <div class="actions">
      <button id="addOne">投一票</button>
      <button id="minusOne">减一票</button>
      <button id="reset">重置</button>
    </div>
  `
});

var controller = new Controller({
  view: view,
  model: model
});

controller.init();



