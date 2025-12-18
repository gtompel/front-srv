# Модуль управления проектами

## Общие принципы

Модуль управления проектами отвечает за создание, управление и отслеживание проектов в организации. Он обеспечивает полный жизненный цикл проекта от инициации до завершения, включая планирование, контроль бюджета, управление командой и отслеживание KPI.

## Архитектура модуля

### Структура каталогов

```
projects/
├── domain/          // Бизнес-логика и сущности проектов
│   ├── entities/   // Сущности проекта
│   ├── interfaces/  // Интерфейсы репозиториев
│   └── services/   // Бизнес-логика
├── application/      // Сервисы и use-case'ы управления проектами
│   ├── dto/         // DTO для передачи данных
│   ├── use-cases/   // Сценарии использования
│   └── services/     // Сервисы приложения
├── infrastructure/  // Репозитории, DTO, внешние интерфейсы
│   ├── repositories/ // Реализации репозиториев
│   ├── persistence/  // Модели базы данных
│   └── mappers/      // Мапперы между слоями
└── interfaces/      // REST/GraphQL контроллеры
    ├── rest/        // REST контроллеры
    └── graphql/     // GraphQL резолверы
```

## Доменная модель

### Сущности

#### Project (Проект)
Основная сущность модуля, представляющая проект в системе.

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  businessGoals: string[];
  owner: User;
  team: User[];
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  phase: 'planning' | 'development' | 'testing' | 'release';
  timeline: {
    start: Date;
    end: Date;
    actualEnd?: Date;
  };
  budget: number;
  spent: number;
  forecast: number;
  kpis: KPI[];
  technologies: Technology[];
  tasks: Task[];
  risks: Risk[];
  metadata: Metadata;
}
```

#### ProjectStatusHistory (История статусов проекта)
Отслеживает изменения статуса проекта во времени.

```typescript
interface ProjectStatusHistory {
  id: string;
  projectId: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  changedAt: Date;
  changedBy: User;
}
```

## Прикладные сервисы

### ProjectService
Основной сервис для управления проектами.

#### Методы:
- `createProject(dto: CreateProjectDTO): Promise<Project>` - Создание нового проекта
- `updateProject(id: string, dto: UpdateProjectDTO): Promise<Project>` - Обновление проекта
- `getProject(id: string): Promise<Project>` - Получение проекта по ID
- `getProjects(filter: ProjectFilter): Promise<Project[]>` - Получение списка проектов
- `deleteProject(id: string): Promise<void>` - Удаление проекта
- `updateProjectStatus(id: string, status: ProjectStatus, phase: ProjectPhase): Promise<Project>` - Обновление статуса проекта
- `calculateForecast(project: Project): Promise<number>` - Расчет прогноза расходов
- `getProjectTeam(id: string): Promise<User[]>` - Получение команды проекта

### ProjectBudgetService
Сервис для управления бюджетом проекта.

#### Методы:
- `updateBudget(projectId: string, budget: number): Promise<Project>` - Обновление бюджета
- `recordExpense(projectId: string, amount: number, description: string): Promise<void>` - Запись расхода
- `getBudgetReport(projectId: string): Promise<BudgetReport>` - Получение отчета по бюджету
- `checkBudgetThreshold(project: Project): Promise<void>` - Проверка порога бюджета

### ProjectKpiService
Сервис для управления KPI проекта.

#### Методы:
- `createKpi(projectId: string, dto: CreateKpiDTO): Promise<KPI>` - Создание KPI
- `updateKpi(kpiId: string, dto: UpdateKpiDTO): Promise<KPI>` - Обновление KPI
- `getProjectKpis(projectId: string): Promise<KPI[]>` - Получение KPI проекта
- `calculateKpi(kpi: KPI): Promise<number>` - Расчет значения KPI

## Use-case'ы

### Создание проекта
1. Валидация входных данных
2. Создание новой сущности проекта
3. Назначение владельца проекта
4. Инициализация бюджета и сроков
5. Сохранение проекта в репозитории
6. Логирование события создания

### Обновление статуса проекта
1. Проверка прав доступа пользователя
2. Валидация нового статуса
3. Обновление статуса и фазы проекта
4. Запись в историю статусов
5. Пересчет прогноза при необходимости
6. Отправка уведомлений при изменении статуса

### Расчет прогноза
1. Получение текущих расходов проекта
2. Анализ выполненных задач
3. Прогнозирование оставшихся работ
4. Расчет прогнозируемых расходов
5. Обновление поля forecast в проекте

### Управление командой проекта
1. Добавление участников в команду
2. Удаление участников из команды
3. Изменение роли участника
4. Уведомление новых участников
5. Обновление прав доступа

## Интерфейсы

### REST API

#### Основные endpoints:
- `POST /api/v1/projects` - Создание проекта
- `GET /api/v1/projects` - Получение списка проектов
- `GET /api/v1/projects/{id}` - Получение проекта
- `PUT /api/v1/projects/{id}` - Обновление проекта
- `DELETE /api/v1/projects/{id}` - Удаление проекта
- `POST /api/v1/projects/{id}/status` - Обновление статуса
- `POST /api/v1/projects/{id}/team` - Добавление участника в команду
- `DELETE /api/v1/projects/{id}/team/{userId}` - Удаление участника из команды

#### DTO:

```typescript
// DTO для создания проекта
interface CreateProjectDTO {
  name: string;
  description: string;
  businessGoals: string[];
  ownerId: string;
  teamIds: string[];
  timeline: {
    start: Date;
    end: Date;
  };
  budget: number;
}

