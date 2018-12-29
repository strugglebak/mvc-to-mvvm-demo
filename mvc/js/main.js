// 定义 model 类
function Model({data, resource}) {
  this.data = data;
  this.resource = resource;
}
// 抓取数据
Model.prototype.fetch = function(id) {
  let resource = this.resource;
  return axios.get(`/${resource}/${id}`).
    then((response)=> {
      // 将数据保存在 model 中
      this.data = response.data.person[0];
      console.log('fetching data', this.data);
      return response;
  }).catch((error)=>{console.log(error)});
}
// 更新数据
Model.prototype.update = function(data) {
  let resource = this.resource;
  let id = this.data.id;
  return axios.put(`/${resource}/${id}`, data).
    then((response)=> {
      // 将数据保存在 model 中
      this.data = response.data.person[0];
      console.log('updating data', this.data);
      return response;
  }).catch((error)=>{console.log(error)});
}

// 定义 view 类
function View({el, context}) {
  this.el = el;
  this.context = context;
}
// 渲染对应元素
View.prototype.render = function(data) {
  let html = this.context;
  // 遍历 data 的 key
  for(let key in data) {
    // 将 html 中标注的 '__xxx__' 替换成 model 中的 data
    html = html.replace(`__${key}__`, data[key]);
  }
  // 渲染
  $(this.el).html(html);
}


// 定义 controller 类
function Controller({view, model}) {
  this.view = view;
  this.model = model;
}
// 初始化
Controller.prototype.init = function() {

  // model 先读取数据
  this.model.fetch(1).then((e)=> {
    // 读取数据之后再渲染页面
    this.view.render(this.model.data);
    this.bindEvents();
  })
}
Controller.prototype.addOne = function(el) {
  let newNumber = $(el).text() - 0 + 1;
  this.model.update({number: newNumber}).then(()=> {
    this.view.render(this.model.data);
  })
}
Controller.prototype.minusOne = function(el) {
  let newNumber = $(el).text() - 0 - 1;
  this.model.update({number: newNumber}).then(()=> {
    this.view.render(this.model.data);
  })
}
Controller.prototype.reset = function(el) {
  let newNumber = 0;
  this.model.update({number: newNumber}).then(()=> {
    this.view.render(this.model.data);
  })
}
// 绑定事件
Controller.prototype.bindEvents = function() {
  $(this.view.el).
    on('click', '#addOne', this.addOne.bind(this, '#number'));
  $(this.view.el).
    on('click', '#minusOne', this.minusOne.bind(this, '#number'));
  $(this.view.el).
    on('click', '#reset', this.reset.bind(this, '#number'));
};

// 第三方本地 response 拦截器,伪造本地数据库
function mockLocalData() {
  // This sets the mock adapter on the default instance
  var mock = new AxiosMockAdapter(axios);

  // Mock any request
  // arguments for reply are (status, data, headers)
  mock.onAny().reply(function(config) {
    // 需要的参数 data method url
    console.log(config.data);
    if(config.url === '/voter/1' && config.method === 'get') {
      return [200, {
        person: [ { id: 1, voter: 'John Smith', number: 2 } ]
      }];
    } else if (config.url === '/voter/1' && config.method === 'put') {
      // response 前传给 model 保存
      let data = config.data;
      data = JSON.parse(data);
      return [204, {
        person: [ { id: 1, voter: 'John Smith', number: data.number } ]
      }];
    }
  });
}






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

var controller = new Controller({
  view: view,
  model: model
});

controller.init();

