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

