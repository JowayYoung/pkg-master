#!/usr/bin/env node

const Chalk = require("chalk");
const Commander = require("commander");

const { version } = require("../package");
const { ACTION_TEXT, GLOB_TEXT } = require("../i18n/zh");
const { AutoBin } = require("../util/setting");

// 版本和用法
Commander
	.usage(Chalk.yellowBright("<command> [option]"))
	.version(version, "-v, --version", Chalk.greenBright(version))
	.helpOption("-h, --help", Chalk.greenBright(GLOB_TEXT.help))
	.description(GLOB_TEXT.desc);
// 创建模块
Commander
	.command("create")
	.alias("c")
	.description(Chalk.blueBright(ACTION_TEXT.create))
	.action(() => AutoBin("create"));
// 发布模块
Commander
	.command("publish")
	.alias("p")
	.description(Chalk.blueBright(ACTION_TEXT.publish))
	.action(() => AutoBin("publish"));
// 帮助
Commander.parse(process.argv);