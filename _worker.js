let token = '';
export default {
	async fetch(request, env) {
		const ua = request.headers.get('user-agent');
		const url = new URL(request.url);
		if (url.pathname !== '/') {
			const name = url.pathname.split('/').pop();
			if (name.match(/\.js$/i)) {
				if (!/(quantumult%20|surge|loon|stash)/i.test(ua)) {
					return Response.redirect('https://t.me/yqc_123', 302);
				}
			}
			if (!name.match(/\./i)) return new Response(`别乱访问了`, { status: 404 });
			let githubRawUrl = 'https://raw.githubusercontent.com';
			if (new RegExp(githubRawUrl, 'i').test(url.pathname)) {
				githubRawUrl += url.pathname.split(githubRawUrl)[1];
			} else {
				if (env.GH_NAME) {
					githubRawUrl += '/' + env.GH_NAME;
					if (env.GH_REPO) {
						githubRawUrl += '/' + env.GH_REPO;
						if (env.GH_BRANCH) githubRawUrl += '/' + env.GH_BRANCH;
					}
				}
				githubRawUrl += url.pathname;
			}
			//console.log(githubRawUrl);
			if (env.GH_TOKEN && env.TOKEN) {
				if (env.TOKEN == url.searchParams.get('token')) token = env.GH_TOKEN || token;
				else token = url.searchParams.get('token') || token;
			} else token = url.searchParams.get('token') || env.GH_TOKEN || env.TOKEN || token;

			const githubToken = token;
			//console.log(githubToken);
			if (!githubToken || githubToken == '') return new Response('TOKEN不能为空', { status: 400 });

			// 构建请求头
			const headers = new Headers();
			headers.append('Authorization', `token ${githubToken}`);

			// 发起请求
			const response = await fetch(githubRawUrl, { headers });

			// 检查请求是否成功 (状态码 200 到 299)
			if (response.ok) {
				return new Response(response.body, {
					status: response.status,
					headers: response.headers,
				});
			} else {
				const errorText = env.ERROR || '无法获取文件，检查路径或TOKEN是否正确。';
				// 如果请求不成功，返回适当的错误响应
				return new Response(errorText, { status: response.status });
			}
		} else {
			return Response.redirect('https://t.me/yqc_123', 302);
		}
	},
};
