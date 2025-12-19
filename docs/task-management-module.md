# Модуль управления задачами

## Общие принципы

Модуль управления задачами отвечает за планирование, отслеживание и контроль выполнения задач в рамках проектов. Он обеспечивает управление зависимостями задач, контроль сроков выполнения, распределение ресурсов и интеграцию с системами управления проектами.

## Архитектура модуля

### Структура каталогов

```
tasks/
├── domain/          // Бизнес-логика и сущности задач
│   ├── entities/    // Сущности задач
│   ├── interfaces/  // Интерфейсы репозиториев
│   └── services/   // Бизнес-логика
├── application/      // Сервисы и use-case'ы управления задачами
│   ├── dto/         // DTO для передачи данных
│   ├── use-cases/   // Сценарии использования
│   └── services/    // Сервисы приложения
├── infrastructure/  // Репозитории, DTO, внешние интерфейсы
│   ├── repositories/  // Реализации репозиториев
│   ├── persistence/ // Модели базы данных
│   └── mappers/      // Мапперы между слоями
└── interfaces/      // REST/GraphQL контроллеры
    ├── rest/        // REST контроллеры
    └── graphql/     // GraphQL резолверы
```

## Доменная модель

### Сущности

#### Task (Задача)

Основная сущность модуля, представляющая задачу в системе.

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: User;
  reporter: User;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  loggedHours: number;
  remainingHours: number;
  dependencies: Task[]; // Зависимости задач
  dependents: Task[];   // Задачи, зависящие от этой
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
```

#### TaskDependency (Зависимость задачи)

Отслеживает зависимости между задачами.

```typescript
interface TaskDependency {
  id: string;
  taskId: string;      // Задача, которая зависит
  dependencyId: string;  // Задача, от которой зависит
  type: 'blocked-by' | 'relates-to';
  createdAt: Date;
}
```

#### TaskLog (Лог выполнения задачи)

Отслеживает время, затраченное на выполнение задачи.

```typescript
interface TaskLog {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  loggedAt: Date;
}
```

#### TaskComment (Комментарий к задаче)

Комментарии пользователей к задаче.

```typescript
interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Прикладные сервисы

### TaskService

Основной сервис для управления задачами.

#### Методы

- `createTask(dto: CreateTaskDTO): Promise<Task>` - Создание новой задачи
- `updateTask(id: string, dto: UpdateTaskDTO): Promise<Task>` - Обновление задачи
- `getTask(id: string): Promise<Task>` - Получение задачи по ID
- `getTasks(filter: TaskFilter): Promise<Task[]>` - Получение списка задач
- `deleteTask(id: string): Promise<void>` - Удаление задачи
- `updateTaskStatus(id: string, status: TaskStatus): Promise<Task>` - Обновление статуса задачи
- `getTaskDependencies(id: string): Promise<Task[]>` - Получение зависимостей задачи
- `getTaskDependents(id: string): Promise<Task[]>` - Получение зависимых задач

### TaskDependencyService

Сервис для управления зависимостями задач.

#### Методы

- `addDependency(taskId: string, dependencyId: string): Promise<void>` - Добавление зависимости
- `removeDependency(taskId: string, dependencyId: string): Promise<void>` - Удаление зависимости
- `checkCircularDependencies(taskId: string): Promise<boolean>` - Проверка циклических зависимостей
- `getBlockers(taskId: string): Promise<Task[]>` - Получение блокирующих задач
- `getBlockedTasks(taskId: string): Promise<Task[]>` - Получение блокируемых задач

### TaskLogService

Сервис для учета времени выполнения задач.

#### Методы

- `logTime(taskId: string, dto: LogTimeDTO): Promise<TaskLog>` - Учет времени выполнения
- `getTaskLogs(taskId: string): Promise<TaskLog[]>` - Получение логов задачи
- `getUserLogs(userId: string, filter: TimeLogFilter): Promise<TaskLog[]>` - Получение логов пользователя
- `calculateLoggedHours(taskId: string): Promise<number>` - Расчет затраченного времени
- `updateRemainingHours(taskId: string, hours: number): Promise<Task>` - Обновление оставшегося времени

