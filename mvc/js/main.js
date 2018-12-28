// 定义 model 类
function Model({data, resource}) {
  this.data = data;
  this.resource = resource;
}
// 定义 model 类的功能
Model.prototype.fetch = function() {
  let resource = this.resource;
  let id = this.data.id;
  return axios.get(`/${resource}/${id}`).
    then(function(response) {
      return response;
  });
}
Model.prototype.update = function(number) {
  let resource = this.resource;
  let id = this.data.id;
  return axios.put(`/${resource}/${id}`, {number: number}).
    then(function(response) {
      return response;
  });
}


// 定义 view 类
function View() {
}
// 定义 view 类的功能
View.prototype.render = function() {}

// 定义 controller 类
function Controller() {

}
// 定义 controller 类的功能
Controller.prototype.init = function() {}
Controller.prototype.bindEvents = function() {}




var model = new Model({
  data: { id: 1, voter: 'John Smith', number: 2 },
  resource: 'voter',
});

// This sets the mock adapter on the default instance
var mock = new AxiosMockAdapter(axios);

// Mock any request
// arguments for reply are (status, data, headers)
mock.onAny().reply(function(config) {
  // 制造假数据
  // 需要的参数 data method url
  if(config.url === '/voter/1' && config.method === 'get') {
    return [200, {
      person: [
        { id: 1, number: 2 }
      ]
    }];
  } else if (config.url === '/voter/1' && config.method === 'put') {
    // 更新数据再传回前端
    let data = config.data;
    data = JSON.parse(data);
    return [204, {
      person: [
        { id: 1, voter: 'John Smith', number: data.number }
      ]
    }];
  }
});


$('#addOne').on('click', function(e) {
  let newNumber = $('#number').text() - 0 + 1;
  // $('#number').html(number);

  // 发送 put 请求,将新数据传给假后端
  model.update(newNumber).then(function(response) {
    let person = response.data.person;
    let number = person[0].number;
    $('#number').html(number);
  })
});

$('#minusOne').on('click', function(e) {
  let newNumber = $('#number').text() - 0 - 1;
  // 发送 put 请求,将新数据传给假后端
  model.update(newNumber).then(function(response) {
    let person = response.data.person;
    let number = person[0].number;
    $('#number').html(number);
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

