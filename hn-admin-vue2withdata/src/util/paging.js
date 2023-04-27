import methods from './methods';

export class Paging {
	_path = "";
	_page = 1;
	_total = 0;
	_limit = 10;
	_noMore = false;
	_list = [];
	_params = {};
	_keyword = "";
	_method = "";
	
	constructor(path,params = {},method){
		this._path = path
		this._params = params
		this._method = method?method:'get'
	}
	
  exec() {
    let obj = { page: this._page, limit: this._limit }
		return methods.request(this._path, Object.assign(obj,this._params),this._method).then((res) => {
			// console.log(res,'paging.js')
      if(res.code==0){
        if (this._page==1) this._total = res.total;
        this._list = res.data;
				console.log(this._list,88888)
				return res.data
      }
    })


	}
	
	// reset(){
	// 	this._page = 0
	// 	this._noMore = false
	// }
	
}

export class Menu{
	tags = []
	checked = null
	
	constructor(options=[]){
		this.tags = options
		this.checked = options.find(item=>item.check==true)
	}
	
	handler(item){
		this.tags.find((obj)=>{
			if(obj.check)obj.check = false;
			if(obj.name==item.name){
				obj.check = true
				this.checked = obj
			}
		})
	}
}