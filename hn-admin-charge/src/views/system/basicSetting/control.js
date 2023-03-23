import request from '@/utils/request'
import {
	getToken
} from '@/utils/auth'
import {
	deepClone
} from '@/utils/index'
export default {
	name: "BasicSetting",
	data() {
		return {
			form: {
				pathAndroidList: [],
				downloadPageImageUrl:''
			},
			rules: {
				pathIos: [{
					type: 'url',
					message: "请输入正确的url	地址",
					trigger: "blur"
				}, ],
			},
			uploadFileUrl: process.env.VUE_APP_BASE_API + '/upload/image/upload',
			uploadHeaders: {
				PLATFORM: 'pc',
				token: getToken()
			}
		};
	},
	created() {
		this.getSetting();
	},
	methods: {
		getSetting() {
			request({
				url: '/system/setting/query',
				method: 'get',
			}).then((response) => {
				response.data.pathAndroidList = [];
				if (response.data.pathAndroid) {
					response.data.pathAndroidList.push({
						name: response.data.pathAndroid.split('/')[response.data.pathAndroid.split('/')
							.length - 1],
						url: response.data.pathAndroid
					})
				}
				this.form = response.data
				this.form.forcedUpdateAndroid = this.form.forcedUpdateAndroid === 1 ? true : false;
				this.form.forcedUpdateIos = this.form.forcedUpdateIos === 1 ? true : false;
			});
		},
		/** 提交按钮 */
		submitForm() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					console.log(this.form);
					let data = deepClone(this.form);
					data.forcedUpdateAndroid = data.forcedUpdateAndroid ? 1 : 0;
					data.forcedUpdateIos = data.forcedUpdateIos ? 1 : 0;
					let pathAndroidList = [];
					for (let item of data.pathAndroidList) {
						if (item.status == "success") {
							pathAndroidList.push(item.response ? item.response.data : item.url);
						}
					}
					data.pathAndroid = pathAndroidList.join();
					request({
						url: '/system/setting/update',
						method: 'post',
						data: data
					}).then((response) => {
						this.$modal.msgSuccess("保存成功");
					});
				}
			});

		},
		handlePathAndroidSuccess(response, file, fileList) {
			if (response.code == 1) {
				this.form.pathAndroidList = fileList;
			} else {
				this.$refs.upload.clearFiles();
				this.$modal.msgError("上传失败");
			}
		},
		handlePathAndroidError(err, file, fileList) {
			this.$refs.upload.clearFiles();
			this.$modal.msgError("上传失败");
		},
		handlePathAndroidExceed(file, fileList) {
			this.$modal.msgError("只能上传一个文件");
		},
		handlePathAndroidRemove(file, fileList) {
			this.form.pathAndroidList = fileList;
		},
		handleImageUrlSuccess(response, file, fileList) {
			this.form.downloadPageImageUrl = response.data
			this.$forceUpdate()
			console.log(this.$refs.upload2)
			this.$refs['upload2'].clearFiles();
		},
	},
};