### TaskSchedulingService

Сервис для управления расписанием задач.

#### Методы

- `calculateCriticalPath(projectId: string): Promise<Task[]>` - Расчет критического пути
- `suggestTaskDates(taskId: string): Promise<SuggestedDates>` - Предложение дат выполнения
- `checkResourceOverallocation(userId: string): Promise<Overallocation[]>` - Проверка перегрузки ресурсов
- `rescheduleTasks(projectId: string): Promise<void>` - Перепланирование задач проекта

## Use-case'ы

### Создание задачи

1. Валидация входных данных
2. Создание новой сущности задачи
3. Назначение исполнителя и репортера
4. Установка начального статуса "todo"
5. Проверка зависимостей
6. Сохранение задачи в репозитории
7. Логирование события создания

### Обновление статуса задачи

1. Проверка прав доступа пользователя
2. Проверка возможности изменения статуса (учет зависимостей)
3. Валидация нового статуса
4. Обновление статуса задачи
5. Пересчет оставшегося времени
6. Отправка уведомлений при изменении статуса
7. Обновление связанных задач

### Добавление зависимости

1. Проверка прав доступа к обеим задачам
2. Проверка на циклические зависимости
3. Создание записи о зависимости
4. Обновление статуса зависимой задачи при необходимости
5. Пересчет критического пути проекта
6. Логирование события добавления зависимости

### Учет времени выполнения

1. Проверка прав доступа к задаче
2. Валидация введенного времени
3. Создание записи лога времени
4. Обновление затраченного времени задачи
5. Пересчет оставшегося времени
6. Обновление статуса задачи при необходимости

### Планирование задач

1. Получение всех задач проекта
2. Построение графа зависимостей
3. Расчет критического пути
4. Проверка ресурсной загрузки
5. Предложение оптимальных дат выполнения
6. Уведомление о конфликтах

## Интерфейсы

### REST API

#### Основные endpoints

- `POST /api/v1/tasks` - Создание задачи
- `GET /api/v1/tasks` - Получение списка задач
- `GET /api/v1/tasks/{id}` - Получение задачи
- `PUT /api/v1/tasks/{id}` - Обновление задачи
- `DELETE /api/v1/tasks/{id}` - Удаление задачи
- `POST /api/v1/tasks/{id}/status` - Обновление статуса задачи
- `POST /api/v1/tasks/{id}/dependencies` - Добавление зависимости
- `DELETE /api/v1/tasks/{id}/dependencies/{dependencyId}` - Удаление зависимости
- `POST /api/v1/tasks/{id}/log` - Учет времени выполнения
- `GET /api/v1/tasks/{id}/logs` - Получение логов задачи
- `GET /api/v1/tasks/project/{projectId}` - Получение задач проекта
- `GET /api/v1/tasks/assignee/{assigneeId}` - Получение задач по исполнителю

#### DTO

```typescript
// DTO для создания задачи
interface CreateTaskDTO {
  title: string;
  description: string;
  assigneeId: string;
  reporterId: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  dependencyIds: string[];
  tags: string[];
}

// DTO для обновления задачи
interface UpdateTaskDTO {
  title?: string;
  description?: string;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
}

// DTO для обновления статуса
interface UpdateTaskStatusDTO {
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
}

// DTO для учета времени
interface LogTimeDTO {
  hours: number;
  description: string;
  userId: string;
}

// DTO для добавления зависимости
interface AddDependencyDTO {
  dependencyId: string;
  type: 'blocked-by' | 'relates-to';
}
```

### GraphQL

#### Типы