// DTO для обновления проекта
interface UpdateProjectDTO {
  name?: string;
  description?: string;
  businessGoals?: string[];
  ownerId?: string;
  timeline?: {
    start?: Date;
    end?: Date;
  };
}

// DTO для обновления статуса
interface UpdateProjectStatusDTO {
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  phase: 'planning' | 'development' | 'testing' | 'release';
}
```

### GraphQL

#### Типы:

```graphql
type Project {
  id: ID!
  name: String!
  description: String
  businessGoals: [String!]!
  owner: User!
  team: [User!]!
  status: ProjectStatus!
  phase: ProjectPhase!
  timeline: ProjectTimeline!
  budget: Float!
  spent: Float!
  forecast: Float!
  kpis: [KPI!]!
  technologies: [Technology!]!
  tasks: [Task!]!
  risks: [Risk!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ProjectTimeline {
  start: DateTime!
  end: DateTime!
  actualEnd: DateTime
}

enum ProjectStatus {
  DRAFT
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum ProjectPhase {
  PLANNING
  DEVELOPMENT
  TESTING
  RELEASE
}

type BudgetReport {
  budget: Float!
  spent: Float!
  forecast: Float!
  variance: Float!
  variancePercentage: Float!
}
```

#### Запросы:

```graphql
type Query {
  projects(filter: ProjectFilter): [Project!]!
  project(id: ID!): Project
  projectBudgetReport(projectId: ID!): BudgetReport
}

type Mutation {
  createProject(input: CreateProjectInput!): Project!
  updateProject(id: ID!, input: UpdateProjectInput!): Project!
  updateProjectStatus(projectId: ID!, input: UpdateProjectStatusInput!): Project!
  addTeamMember(projectId: ID!, userId: ID!): Project!
  removeTeamMember(projectId: ID!, userId: ID!): Project!
}
```

## Интеграции

### Входящие интеграции
- Jira/YouTrack webhook для синхронизации задач
- CSV/Excel импорт для массового создания проектов
- ERP системы для получения данных о бюджете

### Исходящие интеграции
- Уведомления в Slack/MS Teams при изменении статуса
- Email уведомления о превышении бюджета
- Вебхуки для внешних систем отчетности

## Бизнес-правила

### Правила статусов
- Проект может быть переведен в статус "completed" только если все задачи завершены
- Проект в статусе "completed" или "cancelled" не может быть изменен
- При переходе в статус "active" проверяется наличие команды

### Бюджетные правила
- Бюджет может быть изменен только в статусе "draft" или "planning"
- При превышении 80% бюджета отправляется уведомление
- Прогноз автоматически пересчитывается при изменении расходов

### Правила команды
- Владелец проекта всегда является членом команды
- Удалить владельца из команды нельзя
- Минимальный размер команды - 1 человек (владелец)

## Отчетность

### Стандартные отчеты
- Статус проекта (текущий статус, фаза, сроки)
- Бюджетный отчет (бюджет, расходы, прогноз)
- Командный отчет (участники, роли)
- Технологический отчет (используемые технологии)
- Рисковой отчет (идентифицированные риски)

### Экспорт отчетов
- CSV для импорта в Excel
- PDF для печати и архивирования
- JSON для интеграции с другими системами

## Аудит и логирование

### События аудита
- Создание проекта
- Изменение основных параметров проекта
- Изменение статуса проекта
- Изменение бюджета
- Добавление/удаление участников команды
- Создание/обновление KPI

### Логирование
- Все изменения проекта логируются с указанием пользователя
- Логи доступны через API аудита
- Логи экспортируются для архивирования