import methods from './methods';

export class Paging {
	_path = "";
	_page = 1;
	_total = 0;
	_limit = 20;
	_noMore = false;
	_list = [];
	_params = {};
	_keyword = "";
	
	constructor(path,params = {}){
		this._path = path
		this._params = params
	}
	
  exec() {
    let obj = { page: this._page, limit: this._limit }
		return methods.request(this._path, Object.assign(obj,this._params)).then((res) => {
			console.log(res,7535777777)
      if(res.code==0){
        if (res.data.length > 0 &&this._page==1) this._total = res.total;
        this._list = res.data;
      }
    })


		// return new Promise((rs,rj)=>{
		// 	if(this._noMore)return;
		// 	this._page++
		// 	methods.request(this._path,
    //     Object.assign({ page: this._page, pageSize: this._pageSize }, this._params),
    //   "get",
		// 	(res)=>{
		// 		if(res.success){
		// 			if (res.data.rows.length < this._pageSize) this._noMore = true;
		// 			this._list.push(...res.data.rows);
		// 		}
		// 	})
		// })
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