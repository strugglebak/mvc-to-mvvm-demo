
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
        { id: 1, voter: 'John Smith', number: 2 }
      ]
    }];
  } else if (config.url === '/voter/1' && config.method === 'put') {
    // 更新数据再传回前端
    let data = config.data;
    data = JSON.parse(data);
    let newNumber = data.number;
    return [204, {
      person: [
        { id: 1, voter: 'John Smith', number: newNumber }
      ]
    }];
  }
});


$('#addOne').on('click', function(e) {
  let newNumber = $('#number').text() - 0 + 1;
  // $('#number').html(number);

  // 发送 put 请求,将新数据传给假后端
  axios.put('/voter/1', {number: newNumber}).then(function(response) {
    // 前端渲染已经改变的数据
    // console.log(response.data.person[0].number);
    let person = response.data.person;
    let number = person[0].number;
    $('#number').html(number);
  });
});

$('#minusOne').on('click', function(e) {
  let newNumber = $('#number').text() - 0 - 1;
  // 发送 put 请求,将新数据传给假后端
  axios.put('/voter/1', {number: newNumber}).then(function(response) {
    // 前端渲染已经改变的数据
    // console.log(response.data.person[0].number);
    let person = response.data.person;
    let number = person[0].number;
    $('#number').html(number);
  });
});

$('#reset').on('click', function(e) {
  let newNumber = 0;
  // 发送 put 请求,将新数据传给假后端
  axios.put('/voter/1', {number: newNumber}).then(function(response) {
    // 前端渲染已经改变的数据
    // console.log(response.data.person[0].number);
    let person = response.data.person;
    let number = person[0].number;
    $('#number').html(number);
  });
});