```graphql
type Task {
  id: ID!
  title: String!
  description: String
  assignee: User!
  reporter: User!
  status: TaskStatus!
  priority: TaskPriority!
  project: Project!
  startDate: DateTime
  dueDate: DateTime
  estimatedHours: Float
  loggedHours: Float
  remainingHours: Float
  dependencies: [Task!]!
  dependents: [Task!]!
  tags: [String!]!
  logs: [TaskLog!]!
  comments: [TaskComment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  BLOCKED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

type TaskDependency {
  id: ID!
  task: Task!
  dependency: Task!
  type: DependencyType!
  createdAt: DateTime!
}

enum DependencyType {
  BLOCKED_BY
  RELATES_TO
}

type TaskLog {
  id: ID!
  task: Task!
  user: User!
  hours: Float!
  description: String
  loggedAt: DateTime!
}

type TaskComment {
  id: ID!
  task: Task!
  user: User!
  content: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CriticalPath {
  tasks: [Task!]!
  totalDuration: Float!
}

type ResourceOverallocation {
  user: User!
  date: DateTime!
  overallocatedHours: Float!
}
```

#### Запросы

```graphql
type Query {
  tasks(filter: TaskFilter): [Task!]!
  task(id: ID!): Task
  taskDependencies(taskId: ID!): [Task!]!
  taskLogs(taskId: ID!): [TaskLog!]!
  userTaskLogs(userId: ID!, filter: TimeLogFilter): [TaskLog!]!
  criticalPath(projectId: ID!): CriticalPath
  resourceOverallocations(userId: ID!): [ResourceOverallocation!]!
}

type Mutation {
  createTask(input: CreateTaskInput!): Task!
  updateTask(id: ID!, input: UpdateTaskInput!): Task!
  updateTaskStatus(taskId: ID!, input: UpdateTaskStatusInput!): Task!
  addTaskDependency(taskId: ID!, input: AddDependencyInput!): Task!
  removeTaskDependency(taskId: ID!, dependencyId: ID!): Task!
  logTaskTime(taskId: ID!, input: LogTimeInput!): TaskLog!
  addTaskComment(taskId: ID!, content: String!): TaskComment!
}
```

## Интеграции

### Входящие интеграции

- Jira/YouTrack webhook для синхронизации задач
- Календари пользователей для учета занятости
- Системы учета времени (Toggl, Harvest)

### Исходящие интеграции

- Уведомления в Slack/MS Teams о сроках выполнения
- Email уведомления о блокирующих задачах
- Вебхуки для внешних систем отчетности
- Календари пользователей для планирования задач

## Бизнес-правила

### Правила статусов

- Задача может быть переведена в статус "in-progress" только если нет блокирующих задач
- Задача может быть переведена в статус "done" только если все подзадачи завершены
- При наличии зависимостей задача автоматически получает статус "blocked"

### Правила зависимостей

- Нельзя создавать циклические зависимости
- При удалении задачи удаляются все зависимости с ней связанные
- Блокирующие задачи должны быть завершены до начала зависимой задачи

### Правила учета времени

- Время может учитываться только для задач в статусе "in-progress"
- Суммарное учтенное время не может превышать оценку более чем на 200%
- При учете времени автоматически пересчитывается оставшееся время

### Правила планирования

- Задачи с высоким приоритетом получают приоритет при планировании
- При перегрузке ресурсов система предлагает перераспределение
- Критический путь проекта отображается в отчетах

## Отчетность

### Стандартные отчеты

- Список задач (с фильтрацией по статусам, приоритетам, проектам)
- Отчет по времени (учтенное время по задачам, пользователям, проектам)
- Отчет по зависимостям (граф зависимостей, критический путь)
- Отчет по ресурсам (загрузка пользователей, перегрузки)
- Отчет по срокам (просроченные задачи, задачи на сегодня)

### Экспорт отчетов

- CSV для импорта в Excel
- PDF для печати и архивирования
- JSON для интеграции с другими системами
- Gantt диаграмма для визуализации сроков

## Аудит и логирование

### События аудита

- Создание задачи
- Изменение параметров задачи
- Изменение статуса задачи
- Добавление/удаление зависимостей
- Учет времени выполнения
- Добавление комментариев

### Логирование

- Все изменения задачи логируются с указанием пользователя
- Логи доступны через API аудита
- Логи экспортируются для архивирования
