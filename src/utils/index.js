import request from './request';
export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (('' + time).length === 10) time = parseInt(time) * 1000
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

export function formatTime(time, option) {
	time = +time * 1000
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) { // less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
	}
}

export const chunkFile = (file, total, hash, size) => {
	return Array.from(Array.from(Array(total).keys())).map((item, index) => {
		let start = index * size;
		let end = Math.min(file.size, start + size);
		const form = new FormData();
		form.append('file', file.slice(start, end));
		form.append('index', index);
		form.append('hash', hash);
		return request({
			method: 'post',
			url: '/common/chunkFile',
			data: form,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	});
};

export const gcd = (x, y) => {
	let max, min, temp;
	max = x > y ? x : y;
	min = x < y ? x : y;
	while (max % min) {

		temp = max % min;
		max = min;
		min = temp;
	}
	return min;
};

export const filterObject = (param) => {
	let obj = { ...param };
    for (const key in obj) {
        if (obj[key] == undefined || obj[key] === '') {
            delete obj[key];
        }
    };
    return obj;
};

export const getCityData = (data, cityData) => {
	const city = [...cityData];
	const county = data.filter(item => city.includes(String(item.id)));
	const countyId = county.map(val => val.pid)
	const cityArr = data.filter(item => countyId.includes(item.id));
	const cityId = cityArr.map(item => item.pid);
	const province = data.filter(item => cityId.includes(item.id));
	const arr = [...county, ...cityArr, ...province];
	return arr;
};

export const cityData = (arr, pid = 1) => {
	let data = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].pid === pid) {
			const obj = arr[i];
			if (arr[i].type !== 3) {
				obj['children'] = cityData(arr, obj.id);
			}
			data.push(obj);
		}
	}
	return data;
};