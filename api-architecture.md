# Архитектура API

## Общие принципы

API сервиса следует принципам RESTful архитектуры с возможностью расширения через GraphQL для сложных отчетов. Все endpoints защищены JWT токенами с RBAC контролем доступа.

## Базовые конвенции

- Все endpoints начинаются с `/api/v1`
- Используется JSON для запросов и ответов
- Статусы ответов соответствуют стандартам HTTP
- Все ошибки возвращаются в формате:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Описание ошибки",
      "details": {}
    }
  }
  ```

## Аутентификация и авторизация

### Аутентификация
- `POST /api/v1/auth/login` - Аутентификация пользователя
- `POST /api/v1/auth/refresh` - Обновление токена
- `POST /api/v1/auth/logout` - Выход из системы

### Авторизация
Все endpoints защищены JWT токенами. Роли пользователей определяют доступ к ресурсам.

## API модулей

### 1. Управление проектами

#### Endpoints:
- `GET /api/v1/projects` - Получение списка проектов
- `POST /api/v1/projects` - Создание нового проекта
- `GET /api/v1/projects/{id}` - Получение информации о проекте
- `PUT /api/v1/projects/{id}` - Обновление информации о проекте
- `DELETE /api/v1/projects/{id}` - Удаление проекта
- `POST /api/v1/projects/{id}/status` - Обновление статуса проекта
- `GET /api/v1/projects/{id}/kpis` - Получение KPI проекта
- `GET /api/v1/projects/{id}/risks` - Получение рисков проекта
- `GET /api/v1/projects/{id}/export` - Экспорт данных проекта

#### Параметры:
- Пагинация: `page`, `limit`
- Фильтрация: `status`, `phase`, `ownerId`
- Сортировка: `sortBy`, `order`

### 2. Управление технологиями

#### Endpoints:
- `GET /api/v1/technologies` - Получение списка технологий
- `POST /api/v1/technologies` - Создание новой технологии
- `GET /api/v1/technologies/{id}` - Получение информации о технологии
- `PUT /api/v1/technologies/{id}` - Обновление информации о технологии
- `DELETE /api/v1/technologies/{id}` - Удаление технологии
- `GET /api/v1/technologies/{id}/projects` - Получение проектов, использующих технологию
- `POST /api/v1/technologies/{id}/lifecycle` - Обновление стадии жизненного цикла

#### Параметры:
- Фильтрация: `category`, `lifecycleStage`, `projectId`
- Сортировка: `name`, `category`, `lifecycleStage`

### 3. Управление задачами

#### Endpoints:
- `GET /api/v1/tasks` - Получение списка задач
- `POST /api/v1/tasks` - Создание новой задачи
- `GET /api/v1/tasks/{id}` - Получение информации о задаче
- `PUT /api/v1/tasks/{id}` - Обновление информации о задаче
- `DELETE /api/v1/tasks/{id}` - Удаление задачи
- `POST /api/v1/tasks/{id}/status` - Обновление статуса задачи
- `GET /api/v1/tasks/project/{projectId}` - Получение задач проекта
- `GET /api/v1/tasks/assignee/{assigneeId}` - Получение задач по исполнителю

#### Параметры:
- Пагинация: `page`, `limit`
- Фильтрация: `status`, `priority`, `projectId`, `assigneeId`
- Сортировка: `dueDate`, `priority`, `createdAt`

### 4. Управление рисками

#### Endpoints:
- `GET /api/v1/risks` - Получение списка рисков
- `POST /api/v1/risks` - Регистрация нового риска
- `GET /api/v1/risks/{id}` - Получение информации о риске
- `PUT /api/v1/risks/{id}` - Обновление информации о риске
- `DELETE /api/v1/risks/{id}` - Удаление риска
- `POST /api/v1/risks/{id}/status` - Обновление статуса риска
- `GET /api/v1/risks/project/{projectId}` - Получение рисков проекта
- `GET /api/v1/risks/severity/{level}` - Получение рисков по уровню серьезности

#### Параметры:
- Фильтрация: `status`, `severity`, `projectId`
- Сортировка: `probability`, `impact`, `severity`

### 5. KPI и отчетность

#### Endpoints:
- `GET /api/v1/kpis` - Получение списка KPI
- `POST /api/v1/kpis` - Создание нового KPI
- `GET /api/v1/kpis/{id}` - Получение информации о KPI
- `PUT /api/v1/kpis/{id}` - Обновление KPI
- `DELETE /api/v1/kpis/{id}` - Удаление KPI
- `GET /api/v1/kpis/entity/{type}/{id}` - Получение KPI сущности
- `GET /api/v1/reports/portfolio` - Получение отчета по портфелю
- `GET /api/v1/reports/technology` - Получение отчета по технологиям
- `GET /api/v1/reports/export` - Экспорт отчета

#### Параметры:
- Фильтрация: `entityType`, `entityId`, `dateFrom`, `dateTo`
- Формат экспорта: `format` (csv, excel, pdf, json)

### 6. Администрирование и безопасность

#### Endpoints:
- `GET /api/v1/users` - Получение списка пользователей
- `POST /api/v1/users` - Создание пользователя
- `GET /api/v1/users/{id}` - Получение информации о пользователе
- `PUT /api/v1/users/{id}` - Обновление информации о пользователе
- `DELETE /api/v1/users/{id}` - Удаление пользователя
- `GET /api/v1/audit` - Получение аудит лога
- `GET /api/v1/roles` - Получение списка ролей
- `POST /api/v1/roles` - Создание новой роли

#### Параметры:
- Пагинация: `page`, `limit`
- Фильтрация: `role`, `active`
- Сортировка: `name`, `email`, `createdAt`

## GraphQL API (опционально)

Для сложных отчетов и аналитики доступен GraphQL endpoint:

- `POST /api/v1/graphql` - GraphQL API

### Примеры запросов:
```graphql
# Получение проекта с задачами и рисками
query GetProject($id: ID!) {
  project(id: $id) {
    id
    name
    description
    status
    budget
    spent
    forecast
    tasks {
      id
      title
      status
      dueDate
    }
    risks {
      id
      description
      severity
      status
    }
  }
}

# Получение отчета по портфелю
query PortfolioReport {
  portfolioReport {
    totalProjects
    activeProjects
    completedProjects
    totalBudget
    totalSpent
    risksCount
    criticalRisks
  }
}
```

## Интеграционные endpoints

### Входящие данные:
- `POST /api/v1/integrations/jira/webhook` - Вебхук от Jira
- `POST /api/v1/integrations/csv/upload` - Загрузка CSV данных
- `POST /api/v1/integrations/erp/data` - Прием данных от ERP систем

### Исходящие уведомления:
- `POST /api/v1/notifications/webhook` - Отправка вебхука
- `POST /api/v1/notifications/email` - Отправка email
- `POST /api/v1/notifications/slack` - Отправка в Slack

## Метрики и мониторинг

- `GET /healthz` - Health check
- `GET /metrics` - Метрики Prometheus
- `GET /api/v1/insights/portfolio-status` - Статус портфеля
- `GET /api/v1/insights/technology-status` - Статус технологий

## Rate limiting

Для всех endpoints применяется рейт-лимитинг:
- 1000 запросов в час на IP
- 10000 запросов в час на пользователя