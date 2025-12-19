# Модуль управления технологиями

## Общие принципы

Модуль управления технологиями отвечает за каталогизацию, отслеживание жизненного цикла и управление используемыми технологиями в проектах. Он обеспечивает контроль за технологическим стеком организации, предупреждает об устаревании технологий и поддерживает информацию о владельцах и использовании технологий.

## Архитектура модуля

### Структура каталогов

```
technologies/
├── domain/          // Бизнес-логика и сущности технологий
│   ├── entities/    // Сущности технологии
│   ├── interfaces/  // Интерфейсы репозиториев
│   └── services/   // Бизнес-логика
├── application/      // Сервисы и use-case'ы управления технологиями
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

#### Technology (Технология)

Основная сущность модуля, представляющая технологию в системе.

```typescript
interface Technology {
  id: string;
  name: string;
  category: string; // 'frontend', 'backend', 'database', 'infrastructure', 'ci/cd'
  version: string;
  description: string;
  lifecycleStage: 'selection' | 'deployment' | 'operation' | 'deprecation' | 'retired';
  owningArchitect: User;
  projects: Project[];
  releaseDate: Date;
  endOfLifeDate: Date;
  supportEndDate: Date;
  vendor: string;
  license: string;
  documentationUrl: string;
  repositoryUrl: string;
  metadata: Metadata;
}
```

#### TechnologyLifecycle (Жизненный цикл технологии)

Отслеживает изменения стадии жизненного цикла технологии.

```typescript
interface TechnologyLifecycle {
  id: string;
  technologyId: string;
  stage: TechnologyLifecycleStage;
  changedAt: Date;
  changedBy: User;
  reason: string;
}
```

#### TechnologyAssessment (Оценка технологии)

Оценка технологии по различным критериям.

```typescript
interface TechnologyAssessment {
  id: string;
  technologyId: string;
  criteria: string; // 'security', 'performance', 'maintainability', 'community', 'documentation'
  score: number; // 1-10
  assessedAt: Date;
  assessedBy: User;
  comments: string;
}
```

## Прикладные сервисы

### TechnologyService

Основной сервис для управления технологиями.

#### Методы

- `createTechnology(dto: CreateTechnologyDTO): Promise<Technology>` - Создание новой технологии
- `updateTechnology(id: string, dto: UpdateTechnologyDTO): Promise<Technology>` - Обновление технологии
- `getTechnology(id: string): Promise<Technology>` - Получение технологии по ID
- `getTechnologies(filter: TechnologyFilter): Promise<Technology[]>` - Получение списка технологий
- `deleteTechnology(id: string): Promise<void>` - Удаление технологии
- `updateLifecycleStage(id: string, stage: TechnologyLifecycleStage, reason: string): Promise<Technology>` - Обновление стадии жизненного цикла
- `getTechnologyProjects(id: string): Promise<Project[]>` - Получение проектов, использующих технологию

### TechnologyAssessmentService

Сервис для оценки технологий.

#### Методы

- `createAssessment(technologyId: string, dto: CreateAssessmentDTO): Promise<TechnologyAssessment>` - Создание оценки
- `getAssessments(technologyId: string): Promise<TechnologyAssessment[]>` - Получение оценок технологии
- `calculateOverallScore(technologyId: string): Promise<number>` - Расчет общего рейтинга технологии
- `getTechnologyRisks(technologyId: string): Promise<Risk[]>` - Получение рисков, связанных с технологией

### TechnologyLifecycleService

Сервис для управления жизненным циклом технологий.

#### Методы

- `checkEndOfLife(): Promise<Technology[]>` - Проверка технологий, приближающихся к концу жизни
- `notifyDeprecation(technologyId: string): Promise<void>` - Уведомление о начале процесса устаревания
- `retireTechnology(id: string): Promise<Technology>` - Перевод технологии в статус "retired"
- `getLifecycleHistory(technologyId: string): Promise<TechnologyLifecycle[]>` - Получение истории жизненного цикла

## Use-case'ы

### Создание технологии

1. Валидация входных данных
2. Создание новой сущности технологии
3. Назначение владельца-архитектора
4. Установка начальной стадии жизненного цикла
5. Сохранение технологии в репозитории
6. Логирование события создания

### Обновление стадии жизненного цикла

1. Проверка прав доступа пользователя
2. Валидация новой стадии
3. Обновление стадии жизненного цикла
4. Запись в историю изменений
5. Отправка уведомлений при переходе в стадию "deprecation" или "retired"
6. Обновление связанных проектов

### Оценка технологии

1. Проверка прав доступа для оценки
2. Валидация критериев оценки
3. Создание записи об оценке
4. Пересчет общего рейтинга технологии
5. Обновление информации о технологии
6. Уведомление владельца о новой оценке

### Проверка устаревания

1. По расписанию проверять даты окончания поддержки
2. Идентифицировать технологии, приближающиеся к концу жизни
3. Создавать риски для проектов, использующих устаревающие технологии
4. Уведомлять владельцев проектов
5. Обновлять статус технологии на "deprecation"

## Интерфейсы

### REST API

#### Основные endpoints

- `POST /api/v1/technologies` - Создание технологии
- `GET /api/v1/technologies` - Получение списка технологий
- `GET /api/v1/technologies/{id}` - Получение технологии
- `PUT /api/v1/technologies/{id}` - Обновление технологии
- `DELETE /api/v1/technologies/{id}` - Удаление технологии
- `POST /api/v1/technologies/{id}/lifecycle` - Обновление стадии жизненного цикла
- `GET /api/v1/technologies/{id}/projects` - Получение проектов технологии
- `GET /api/v1/technologies/{id}/assessments` - Получение оценок технологии
- `POST /api/v1/technologies/{id}/assessments` - Создание оценки технологии

#### DTO

```typescript
// DTO для создания технологии
interface CreateTechnologyDTO {
  name: string;
  category: string;
  version: string;
  description: string;
  owningArchitectId: string;
  releaseDate: Date;
  endOfLifeDate: Date;
  supportEndDate: Date;
  vendor: string;
  license: string;
  documentationUrl: string;
  repositoryUrl: string;
}

