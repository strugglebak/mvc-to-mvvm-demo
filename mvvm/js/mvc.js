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


// 定义 controller 对象
var Controller = {
  view: null,
  model: null,
  init: function({view, model}) {
    this.view = view;
    this.model = model;

    // model 先读取数据
    this.model.fetch(1).then((e)=> {
      // 读取数据之后再渲染页面
      this.view.render(this.model.data);
      this.bindEvents();
    })
  },
  bindEvents: function() {
    $(this.view.el).
      on('click', '#addOne', this.addOne.bind(this, '#number'));
    $(this.view.el).
      on('click', '#minusOne', this.minusOne.bind(this, '#number'));
    $(this.view.el).
      on('click', '#reset', this.reset.bind(this, '#number'));
  },
  addOne: function(el) {
    let newNumber = $(el).text() - 0 + 1;
    this.model.update({number: newNumber}).then(()=> {
      this.view.render(this.model.data);
    })
  },
  minusOne: function(el) {
    let newNumber = $(el).text() - 0 - 1;
    this.model.update({number: newNumber}).then(()=> {
      this.view.render(this.model.data);
    })
  },
  reset: function(el) {
    let newNumber = 0;
    this.model.update({number: newNumber}).then(()=> {
      this.view.render(this.model.data);
    })
  },
};
