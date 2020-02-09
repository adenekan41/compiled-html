![Drag Racing](https://i.ibb.co/JtYZKpc/Group-10-2-1.png)

# Compiled-HTML

### [see demo](https://github.com/adenekan41/compiled-html)

A Starter project to make writing html really simple and easy powered by gulp.

## Helper Functions

> Still in progress coming up with useful helper by gulp-file-include and some other useful compilers

## Install

```sh
$ git clone https://github.com/adenekan41/compiled-html
$ npm install
$ npm run start
```

## Usage

Getting familiar with the template and you want to use some helper functions in your HTML file like import sidebar components or generate head components differently for each files
`@`, Prefix to the world just import using them the following ways.

`index.html`

```html
<!DOCTYPE html>
<html>
	<head>
		@include('./components/head.html', {"title": "Dashboard"})
	</head>
	<body>
		@@include('./components/view.html')
	</body>
</html>
```

`/components/head.html`

```html
<meta charset="utf-8" />
<title>@title of my first compiled html</title>
<meta name="description" content="" />
<meta name="author" content="" />

<meta name="viewport" content="width=device-width, initial-scale=1" />
```

`/components/view.html`

```html
<h2>Hello There</h2>
```

Now your compiled HTML file should look like this

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>@title of my first compiled html</title>
		<meta name="description" content="" />
		<meta name="author" content="" />

		<meta name="viewport" content="width=device-width, initial-scale=1" />
	</head>
	<body>
		<h2>Hello There</h2>
	</body>
</html>
```

### [see more of what you can do here](https://www.npmjs.com/package/gulp-file-include)

## Useful commands

```sh
$ npm run start #starts the app
$ npm run copy #copies any html code in working directory to build directory
$ npm run flush #delets cached compile by gulp
$ npm run watch #watchs files and updates
$ npm run connect #starts server without running gulp default
```

> MIT © [codewonders.dev](https://codewonders.dev) &nbsp;&middot;&nbsp; GitHub
> [@adenekan41 / codewonders](https://github.com/adenekan41) > &nbsp;&middot;&nbsp;

<!-- {blockquote: style='display:none'} -->
