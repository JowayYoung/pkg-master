const Chalk = require("chalk");
const Figures = require("figures");

const ACTION_TEXT = {
	lang: "切换语言",
	new: "创建模块",
	publish: "发布模块"
};

const LANG_TEXT = {
	langSucceed: `${Figures.tick} 语言切换成功`,
	qaLanguage: "请选择国际语言"
};

const NEW_TEXT = {
	generating: `${Figures.hamburger} 文件正在生成中......`,
	judgeAuthor: `${Figures.cross} 名称只能由数字、字母、中文、中划线、下划线组成`,
	judgeAuthorEmpty: `${Figures.cross} 作者不能为空`,
	judgeEmail: `${Figures.cross} 请输入正确的邮箱`,
	judgeExist: `${Figures.cross} 模块已存在，请使用其他名称创建模块`,
	judgeKeyword: `${Figures.cross} 关键字只能由数字、字母和中文组成，并且使用空格隔开`,
	judgeLink: `${Figures.cross} 请输入正确的链接`,
	judgeName: `${Figures.cross} 名称只能由数字、小写字母、中划线、下划线组成`,
	newSucceed: `${Figures.tick} 模块创建成功`,
	qaAuthor: "请输入作者",
	qaDesc: "请输入描述",
	qaEmail: "请输入邮箱",
	qaKeyword: "请输入关键字",
	qaLink: "请输入链接",
	qaName: "请输入名称"
};

const PUBLISH_TEXT = {
	errorLogin: `${Figures.cross} 请执行 npm login 登录您的Npm账号，无账号请执行 npm adduser 创建您的Npm账号`,
	errorNode: `${Figures.cross} Node未安装`,
	errorNpm: `${Figures.cross} Npm未安装`,
	errorNpmInstall: `${Figures.cross} 依赖安装失败，请检查package.json`,
	errorPublish: `${Figures.cross} 模块已存在，请使用其他名称发布模块`,
	errorRegistry: `${Figures.cross} 请执行 npm config set registry https://registry.npmjs.org/ 切换回源镜像`,
	errorYarnInstall: `${Figures.cross} 请执行 npm i -g yarn 安装yarn`,
	publishFail: `${Figures.cross} 执行步骤出错，请根据提示修复再执行${Chalk.blueBright("pkg-master publish")}或${Chalk.blueBright("pkg-master p")}`,
	publishSucceed: `${Figures.tick} 模块发布成功`,
	publishWarning: `${Figures.warning} 请执行${Chalk.blueBright("npm config set registry https://registry.npm.taobao.org/")}切换回淘宝镜像`,
	taskEnv: "检查Node运行环境",
	taskLogin: "查看Npm账号登录状态",
	taskNode: "检查Node是否安装",
	taskNpm: "检查Npm是否安装",
	taskNpmInstall: "使用Npm安装依赖",
	taskPublish: "发布Npm模块",
	taskRegistry: "检查Npm镜像",
	taskYarnInstall: "使用Yarn安装依赖"
};

module.exports = {
	ACTION_TEXT,
	LANG_TEXT,
	NEW_TEXT,
	PUBLISH_TEXT
};