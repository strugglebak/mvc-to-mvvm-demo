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
