# site

> 3D сайта с анимацией прокрутки | HTML, CSS, JavaScript.

## Установка и запуск

```bash
# установка модулей
npm install

# веб сервер с автоперезагрузкой по адресу localhost:8080
npm run dev

# веб сервер с hot replacement по адресу localhost:8080
npm run dev-hot

# сборка проекта в директорию public
npm run build

# сборка проекта на продакшн с минификацией в директорию public
npm run production
```

В сборщик подключен Postcss с плагинами [autoprifixer](https://github.com/postcss/autoprefixer) и [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg)

Javascript код проходит строгую проверку eslint перед обработкой. Для отключения линтера нужно добавить комментарий

```JavaScript
/* eslint-disable */
```

перед кодом в котором нужно отключить линтер или напротив конкретной строки

```JavaScript
// eslint-disable-line
```