// DTO для обновления технологии
interface UpdateTechnologyDTO {
  name?: string;
  category?: string;
  version?: string;
  description?: string;
  owningArchitectId?: string;
  releaseDate?: Date;
  endOfLifeDate?: Date;
  supportEndDate?: Date;
  vendor?: string;
  license?: string;
  documentationUrl?: string;
  repositoryUrl?: string;
}

// DTO для обновления стадии жизненного цикла
interface UpdateLifecycleDTO {
  stage: 'selection' | 'deployment' | 'operation' | 'deprecation' | 'retired';
  reason: string;
}

// DTO для создания оценки
interface CreateAssessmentDTO {
  criteria: string;
  score: number;
  comments: string;
}
```

### GraphQL

#### Типы

```graphql
type Technology {
  id: ID!
  name: String!
  category: String!
  version: String!
  description: String
  lifecycleStage: TechnologyLifecycleStage!
  owningArchitect: User!
  projects: [Project!]!
  releaseDate: DateTime
  endOfLifeDate: DateTime
  supportEndDate: DateTime
  vendor: String
  license: String
  documentationUrl: String
  repositoryUrl: String
  overallScore: Float
  assessments: [TechnologyAssessment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum TechnologyLifecycleStage {
  SELECTION
  DEPLOYMENT
  OPERATION
  DEPRECATION
  RETIRED
}

type TechnologyAssessment {
  id: ID!
  criteria: String!
  score: Int!
  assessedAt: DateTime!
  assessedBy: User!
  comments: String
}

type TechnologyLifecycle {
  id: ID!
  stage: TechnologyLifecycleStage!
  changedAt: DateTime!
  changedBy: User!
  reason: String
}

type TechnologyReport {
  totalTechnologies: Int!
  byCategory: [CategoryCount!]!
  byLifecycleStage: [LifecycleCount!]!
  deprecatedCount: Int!
  endOfLifeCount: Int!
}

type CategoryCount {
  category: String!
  count: Int!
}

type LifecycleCount {
  stage: TechnologyLifecycleStage!
  count: Int!
}
```

#### Запросы

```graphql
type Query {
  technologies(filter: TechnologyFilter): [Technology!]!
  technology(id: ID!): Technology
  technologyReport: TechnologyReport
  endOfLifeTechnologies: [Technology!]!
}

type Mutation {
  createTechnology(input: CreateTechnologyInput!): Technology!
  updateTechnology(id: ID!, input: UpdateTechnologyInput!): Technology!
  updateTechnologyLifecycle(technologyId: ID!, input: UpdateLifecycleInput!): Technology!
  createTechnologyAssessment(technologyId: ID!, input: CreateAssessmentInput!): TechnologyAssessment!
}
```

## Интеграции

### Входящие интеграции

- Системы управления пакетами для получения информации о версиях
- Внешние базы данных технологий (например, Snyk, OWASP)
- CI/CD системы для отслеживания использования технологий

### Исходящие интеграции

- Уведомления в Slack/MS Teams о статусе технологий
- Email уведомления о приближении конца поддержки
- Вебхуки для внешних систем мониторинга

## Бизнес-правила

### Правила жизненного цикла

- Технология может быть переведена в статус "deprecation" только из статусов "deployment" или "operation"
- Технология может быть переведена в статус "retired" только из статуса "deprecation"
- При переходе в статус "deprecation" создаются риски для всех связанных проектов

### Правила оценки

- Оценка может быть создана только пользователями с ролью "architect" или "admin"
- Оценка по каждому критерию может быть только одна активная
- Общий рейтинг пересчитывается при каждой новой оценке

### Правила устаревания

- За 6 месяцев до окончания поддержки технология автоматически переводится в статус "deprecation"
- За 1 месяц до окончания поддержки отправляются уведомления всем владельцам проектов
- Технологии в статусе "deprecation" отображаются с предупреждением в отчетах

## Отчетность

### Стандартные отчеты

- Каталог технологий (с фильтрацией по категориям, статусам)
- Отчет по жизненному циклу (количество технологий по стадиям)
- Отчет по устареванию (технологии, приближающиеся к концу поддержки)
- Отчет по оценкам (рейтинги технологий)
- Использование технологий в проектах

### Экспорт отчетов

- CSV для импорта в Excel
- PDF для печати и архивирования
- JSON для интеграции с другими системами

## Аудит и логирование

### События аудита

- Создание технологии
- Изменение параметров технологии
- Изменение стадии жизненного цикла
- Создание оценки технологии
- Перевод технологии в статус "deprecation" или "retired"

### Логирование

- Все изменения технологии логируются с указанием пользователя
- Логи доступны через API аудита
- Логи экспортируются для архивирования
