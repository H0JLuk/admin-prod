Интерфейс администоров
## Требования 
npm >= 6.14.6 <br />
node >= 12.18.3 <br />
eslint >= 7.6.0

### Локальное развертывание
1. Установить node
2. Установить зависимости
```
npm i
npm i -g eslint
```
3. Стартовать приложение
```
npm start
```

Можно запустить приложение в контейнере.
URL бэкенда при сборке контейнера берется из .env.production
```
npm run build
npm run docker-build
npm run docker-run
```
### Перед созданием PR
Необходимо прогнать 
```
npm run lint
npm run test
```

Тесты лежат в папке с компонентами для упрощенной переносимости
