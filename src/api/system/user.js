import request from '@/utils/request'
import {
	parseStrEmpty
} from "@/utils/ruoyi";
import {
	encrypt
} from '@/utils/jsencrypt'

// 查询用户列表
export function listUser(query) {
	return request({
		url: '/system/system/user/list',
		method: 'get',
		params: query
	})
}

export function listOperatorUser(query) {
	return request({
		url: '/system/system/user/operatorList',
		method: 'get',
		params: query
	})
}

// 查询用户详细
export function getUser(id) {
	return request({
		url: '/system/system/user/' + parseStrEmpty(id),
		method: 'get'
	})
}

// 新增用户
export function addUser(data) {
	data.password = encrypt(data.password)
	return request({
		url: '/system/system/user',
		method: 'post',
		data: data
	})
}

// 修改用户
export function updateUser(data) {
	return request({
		url: '/system/system/user',
		method: 'put',
		data: data
	})
}

// 删除用户
export function delUser(id) {
	return request({
		url: '/system/system/user/' + id,
		method: 'delete'
	})
}

// 用户密码重置
export function resetUserPwd(id) {
	const data = {
		id
	}
	return request({
		url: '/system/system/user/resetPwd',
		method: 'put',
		data: data
	})
}

export function resetBatchUserPwd(id, password) {
	const data = {
		id,
		password
	}
	return request({
		url: '/system/system/user/resetBatchPwd',
		method: 'put',
		data: data
	})
}

// 用户状态修改
export function changeUserStatus(id, status) {
	const data = {
		id,
		status
	}
	return request({
		url: '/system/system/user/changeStatus',
		method: 'put',
		data: data
	})
}

export function changeBatchUserStatus(id, status) {
	const data = {
		id,
		status
	}
	return request({
		url: '/system/system/user/changeBatchStatus',
		method: 'put',
		data: data
	})
}

// 查询用户个人信息
export function getUserProfile() {
	return request({
		url: '/system/system/user/profile',
		method: 'get'
	})
}

// 修改用户个人信息
export function updateUserProfile(data) {
	return request({
		url: '/system/system/user/profile',
		method: 'put',
		data: data
	})
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
	oldPassword = encrypt(oldPassword)
	newPassword = encrypt(newPassword)
	const data = {
		oldPassword,
		newPassword
	}
	return request({
		url: '/system/system/user/profile/updatePwd',
		method: 'put',
		params: data
	})
}

// 用户头像上传
export function uploadAvatar(data) {
	return request({
		url: '/upload/image/upload',
		method: 'post',
		data: data
	})
}

//保存头像
export function saveAvatar(avatar) {
	return request({
		url: '/system/system/user/profile/avatar?avatar=' + avatar,
		method: 'put'
	})
}

// 查询授权角色
export function getAuthRole(id) {
	return request({
		url: '/system/system/user/authRole/' + id,
		method: 'get'
	})
}

// 保存授权角色
export function updateAuthRole(data) {
	return request({
		url: '/system/system/user/authRole',
		method: 'put',
		params: data
	})
}


export function getMyDept() {
	return request({
		url: '/system/system/user/profile/myDept',
		method: 'get'
	})
}

export function getMyMessage() {
	return request({
		url: '/system/system/user/profile/message',
		method: 'get'
	})
}


export function readMyMessage() {
	return request({
		url: '/system/system/user/profile/readMessage',
		method: 'put'
	})
}
