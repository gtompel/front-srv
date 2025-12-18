# Модуль управления рисками

## Общие принципы

Модуль управления рисками отвечает за идентификацию, оценку, мониторинг и контроль рисков, связанных с проектами и технологиями. Он обеспечивает систематический подход к управлению рисками, включая регистрацию, анализ, планирование мер по снижению и отслеживание статуса рисков.

## Архитектура модуля

### Структура каталогов

```
risks/
├── domain/          // Бизнес-логика и сущности рисков
│   ├── entities/    // Сущности рисков
│   ├── interfaces/  // Интерфейсы репозиториев
│   └── services/   // Бизнес-логика
├── application/      // Сервисы и use-case'ы управления рисками
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

#### Risk (Риск)

Основная сущность модуля, представляющая риск в системе.

```typescript
interface Risk {
  id: string;
  title: string;
  description: string;
  projectId: string;
  ownerId: User;
  probability: number; // 0-1
  impact: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical'; // Автоматически рассчитывается
  category: 'technical' | 'schedule' | 'budget' | 'resource' | 'external';
  mitigationPlan: string;
  contingencyPlan: string;
  status: 'identified' | 'analyzed' | 'mitigation' | 'monitored' | 'closed' | 'realized';
  triggerConditions: string[];
  responseStrategy: 'avoid' | 'mitigate' | 'transfer' | 'accept';
  relatedRisks: Risk[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
```

#### RiskAssessment (Оценка риска)

Оценка риска по различным параметрам.

```typescript
interface RiskAssessment {
  id: string;
  riskId: string;
  assessedBy: User;
  probability: number; // 0-1
  impact: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  assessmentDate: Date;
  comments: string;
}
```

#### RiskMitigation (Меры по снижению риска)

Конкретные действия по снижению риска.

```typescript
interface RiskMitigation {
  id: string;
  riskId: string;
  action: string;
  responsible: User;
  dueDate: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  cost: number;
  effectiveness: number; // 0-1
  createdAt: Date;
  updatedAt: Date;
}
```

#### RiskMonitoring (Мониторинг риска)

Отслеживание изменений риска во времени.

```typescript
interface RiskMonitoring {
  id: string;
  riskId: string;
  monitoredAt: Date;
  probability: number;
  impact: number;
  status: RiskStatus;
  comments: string;
  monitoredBy: User;
}
```

## Прикладные сервисы

### RiskService

Основной сервис для управления рисками.

#### Методы

- `createRisk(dto: CreateRiskDTO): Promise<Risk>` - Создание нового риска
- `updateRisk(id: string, dto: UpdateRiskDTO): Promise<Risk>` - Обновление риска
- `getRisk(id: string): Promise<Risk>` - Получение риска по ID
- `getRisks(filter: RiskFilter): Promise<Risk[]>` - Получение списка рисков
- `deleteRisk(id: string): Promise<void>` - Удаление риска
- `updateRiskStatus(id: string, status: RiskStatus): Promise<Risk>` - Обновление статуса риска
- `calculateSeverity(probability: number, impact: number): RiskSeverity` - Расчет серьезности риска
- `getProjectRisks(projectId: string): Promise<Risk[]>` - Получение рисков проекта

### RiskAssessmentService

Сервис для оценки рисков.

#### Методы

- `createAssessment(riskId: string, dto: CreateAssessmentDTO): Promise<RiskAssessment>` - Создание оценки риска
- `getAssessments(riskId: string): Promise<RiskAssessment[]>` - Получение оценок риска
- `updateAssessment(id: string, dto: UpdateAssessmentDTO): Promise<RiskAssessment>` - Обновление оценки
- `calculateRiskScore(riskId: string): Promise<number>` - Расчет общего рейтинга риска
- `getLatestAssessment(riskId: string): Promise<RiskAssessment>` - Получение последней оценки

### RiskMitigationService

Сервис для управления мерами по снижению рисков.

#### Методы

- `createMitigation(riskId: string, dto: CreateMitigationDTO): Promise<RiskMitigation>` - Создание меры по снижению
- `updateMitigation(id: string, dto: UpdateMitigationDTO): Promise<RiskMitigation>` - Обновление меры
- `getMitigations(riskId: string): Promise<RiskMitigation[]>` - Получение мер по риску
- `updateMitigationStatus(id: string, status: MitigationStatus): Promise<RiskMitigation>` - Обновление статуса меры
- `calculateEffectiveness(mitigationId: string): Promise<number>` - Расчет эффективности меры

### RiskMonitoringService

Сервис для мониторинга рисков.

#### Методы

- `createMonitoring(riskId: string, dto: CreateMonitoringDTO): Promise<RiskMonitoring>` - Создание записи мониторинга
- `getMonitoringHistory(riskId: string): Promise<RiskMonitoring[]>` - Получение истории мониторинга
- `generateRiskReport(projectId: string): Promise<RiskReport>` - Генерация отчета по рискам
- `sendRiskAlerts(): Promise<void>` - Отправка уведомлений о рисках
- `triggerRiskReview(riskId: string): Promise<void>` - Инициация пересмотра риска

## Use-case'ы

### Создание риска

1. Валидация входных данных
2. Создание новой сущности риска
3. Назначение владельца риска
4. Первоначальная оценка вероятности и влияния
5. Расчет серьезности риска
6. Установка начального статуса "identified"
7. Сохранение риска в репозитории
8. Логирование события создания

### Оценка риска

1. Проверка прав доступа пользователя
2. Валидация параметров оценки
3. Создание записи об оценке
4. Пересчет серьезности риска
5. Обновление информации о риске
6. Уведомление владельца о новой оценке
7. Логирование события оценки

### Планирование мер по снижению

1. Проверка прав доступа к риску
2. Валидация плана мер
3. Создание записей о мерах
4. Назначение ответственных
5. Установка сроков выполнения
6. Обновление статуса риска на "mitigation"
7. Логирование события планирования

### Мониторинг риска

1. Проверка прав доступа к риску
2. Валидация данных мониторинга
3. Создание записи мониторинга
4. Обновление параметров риска при необходимости
5. Пересчет серьезности при изменении вероятности/влияния
6. Отправка уведомлений при значительных изменениях
7. Логирование события мониторинга

### Генерация отчета по рискам

1. Получение фильтров для отчета
2. Выборка рисков по критериям
3. Агрегация данных по категориям, серьезности, статусам
4. Расчет метрик (общее количество, распределение по серьезности)
5. Формирование структуры отчета
6. Экспорт в требуемый формат

## Интерфейсы

### REST API

#### Основные endpoints

- `POST /api/v1/risks` - Создание риска
- `GET /api/v1/risks` - Получение списка рисков
- `GET /api/v1/risks/{id}` - Получение риска
- `PUT /api/v1/risks/{id}` - Обновление риска
- `DELETE /api/v1/risks/{id}` - Удаление риска
- `POST /api/v1/risks/{id}/status` - Обновление статуса риска
- `GET /api/v1/risks/project/{projectId}` - Получение рисков проекта
- `GET /api/v1/risks/severity/{level}` - Получение рисков по уровню серьезности
- `POST /api/v1/risks/{id}/assessments` - Создание оценки риска
- `POST /api/v1/risks/{id}/mitigations` - Создание мер по снижению
- `POST /api/v1/risks/{id}/monitoring` - Создание записи мониторинга
- `GET /api/v1/risks/{id}/monitoring` - Получение истории мониторинга

#### DTO

```typescript
// DTO для создания риска
interface CreateRiskDTO {
  title: string;
  description: string;
  projectId: string;
  ownerId: string;
  probability: number;
  impact: number;
  category: 'technical' | 'schedule' | 'budget' | 'resource' | 'external';
  mitigationPlan: string;
  contingencyPlan: string;
  triggerConditions: string[];
  responseStrategy: 'avoid' | 'mitigate' | 'transfer' | 'accept';
}

// DTO для обновления риска
interface UpdateRiskDTO {
  title?: string;
  description?: string;
  ownerId?: string;
  probability?: number;
  impact?: number;
  category?: 'technical' | 'schedule' | 'budget' | 'resource' | 'external';
  mitigationPlan?: string;
  contingencyPlan?: string;
  triggerConditions?: string[];
  responseStrategy?: 'avoid' | 'mitigate' | 'transfer' | 'accept';
}

// DTO для обновления статуса риска
interface UpdateRiskStatusDTO {
  status: 'identified' | 'analyzed' | 'mitigation' | 'monitored' | 'closed' | 'realized';
}

// DTO для создания оценки риска
interface CreateAssessmentDTO {
  probability: number;
  impact: number;
  comments: string;
}

// DTO для создания меры по снижению
interface CreateMitigationDTO {
  action: string;
  responsibleId: string;
  dueDate: Date;
  cost: number;
}

// DTO для мониторинга риска
interface CreateMonitoringDTO {
  probability: number;
  impact: number;
  status: RiskStatus;
  comments: string;
}
```

### GraphQL

#### Типы

```graphql
type Risk {
  id: ID!
  title: String!
  description: String
  project: Project!
  owner: User!
  probability: Float!
  impact: Float!
  severity: RiskSeverity!
  category: RiskCategory!
  mitigationPlan: String
  contingencyPlan: String
  status: RiskStatus!
  triggerConditions: [String!]!
  responseStrategy: ResponseStrategy!
  assessments: [RiskAssessment!]!
  mitigations: [RiskMitigation!]!
  monitoringHistory: [RiskMonitoring!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum RiskSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RiskCategory {
  TECHNICAL
  SCHEDULE
  BUDGET
  RESOURCE
  EXTERNAL
}

enum RiskStatus {
  IDENTIFIED
  ANALYZED
  MITIGATION
  MONITORED
  CLOSED
  REALIZED
}

enum ResponseStrategy {
  AVOID
  MITIGATE
  TRANSFER
  ACCEPT
}

type RiskAssessment {
  id: ID!
  risk: Risk!
  assessedBy: User!
  probability: Float!
  impact: Float!
  severity: RiskSeverity!
  assessmentDate: DateTime!
  comments: String
}

type RiskMitigation {
  id: ID!
  risk: Risk!
  action: String!
  responsible: User!
  dueDate: DateTime!
  status: MitigationStatus!
  cost: Float
  effectiveness: Float
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum MitigationStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

type RiskMonitoring {
  id: ID!
  risk: Risk!
  monitoredAt: DateTime!
  probability: Float!
  impact: Float!
  status: RiskStatus!
  comments: String
  monitoredBy: User!
}

type RiskReport {
  projectId: ID!
  totalRisks: Int!
  bySeverity: [SeverityCount!]!
  byCategory: [CategoryCount!]!
  byStatus: [StatusCount!]!
  criticalRisks: [Risk!]!
  openRisks: Int!
  closedRisks: Int!
  reportDate: DateTime!
}

type SeverityCount {
  severity: RiskSeverity!
  count: Int!
}

type CategoryCount {
  category: RiskCategory!
  count: Int!
}

type StatusCount {
  status: RiskStatus!
  count: Int!
}
```

#### Запросы

```graphql
type Query {
  risks(filter: RiskFilter): [Risk!]!
  risk(id: ID!): Risk
  projectRisks(projectId: ID!): [Risk!]!
  riskAssessments(riskId: ID!): [RiskAssessment!]!
  riskMitigations(riskId: ID!): [RiskMitigation!]!
  riskMonitoringHistory(riskId: ID!): [RiskMonitoring!]!
  riskReport(projectId: ID!): RiskReport
  criticalRisks: [Risk!]!
}

type Mutation {
  createRisk(input: CreateRiskInput!): Risk!
  updateRisk(id: ID!, input: UpdateRiskInput!): Risk!
  updateRiskStatus(riskId: ID!, input: UpdateRiskStatusInput!): Risk!
  createRiskAssessment(riskId: ID!, input: CreateAssessmentInput!): RiskAssessment!
  createRiskMitigation(riskId: ID!, input: CreateMitigationInput!): RiskMitigation!
  updateRiskMitigation(mitigationId: ID!, input: UpdateMitigationInput!): RiskMitigation!
  createRiskMonitoring(riskId: ID!, input: CreateMonitoringInput!): RiskMonitoring!
}
```

## Интеграции

### Входящие интеграции

- Системы мониторинга для автоматического создания рисков
- Внешние источники информации о рисках (новости, отраслевые отчеты)
- Системы управления инцидентами для создания рисков на основе инцидентов

### Исходящие интеграции

- Уведомления в Slack/MS Teams о критических рисках
- Email уведомления о изменении статуса рисков
- Вебхуки для внешних систем управления
- Системы управления инцидентами для создания инцидентов на основе рисков

## Бизнес-правила

### Правила оценки

- Вероятность и влияние оцениваются по шкале от 0 до 1
- Серьезность рассчитывается как произведение вероятности и влияния
- При изменении вероятности или влияния серьезность пересчитывается автоматически
- Риски с серьезностью > 0.7 автоматически получают статус "critical"

### Правила статусов

- Риск может быть переведен в статус "mitigation" только при наличии плана мер
- Риск может быть закрыт только при выполнении всех мер по снижению
- При реализации риска (статус "realized") автоматически создается инцидент

### Правила мониторинга

- Критические риски мониторятся ежедневно
- Высокие риски мониторятся еженедельно
- Средние риски мониторятся ежемесячно
- При изменении серьезности частота мониторинга автоматически корректируется

### Правила уведомлений

- При создании критического риска отправляются уведомления всем заинтересованным сторонам
- При изменении статуса риска уведомляется владелец риска
- Еженедельный дайджест открытых рисков отправляется менеджерам проектов

## Отчетность

### Стандартные отчеты

- Реестр рисков (все риски с фильтрацией)
- Отчет по серьезности (распределение рисков по уровням)
- Отчет по категориям (распределение рисков по типам)
- Отчет по статусам (состояние рисков)
- Отчет по мерам (статус выполнения мер по снижению)
- Еженедельный дайджест (новые и измененные риски)

### Экспорт отчетов

- CSV для импорта в Excel
- PDF для печати и архивирования
- JSON для интеграции с другими системами
- Дашборд в формате HTML для веб-интерфейса

## Аудит и логирование

### События аудита

- Создание риска
- Изменение параметров риска
- Изменение статуса риска
- Создание оценки риска
- Создание мер по снижению
- Мониторинг риска
- Закрытие риска

### Логирование

- Все изменения риска логируются с указанием пользователя
- Логи доступны через API аудита
- Логи экспортируются для архивирования
- Логи включают историю изменений всех параметров риска
